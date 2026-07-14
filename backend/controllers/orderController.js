const Order = require("../models/Order");

const placeOrder = async (req, res) => {
  try {
    const { userId, items, total, shippingDetails, paymentId } = req.body;

    const order = await Order.create({
      userId,
      items,
      total,
      shippingDetails,
      paymentId,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("PLACE ORDER ERROR =>", error);
    res.status(500).json({ success: false, message: "Could not place order" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("GET ORDERS ERROR =>", error);
    res.status(500).json({ success: false, message: "Could not fetch orders" });
  }
};

module.exports = { placeOrder, getMyOrders };