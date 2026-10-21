const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/product");

const placeOrder = async (req, res) => {
  console.log("===== PLACE ORDER HIT =====");
  console.log("USER =>", req.user);
  console.log("BODY =>", req.body);

  try {
    const { items, total, shippingDetails, paymentId } = req.body;
    const userId = req.user.id;

    const order = await Order.create({
      userId,
      items,
      total,
      shippingDetails,
      paymentId,
    });
    // Reduce Product Stock
for (const item of items) {
  await Product.findByIdAndUpdate(
    item.productId,
    {
      $inc: {
        stock: -item.quantity,
      },
    }
  );
}
await Cart.deleteMany({
  userId,
});
    console.log("ORDER CREATED =>", order);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR =>", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch orders",
    });
  }
};
// ===============================
// Admin - Get All Orders
// ===============================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("GET ALL ORDERS ERROR =>", error);

    res.status(500).json({
      success: false,
      message: "Could not fetch orders",
    });
  }
};

// ===============================
// Admin - Update Order Status
// ===============================

const updateOrderStatus = async (req, res) => {
  try {
    const {
      orderStatus,
      courierName,
      trackingNumber,
      trackingUrl,
      note,
    } = req.body;

    const allowedStatuses = [
      "Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const allowedTransitions = {
      Placed: ["Processing", "Cancelled"],
      Processing: ["Shipped", "Cancelled"],
      Shipped: ["Out for Delivery"],
      "Out for Delivery": ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    if (!allowedTransitions[order.orderStatus]?.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.orderStatus} to ${orderStatus}`,
      });
    }

    // Paid Razorpay orders need a refund workflow before cancellation.
    if (
      orderStatus === "Cancelled" &&
      order.paymentMethod === "Razorpay" &&
      order.paymentStatus === "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message: "Process the Razorpay refund before cancelling this paid order.",
      });
    }

    order.orderStatus = orderStatus;

    if (courierName !== undefined) {
      order.courierName = courierName;
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    if (trackingUrl !== undefined) {
      order.trackingUrl = trackingUrl;
    }

    order.trackingHistory.push({
      status: orderStatus,
      note: note || `Order status updated to ${orderStatus}`,
      updatedAt: new Date(),
    });

    await order.save();

    // Restore stock when an eligible order is cancelled.
    if (orderStatus === "Cancelled") {
      for (const item of order.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Could not update order status",
    });
  }
};

// ===============================
// User - Cancel Order
// ===============================

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["Placed", "Processing"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled when status is ${order.orderStatus}`,
      });
    }

    // Do not cancel a paid Razorpay order until refunds are integrated.
    if (
      order.paymentMethod === "Razorpay" &&
      order.paymentStatus === "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order requires refund processing before cancellation.",
      });
    }

    const { cancellationReason } = req.body;

    order.orderStatus = "Cancelled";
    order.cancellationReason = cancellationReason || "";
    order.trackingHistory.push({
      status: "Cancelled",
      note: cancellationReason || "Order cancelled by customer",
      updatedAt: new Date(),
    });

    await order.save();

    // Restore stock only after a successful cancellation.
    for (const item of order.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("CANCEL ORDER ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};