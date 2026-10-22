const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order");
const Cart = require("../models/cart");

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


const requestOrderRefund = async (req, res) => {
  try {
    // This endpoint must be restricted to authorized admins.
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.paymentMethod !== "Razorpay" ||
      !order.paymentId ||
      order.paymentStatus !== "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message: "No eligible paid Razorpay order found",
      });
    }

    if (
      ["Pending", "Processed"].includes(order.refundStatus) ||
      order.paymentStatus === "Refund Pending" ||
      order.paymentStatus === "Refunded"
    ) {
      return res.status(400).json({
        success: false,
        message: "Refund is already pending or completed",
      });
    }

    // Verify the payment directly with Razorpay.
    const payment = await razorpay.payments.fetch(order.paymentId);

    if (
      payment.status !== "captured" ||
      payment.amount !== Math.round(order.total * 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment is not captured or amount does not match",
      });
    }

    // Mark pending before making the external API request.
    order.refundStatus = "Pending";
    order.paymentStatus = "Refund Pending";
    await order.save();

    try {
      const refund = await razorpay.payments.refund(
        order.paymentId,
        {
          amount: payment.amount,
          notes: {
            orderId: String(order._id),
            reason: "RoseBliss order refund",
          },
        }
      );

      order.refundId = refund.id;

      if (refund.status === "processed") {
        order.refundStatus = "Processed";
        order.paymentStatus = "Refunded";
      } else if (refund.status === "failed") {
        order.refundStatus = "Failed";
        order.paymentStatus = "Paid";
      }

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Refund request submitted to Razorpay",
        refundId: refund.id,
        refundStatus: order.refundStatus,
        order,
      });
    } catch (refundError) {
      console.error("RAZORPAY REFUND ERROR =>", refundError);

      // Keep the order pending if the result is uncertain.
      // Check Razorpay Dashboard before attempting another refund.
      return res.status(502).json({
        success: false,
        message:
          "Refund result could not be confirmed. Check Razorpay Dashboard before retrying.",
      });
    }
  } catch (error) {
    console.error("REFUND REQUEST ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Could not verify payment or request refund",
    });
  }
};


module.exports = {
  createRazorpayOrder,
  verifyPaymentAndPlaceOrder,
  requestOrderRefund,
};