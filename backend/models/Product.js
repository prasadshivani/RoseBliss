const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      enum: ["Lipsticks", "Skincare", "Makeupkits", "Perfumes"],
    },

    stock: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);