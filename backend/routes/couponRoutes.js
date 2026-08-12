const express = require("express");

const {
  createCoupon,
  getCoupons,
  applyCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin - Create Coupon
router.post(
  "/create",
  verifyToken,
  adminMiddleware,
  createCoupon
);

// Admin - Get All Coupons
router.get(
  "/all",
  verifyToken,
  adminMiddleware,
  getCoupons
);

// User - Apply Coupon
router.post(
  "/apply",
  verifyToken,
  applyCoupon
);

// Admin - Delete Coupon
router.delete(
  "/:id",
  verifyToken,
  adminMiddleware,
  deleteCoupon
);

module.exports = router;