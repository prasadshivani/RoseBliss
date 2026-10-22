const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
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

    // ⭐ Reviews
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        name: {
          type: String,
        },

        rating: {
          type: Number,
          required: true,
        },

        comment: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ⭐ Total Reviews
    numReviews: {
      type: Number,
      default: 0,
    },

    // ⭐ Average Rating
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto Generate Product ID
productSchema.pre("save", async function () {
  if (this.productId) return;

  const lastProduct = await this.constructor
    .findOne()
    .sort({ productId: -1 });

  this.productId = lastProduct ? lastProduct.productId + 1 : 1;
});

module.exports = mongoose.model("Product", productSchema);