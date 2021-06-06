const { Tag, Product, ProductTag } = require("../models");

const getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.findAll({
      include: [
        { model: Product, attributes: ["product_name", "price", "stock"] },
      ],
    });
    res.json(allTags);
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`);
    res.status(500).json({
      error: "Failed to get tags",
    });
  }
};

const getTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        { model: Product, attributes: ["product_name", "price", "stock"] },
      ],
    });

    if (!tag) {
      console.log(`[INVALID ID]: Unable to get tag by ID`);
      return res.status(404).json({
        error: "Tag does not exist.",
      });
    }

    res.json(tag);
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`);
    res.status(500).json({
      error: "Failed to get tag",
    });
  }
};

const createTag = async (req, res) => {
  try {
    const { tag_name } = req.body;

    if (!tag_name) {
      console.log(`[ERROR]: Unable to create a tag`);
      return res.status(404).json({
        error: "Unable to create a tag",
      });
    }

    const newTag = await Tag.create(req.body);
    res.json(newTag);
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    res.status(500).json({
      error: "Failed to create tag",
    });
  }
};

const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    const { tag_name } = req.body;

    // if the tag ID doesn't exist
    if (!tag) {
      console.log(`[INVALID TAG ID]: Unable to update the tag.`);
      return res.status(404).json({
        error: "Tag does not exist.",
      });
    }

    // if the request body doesn't have a tag name in it
    if (!tag_name) {
      console.log(`[ERROR]: Unable to update the tag`);
      return res.status(404).json({
        error: "Unable to update the tag",
      });
    }

    const newTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json(newTag);
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    res.status(500).json({
      error: "Failed to update tag",
    });
  }
};

const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      console.log(`[ERROR]: Tag does not exist.`);
      return res.status(404).json({
        error: "Tag does not exist.",
      });
    }

    const newTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(newTag);
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    res.status(500).json({
      error: "Failed to delete tag",
    });
  }
};

module.exports = {
  getAllTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
};
