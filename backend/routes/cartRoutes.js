const express = require("express");
const {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/update", updateQuantity);
router.delete("/remove", removeFromCart);
router.post("/clear", clearCart);

module.exports = router;