const express = require("express");
const {
  createRazorpayOrder,
  verifyPaymentAndPlaceOrder,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPaymentAndPlaceOrder);

module.exports = router;