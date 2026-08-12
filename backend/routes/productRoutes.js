const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const verifyToken = require("../middleware/authMiddleware");

const {
  addProduct,
  getProducts,
  getProductById,
  searchProducts,
  addReview,
} = require("../controllers/productController");


router.post("/", upload.single("image"), addProduct);

router.get("/", getProducts);

router.get("/search", searchProducts);

// Add Review
router.post(
  "/review/:id",
  verifyToken,
  addReview
);

router.get("/:id", getProductById);

module.exports = router;