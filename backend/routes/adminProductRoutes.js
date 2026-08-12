const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminProductController");

router.post(
  "/add-product",
  verifyToken,
  adminMiddleware,
  upload.single("image"),
  addProduct
);

router.get(
  "/products",
  verifyToken,
  adminMiddleware,
  getProducts
);

router.get(
  "/product/:id",
  verifyToken,
  adminMiddleware,
  getProductById
);

router.put(
  "/product/:id",
  verifyToken,
  adminMiddleware,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/product/:id",
  verifyToken,
  adminMiddleware,
  deleteProduct
);

module.exports = router;