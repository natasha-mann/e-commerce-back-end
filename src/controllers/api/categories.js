const { Category, Product } = require("../../models");

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.findAll({
      include: [
        { model: Product, attributes: ["product_name", "price", "stock"] },
      ],
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
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        { model: Product, attributes: ["product_name", "price", "stock"] },
      ],
    });

    if (!category) {
      console.log(`[INVALID ID]: Unable to get category by ID`);
      return res.status(404).json({
        error: "Category does not exist",
      });
    }

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

    if (!category_name) {
      console.log(`[ERROR]: Unable to create a category`);
      return res.status(404).json({
        error: "Unable to create a category",
      });
    }

    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    res.status(500).json({
      error: "Failed to create category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    const { category_name } = req.body;

    // if the category trying to be updated doesn't exist
    if (!category) {
      console.log(`[INVALID CATEGORY ID]: Unable to update the category.`);
      return res.status(404).json({
        error: "Category does not exist.",
      });
    }

    // if the request body doesn't contain new category information
    if (!category_name) {
      console.log(`[ERROR]: Unable to update the category`);
      return res.status(404).json({
        error: "Unable to update the category",
      });
    }

    const newCategory = await Category.update(
      { category_name },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.json(newCategory);
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    res.status(500).json({
      error: "Failed to update category",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      console.log(`[ERROR]: Unable to delete the category`);
      return res.status(404).json({
        error: "Unable to delete the category",
      });
    }

    const newCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(newCategory);
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
