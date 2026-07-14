const Product = require("../models/Product");

// Add Product
const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR =>", error);
    res.status(500).json({
      success: false,
      message: "Could not add product",
    });
  }
};

// Get All Products - category filter ke saath
const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR =>", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch products",
    });
  }
};

// Get Single Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR =>", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch product",
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error("SEARCH PRODUCTS ERROR =>", error);
    res.status(500).json({ message: "Search failed. Please try again." });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  searchProducts,
};