const express = require("express");

const {
  addProduct,
  getProducts,
  getProductById,
  searchProducts,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", addProduct);
router.get("/", getProducts);

// ✅ /search pehle — /:id se upar
router.get("/search", searchProducts);

// ✅ /:id baad mein
router.get("/:id", getProductById);

module.exports = router;