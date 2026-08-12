const Cart = require("../models/Cart");

// Add to Cart (ya quantity badhao agar already hai)
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId zaroori hai",
      });
    }

    // Ownership/existence check matching both req.user.id and productId
    let item = await Cart.findOne({ userId, productId });

    if (item) {
      item.quantity += 1;
      await item.save();
    } else {
      item = await Cart.create({ userId, productId, quantity: 1 });
    }

    const populated = await item.populate("productId");

    res.status(200).json({ success: true, cartItem: populated });
  } catch (error) {
    console.error("ADD TO CART ERROR =>", error);
    res.status(500).json({ success: false, message: "Could not add item to cart" });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.find({ userId }).populate("productId");

    // Orphan cleanup
    const orphanIds = cart.filter((i) => !i.productId).map((i) => i._id);
    if (orphanIds.length > 0) {
      await Cart.deleteMany({ _id: { $in: orphanIds } });
    }
    cart = cart.filter((i) => i.productId);

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("GET CART ERROR =>", error);
    res.status(500).json({ success: false, message: "Could not fetch cart" });
  }
};

// Update Quantity
const updateQuantity = async (req, res) => {
  try {
    const { productId, action } = req.body; // action: "increase" | "decrease"
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId zaroori hai" });
    }

    // Ownership check: must match both productId and req.user.id
    const item = await Cart.findOne({ userId, productId });
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in your cart" });
    }

    if (action === "increase") item.quantity += 1;
    if (action === "decrease" && item.quantity > 1) item.quantity -= 1;

    await item.save();
    res.status(200).json({ success: true, cartItem: item });
  } catch (error) {
    console.error("UPDATE QUANTITY ERROR =>", error);
    res.status(500).json({ success: false, message: "Could not update quantity" });
  }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId zaroori hai" });
    }

    // Ownership verification by matching both productId and req.user.id
    const deletedItem = await Cart.findOneAndDelete({ userId, productId });
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Item not found in your cart" });
    }

    res.status(200).json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.error("REMOVE FROM CART ERROR =>", error);
    res.status(500).json({ success: false, message: "Could not remove item" });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.deleteMany({ userId });
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("CLEAR CART ERROR =>", error);
    res.status(500).json({ success: false, message: "Could not clear cart" });
  }
};

module.exports = { addToCart, getCart, updateQuantity, removeFromCart, clearCart };