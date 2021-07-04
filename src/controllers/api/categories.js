const { Category, Product } = require("../../models");

const PRODUCT_ATTRIBUTES = ["product_name", "price", "stock"];

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

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product, attributes: PRODUCT_ATTRIBUTES }],
    });

    return res.json(categories);
  } catch (error) {
    return handleError(req, res, "Failed to get categories", error);
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product, attributes: PRODUCT_ATTRIBUTES }],
    });

    if (!category) {
      return handleError(req, res, "Category does not exist", undefined, 404);
    }

    return res.json(category);
  } catch (error) {
    return handleError(req, res, "Failed to get category", error);
  }
};

const createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return handleError(
        req,
        res,
        "Unable to create a category",
        undefined,
        400
      );
    }

    const newCategory = await Category.create(req.body);
    return res.json(newCategory);
  } catch (error) {
    return handleError(req, res, "Failed to create category", error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const { id } = req.params;

    if (!category_name) {
      return handleError(
        req,
        res,
        "Unable to update the category",
        undefined,
        400
      );
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return handleError(
        req,
        res,
        "Unable to update the category",
        undefined,
        404
      );
    }

    const newCategory = await Category.update(
      { category_name },
      { where: { id } }
    );

    return res.json({ success: !!newCategory });
  } catch (error) {
    return handleError(req, res, "Failed to update category", error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return handleError(
        req,
        res,
        "Unable to delete the category",
        undefined,
        404
      );
    }

    const newCategory = await Category.destroy({ where: { id } });

    return res.json({ success: !!newCategory });
  } catch (error) {
    return handleError(req, res, "Failed to delete category", error);
  }
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
