const { Product, Category, Tag, ProductTag } = require("../../models");

const PRODUCT_ATTRIBUTES = ["id", "product_name", "price", "stock"];

const handleError = (req, res, message, error = {}, statusCode = 500) => {
  if (statusCode === 500) {
    console.error(`ERROR | ${req.method} | ${req.baseUrl} | ${error.message}`);
    return res.status(500).json({ error: message });
  } else {
    console.error(`ERROR | ${req.method} | ${req.baseUrl} | ${message}`);
    return res.status(statusCode).json({
      error: message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      attributes: PRODUCT_ATTRIBUTES,
      include: [{ model: Category }, { model: Tag }],
    });

    return res.json(allProducts);
  } catch (error) {
    return handleError(req, res, "Failed to get products", error);
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: PRODUCT_ATTRIBUTES,
      include: [Category, Tag],
    });

    if (!product) {
      return handleError(req, res, "Product does not exist", undefined, 400);
    }

    return res.json(product);
  } catch (error) {
    return handleError(req, res, "Failed to get product", error);
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

    return res.status(200).json(newProduct);
  } catch (error) {
    return handleError(req, res, "Failed to add product", error);
  }
};

const updateProduct = async (req, res) => {
  // update product data
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, Tag],
    });

    if (!product) {
      return handleError(req, res, "Product does not exist", undefined, 400);
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
    return handleError(req, res, "Failed to update product", error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return handleError(
        req,
        res,
        "Unable to delete the product",
        undefined,
        400
      );
    }

    const newProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json({ success: !!newProduct });
  } catch (error) {
    return handleError(req, res, "Failed to delete product", error);
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
