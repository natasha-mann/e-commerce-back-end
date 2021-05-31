const { Tag, Product, ProductTag } = require("../models");

const getAllTags = async (req, res) => {
  // find all tags
  // be sure to include its associated Product data

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
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        { model: Product, attributes: ["product_name", "price", "stock"] },
      ],
    });
    if (tag) {
      res.json(tag);
    } else {
      console.log(`[INVALID ID]: Unable to get tag by ID`);
      res.status(404).json({
        error: "Unable to get tag by ID",
      });
    }
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
    if (tag_name) {
      const newTag = await Tag.create(req.body);
      res.json(newTag);
    } else {
      console.log(`[ERROR]: Unable to create a tag`);
      res.status(404).json({
        error: "Unable to create a tag",
      });
    }
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
    if (tag) {
      if (tag_name) {
        const newTag = await Tag.update(req.body, {
          where: {
            id: req.params.id,
          },
        });
        res.json(newTag);
      } else {
        console.log(`[ERROR]: Unable to update the tag`);
        res.status(404).json({
          error: "Unable to update the tag",
        });
      }
    } else {
      console.log(`[INVALID TAG ID]: Unable to update the tag.`);
      res.status(404).json({
        error: "Tag does not exist.",
      });
    }
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

    if (tag) {
      const newTag = await Tag.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.json(newTag);
    } else {
      console.log(`[ERROR]: Unable to delete the tag`);
      res.status(404).json({
        error: "Unable to delete the tag",
      });
    }
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
