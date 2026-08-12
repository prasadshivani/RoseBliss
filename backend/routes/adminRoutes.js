const express = require("express");
const upload = require("../config/multer");

const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboard,
  getAllOrders,
} = require("../controllers/adminController");

router.get(
  "/dashboard",
  verifyToken,
  adminMiddleware,
  getDashboard
);
router.get(
  "/orders",
  verifyToken,
  adminMiddleware,
  getAllOrders
);
// Add Product
router.post(
  "/add-product",
  verifyToken,
  adminMiddleware,
  upload.single("image"),
  addProduct
);

// Update Product
router.put(
  "/update-product/:id",
  verifyToken,
  adminMiddleware,
  upload.single("image"),
  updateProduct
);

// Delete Product
router.delete(
  "/delete-product/:id",
  verifyToken,
  adminMiddleware,
  deleteProduct
);

// Get All Products
router.get(
  "/products",
  verifyToken,
  adminMiddleware,
  getProducts
);

// Get Single Product
router.get(
  "/product/:id",
  verifyToken,
  adminMiddleware,
  getProductById
);
module.exports = router;