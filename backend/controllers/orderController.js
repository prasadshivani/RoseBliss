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
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order Updated Successfully",
      order,
    });
  } catch (error) {
    console.log("UPDATE ORDER ERROR =>", error);

    res.status(500).json({
      success: false,
      message: "Could not update order",
    });
  }
};
// ===============================
// User - Cancel Order
// ===============================
const cancelOrder = async (req, res) => {
  try {
    console.log("===== CANCEL ORDER HIT =====");
    console.log("ORDER ID =>", req.params.id);
    console.log("USER =>", req.user);

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

    console.log("ORDER FOUND =>", order._id);
    console.log("CURRENT STATUS =>", order.orderStatus);

    if (order.orderStatus !== "Placed") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because its status is ${order.orderStatus}`,
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();
    // Restore product stock
for (const item of order.items) {
  await Product.findByIdAndUpdate(
    item.productId,
    {
      $inc: {
        stock: item.quantity,
      },
    }
  );
}

    console.log("ORDER CANCELLED =>", order._id);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.error("CANCEL ORDER ERROR =>", error);

    res.status(500).json({
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