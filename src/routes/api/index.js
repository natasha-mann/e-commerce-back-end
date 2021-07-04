const { Router } = require("express");

const categories = require("./categories");
const products = require("./products");
const tags = require("./tags");

const router = Router();

router.use("/categories", categories);
router.use("/products", products);
router.use("/tags", tags);

module.exports = router;
