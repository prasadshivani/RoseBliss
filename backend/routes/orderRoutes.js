const express = require("express");
const { placeOrder, getMyOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/place", placeOrder);
router.get("/:userId", getMyOrders);

module.exports = router;