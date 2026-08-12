const Wishlist = require("../models/Wishlist");

// Add Product To Wishlist
const addWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId zaroori hai",
      });
    }

    // Ownership check: matches both req.user.id and productId
    const exists = await Wishlist.findOne({ userId, productId });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({ userId, productId });

    const populated = await wishlist.populate("productId");

    res.status(201).json({
      success: true,
      wishlist: populated,
    });
  } catch (error) {
    console.error("ADD WISHLIST ERROR =>", error);
    res.status(500).json({
      success: false,
      message: "Could not add to wishlist",
    });
  }
};

// Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    let wishlist = await Wishlist.find({ userId }).populate("productId");

    // Orphan cleanup
    const orphanIds = wishlist
      .filter((item) => !item.productId)
      .map((item) => item._id);

    if (orphanIds.length > 0) {
      await Wishlist.deleteMany({ _id: { $in: orphanIds } });
    }

    // Sirf valid (existing product wale) items hi return karo
    wishlist = wishlist.filter((item) => item.productId);

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("GET WISHLIST ERROR =>", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch wishlist",
    });
  }
};

// Remove Wishlist
const removeWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId zaroori hai" });
    }

    // Ownership verification by matching both productId and req.user.id
    const deleted = await Wishlist.findOneAndDelete({ userId, productId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Item not found in your wishlist" });
    }

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("REMOVE WISHLIST ERROR =>", error);
    res.status(500).json({ success: false, message: "Could not remove from wishlist" });
  }
};

module.exports = {
  addWishlist,
  getWishlist,
  removeWishlist,
};