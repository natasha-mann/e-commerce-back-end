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

const createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    if (category_name) {
      const newCategory = await Category.create(req.body);
      res.json(newCategory);
    } else {
      console.log(`[ERROR]: Unable to create a category`);
      res.status(404).json({
        error: "Unable to create a category",
      });
    }
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    res.status(500).json({
      error: "Failed to create category",
    });
  }
};

const updateCategory = async (req, res) => {
  // update a category by its `id` value
  try {
    const { category_name } = req.body;
    if (category_name) {
      const newCategory = await Category.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      res.json(newCategory);
    } else {
      console.log(`[ERROR]: Unable to update the category`);
      res.status(404).json({
        error: "Unable to update the category",
      });
    }
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    res.status(500).json({
      error: "Failed to update category",
    });
  }
};

const deleteCategory = async (req, res) => {
  // delete a category by its `id` value
  try {
    const category = await Category.findByPk(req.params.id);

    if (category) {
      const newCategory = await Category.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.json(newCategory);
    } else {
      console.log(`[ERROR]: Unable to delete the category`);
      res.status(404).json({
        error: "Unable to delete the category",
      });
    }
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    res.status(500).json({
      error: "Failed to delete category",
    });
  }
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
