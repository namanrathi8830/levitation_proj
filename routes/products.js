const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  clearAllProducts,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { validateProduct } = require("../middleware/validation");

const router = express.Router();

// Protect all product routes
router.use(protect);

// @route   GET /api/products
// @route   POST /api/products
router.route("/").get(getProducts).post(validateProduct, createProduct);

// Add route to clear all products for user
router.delete("/clear", clearAllProducts);

// @route   GET /api/products/:id
// @route   PUT /api/products/:id
// @route   DELETE /api/products/:id
router
  .route("/:id")
  .get(getProduct)
  .put(validateProduct, updateProduct)
  .delete(deleteProduct);

module.exports = router;
