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
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    shippingDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },

    // Payment details
    paymentId: String,

    paymentMethod: {
      type: String,
      enum: ["Razorpay", "COD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refund Pending", "Refunded"],
      default: "Pending",
    },

    // Order and delivery status
    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },

    // Shipment information
    courierName: {
      type: String,
      default: "",
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    trackingUrl: {
      type: String,
      default: "",
    },

    // Status update history
    trackingHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        note: {
          type: String,
          default: "",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Cancellation and refund
    cancellationReason: {
      type: String,
      default: "",
    },

    refundStatus: {
      type: String,
      enum: ["Not Required", "Pending", "Processed", "Failed"],
      default: "Not Required",
    },

    refundId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
