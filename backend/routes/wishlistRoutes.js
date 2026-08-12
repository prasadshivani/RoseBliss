const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  addWishlist,
  getWishlist,
  removeWishlist,
} = require("../controllers/wishlistController");

const {
  validateWishlistAdd,
  validateWishlistRemove,
} = require("../middleware/validationMiddleware");

// Add to Wishlist
router.post(
  "/add",
  verifyToken,
  validateWishlistAdd,
  addWishlist
);

// Get Wishlist
router.get(
  "/",
  verifyToken,
  getWishlist
);

// Remove Wishlist
router.delete(
  "/remove",
  verifyToken,
  validateWishlistRemove,
  removeWishlist
);

module.exports = router;