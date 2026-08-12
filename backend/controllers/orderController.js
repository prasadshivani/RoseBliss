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

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};