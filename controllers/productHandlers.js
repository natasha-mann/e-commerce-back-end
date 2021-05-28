const { Product, Category, Tag, ProductTag } = require("../models");

const getAllProducts = async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const allProducts = await Product.findAll({
      include: [Category, Tag],
    });
    res.json(allProducts);
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`);
    res.status(500).json({
      error: "Failed to get products",
    });
  }
};

const getProduct = async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, Tag],
    });
    if (product) {
      res.json(product);
    } else {
      console.log(`[INVALID ID]: Unable to get product by ID`);
      res.status(404).json({
        error: "Unable to get product by ID",
      });
    }
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`);
    res.status(500).json({
      error: "Failed to get product",
    });
  }
};

const createProduct = async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const { id, product_name, price, stock, tagIds } = await Product.create(
      req.body
    );
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: id,
          tag_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      const newObject = {
        product_name,
        price,
        stock,
        tagIds,
        ...productTagIds,
      };
      console.log(newObject);
      res.status(200).json(newObject);
    } else {
      console.log("NEW", newProduct);
      res.status(200).json(newProduct);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const updateProduct = (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
};

const deleteProduct = (req, res) => {
  // delete one product by its `id` value
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
