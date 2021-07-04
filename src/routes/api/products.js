const { Router } = require("express");

const router = Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/api/products");

// The `/api/products` endpoint

// get all products
router.get("/", getAllProducts);

// get one product
router.get("/:id", getProduct);

// create new product
router.post("/", createProduct);

// update product
router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
