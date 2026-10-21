
const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const verifyToken = require("../middleware/authMiddleware");
const {
  validateOrderPlace,
} = require("../middleware/validationMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Place Order
router.post(
  "/place",
  verifyToken,
  validateOrderPlace,
  placeOrder
);

// Customer - Get Own Orders
router.get(
  "/my-orders",
  verifyToken,
  getMyOrders
);

// Admin - Get All Orders
router.get(
  "/admin/all",
  verifyToken,
  adminMiddleware,
  getAllOrders
);

// Admin - Update Order Status and Tracking
router.put(
  "/admin/update/:id",
  verifyToken,
  adminMiddleware,
  updateOrderStatus
);

// Customer - Cancel Own Order
router.put(
  "/cancel/:id",
  verifyToken,
  cancelOrder
);

module.exports = router;
