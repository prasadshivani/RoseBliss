
const express = require("express");

const {
  createRazorpayOrder,
  verifyPaymentAndPlaceOrder,
  requestOrderRefund,
} = require("../controllers/paymentController");

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Razorpay payment routes
router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPaymentAndPlaceOrder);

// Only authenticated admins can request a refund
router.post(
  "/refund/:orderId",
  verifyToken,
  adminMiddleware,
  requestOrderRefund
);

module.exports = router;
