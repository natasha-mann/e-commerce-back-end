const { Product, Category, Tag, ProductTag } = require("../../models");

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      attributes: ["id", "product_name", "price", "stock"],
      include: [{ model: Category }, { model: Tag }],
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
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: ["id", "product_name", "price", "stock"],
      include: [Category, Tag],
    });

    if (!product) {
      console.log(`[ERROR]: Product does not exist`);
      return res.status(404).json({
        error: "Product does not exist.",
      });
    }

    res.json(product);
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`);
    res.status(500).json({
      error: "Failed to get product",
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const newRequest = {
      product_name: req.body.productName,
      price: req.body.price,
      stock: req.body.stock,
      tagIds: req.body.tagIds,
      category_id: req.body.categoryId,
    };
    const newProduct = await Product.create(newRequest);

    // if tagIds is included as a key in update request
    if (req.body.tagIds) {
      // and if it is not an empty array
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: newProduct.id,
            tag_id,
          };
        });
        await ProductTag.bulkCreate(productTagIdArr);
      }
    }

    res.status(200).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Failed to add product",
    });
  }
};

const updateProduct = async (req, res) => {
  // update product data
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, Tag],
    });

    if (!product) {
      console.log(`[ERROR]: Product does not exist`);
      return res.status(404).json({
        error: "Product does not exist.",
      });
    }

    const newRequest = {
      product_name: req.body.productName,
      price: req.body.price,
      stock: req.body.stock,
      tagIds: req.body.tagIds,
      category_id: req.body.categoryId,
    };

    const updatedProduct = await Product.update(newRequest, {
      where: {
        id: req.params.id,
      },
    });

    // create filtered list of new tag_ids
    if (!req.body.tagIds) {
      return res.json(updatedProduct);
    }

    // find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({
      where: { product_id: req.params.id },
    });

    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);

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
    const deletedTags = await ProductTag.destroy({
      where: { id: productTagsToRemove },
    });
    // run both actions
    const newTags = await ProductTag.bulkCreate(newProductTags);

    const updatedProductTags = [deletedTags, newTags];

    return res.json({ ...updatedProduct, ...updatedProductTags });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      console.log(`[ERROR]: Product does not exist`);
      return res.status(404).json({
        error: "Unable to delete the product",
      });
    }

    const newProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(newProduct);
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    res.status(500).json({
      error: "Failed to delete product",
    });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};