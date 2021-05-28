const { Category, Product } = require("../models");

const getAllCategories = async (req, res) => {
  // find all categories
  // be sure to include its associated Products

  try {
    const allCategories = await Category.findAll({
      include: [Product],
    });
    res.json(allCategories);
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`);
    res.status(500).json({
      error: "Failed to get categories",
    });
  }
};

const getCategory = async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [Product],
    });
    res.json(category);
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`);
    res.status(500).json({
      error: "Failed to get category",
    });
  }
};

const createCategory = (req, res) => {
  // create a new category
};

const updateCategory = (req, res) => {
  // update a category by its `id` value
};

const deleteCategory = (req, res) => {
  // delete a category by its `id` value
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
