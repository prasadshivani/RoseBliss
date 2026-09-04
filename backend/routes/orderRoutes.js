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


// ===============================
// Place Order
// ===============================
router.post(
  "/place",
  verifyToken,
  validateOrderPlace,
  placeOrder
);


// ===============================
// Admin - Get All Orders
// ===============================
router.get(
  "/admin/all",
  verifyToken,
  adminMiddleware,
  getAllOrders
);


// ===============================
// Admin - Update Order Status
// ===============================
router.put(
  "/admin/update/:id",
  verifyToken,
  adminMiddleware,
  updateOrderStatus
);


// ===============================
// User - Cancel Order
// ===============================
router.put(
  "/cancel/:id",
  verifyToken,
  cancelOrder
);


// ===============================
// User - Get My Orders
// ===============================
router.get(
  "/:userId",
  verifyToken,
  getMyOrders
);


module.exports = router;