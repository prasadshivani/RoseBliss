const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step A: Razorpay order banao
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay paise mein leta hai
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE RAZORPAY ORDER ERROR =>", error);
    res.status(500).json({ success: false, message: "Could not create payment order" });
  }
};

// Step B: Payment verify karo aur order save karo
const verifyPaymentAndPlaceOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      items,
      total,
      shippingDetails,
    } = req.body;

    // ✅ Signature verify karo — ye confirm karta hai payment genuine hai
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ✅ Sirf verified payment ke baad hi order save hoga
    const order = await Order.create({
      userId,
      items,
      total,
      shippingDetails,
      paymentId: razorpay_payment_id,
      orderStatus: "Confirmed",
    });

    // Cart clear karo
    await Cart.deleteMany({ userId });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR =>", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = { createRazorpayOrder, verifyPaymentAndPlaceOrder };