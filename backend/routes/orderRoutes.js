const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const verifyToken = require("../middleware/authMiddleware");

const {
  validateOrderPlace,
} = require("../middleware/validationMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post(
  "/place",
  verifyToken,
  validateOrderPlace,
  placeOrder
);

router.get(
  "/:userId",
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

// Admin - Update Order Status
router.put(
  "/admin/update/:id",
  verifyToken,
  adminMiddleware,
  updateOrderStatus
);

module.exports = router;