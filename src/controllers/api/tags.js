const { Tag, Product, ProductTag } = require("../../models");

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

const getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.findAll({
      include: [{ model: Product, attributes: PRODUCT_ATTRIBUTES }],
    });
    return res.json(allTags);
  } catch (error) {
    return handleError(req, res, "Failed to get tags", error);
  }
};

const getTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, attributes: PRODUCT_ATTRIBUTES }],
    });

    if (!tag) {
      return handleError(req, res, "Tag does not exist", undefined, 404);
    }

    return res.json(tag);
  } catch (error) {
    return handleError(req, res, "Failed to get tag", error);
  }
};

const createTag = async (req, res) => {
  try {
    const { tag_name } = req.body;

    if (!tag_name) {
      return handleError(req, res, "Unable to create a tag", undefined, 400);
    }

    const newTag = await Tag.create(req.body);
    res.json(newTag);
  } catch (error) {
    return handleError(req, res, "Failed to create tag", error);
  }
};

const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    const { tag_name } = req.body;

    // if the tag ID doesn't exist
    if (!tag) {
      return handleError(req, res, "Unable to update the tag", undefined, 400);
    }

    // if the request body doesn't have a tag name in it
    if (!tag_name) {
      return handleError(req, res, "Unable to update the tag", undefined, 404);
    }

    const newTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: !!newTag });
  } catch (error) {
    return handleError(req, res, "Failed to update tag", error);
  }
};

const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return handleError(req, res, "Unable to delete the tag", undefined, 404);
    }

    const newTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: !!newTag });
  } catch (error) {
    return handleError(req, res, "Failed to delete tag", error);
  }
};

module.exports = {
  getAllTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
};
