const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===============================
// STEP A: RAZORPAY ORDER CREATE
// ===============================
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE RAZORPAY ORDER ERROR =>", error);

    res.status(500).json({
      success: false,
      message: "Could not create payment order",
    });
  }
};

// =====================================
// STEP B: VERIFY PAYMENT + SAVE ORDER
// =====================================
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

    // -------------------------------
    // 1. Required fields check
    // -------------------------------
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing",
      });
    }

    // -------------------------------
    // 2. Razorpay signature verify
    // -------------------------------
    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    console.log("RAZORPAY PAYMENT VERIFIED ✅");
    console.log("PAYMENT ID =>", razorpay_payment_id);

    // -------------------------------
    // 3. Order database mein save karo
    // -------------------------------
    const order = await Order.create({
      userId,
      items,
      total,
      shippingDetails,

      paymentId: razorpay_payment_id,

      paymentMethod: "Razorpay",

      paymentStatus: "Paid",

      orderStatus: "Placed",
    });

    // -------------------------------
    // 4. Cart clear karo
    // -------------------------------
    await Cart.deleteMany({ userId });

    // -------------------------------
    // 5. Response
    // -------------------------------
    res.status(201).json({
      success: true,
      message: "Payment successful and order placed",
      order,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR =>", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentAndPlaceOrder,
};