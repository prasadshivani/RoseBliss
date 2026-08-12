const express = require("express");

const {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const verifyToken = require("../middleware/authMiddleware");

const {
  validateCartAdd,
  validateCartUpdate,
  validateCartRemove,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/add",
  verifyToken,
  validateCartAdd,
  addToCart
);

router.get(
  "/",
  verifyToken,
  getCart
);

router.put(
  "/update",
  verifyToken,
  validateCartUpdate,
  updateQuantity
);

router.delete(
  "/remove",
  verifyToken,
  validateCartRemove,
  removeFromCart
);

router.post(
  "/clear",
  verifyToken,
  clearCart
);

module.exports = router;