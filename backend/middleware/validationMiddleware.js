const mongoose = require("mongoose");

// Register Validation
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  next();
};

// Login Validation
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required",
    });
  }

  next();
};

// Cart Add
const validateCartAdd = (req, res, next) => {
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Product ID",
    });
  }

  next();
};

// Cart Remove
const validateCartRemove = validateCartAdd;

// Cart Update
const validateCartUpdate = (req, res, next) => {
  const { productId, action } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Product ID",
    });
  }

  if (!["increase", "decrease"].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Invalid action",
    });
  }

  next();
};

// Wishlist Add
const validateWishlistAdd = (req, res, next) => {
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Product ID",
    });
  }

  next();
};

// Wishlist Remove
const validateWishlistRemove = validateWishlistAdd;

// Order
const validateOrderPlace = (req, res, next) => {
  const { items, total, shippingDetails } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Items are required",
    });
  }

  if (!total || total <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid total amount",
    });
  }

  const requiredFields = [
    "name",
    "email",
    "phone",
    "address",
    "city",
    "pincode",
  ];

  for (const field of requiredFields) {
    if (!shippingDetails?.[field]) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`,
      });
    }
  } 

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCartAdd,
  validateCartRemove,
  validateCartUpdate,
  validateWishlistAdd,
  validateWishlistRemove,
  validateOrderPlace,
};