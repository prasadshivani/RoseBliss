const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    shippingDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },
    paymentId: String,
    paymentStatus: {
      type: String,
      default: "SUCCESS",
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);