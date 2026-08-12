const Product = require("../models/product");

// =========================
// Add Product
// =========================
const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      type,
      category,
      stock,
    } = req.body;

    // Auto Product ID
    const lastProduct = await Product.findOne().sort({ productId: -1 });

    const productId = lastProduct ? lastProduct.productId + 1 : 1;

    const product = await Product.create({
      productId,
      name,
      price,
      description,
      image: req.file ? req.file.path : "",
      type,
      category,
      stock,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.log("ADD PRODUCT ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Products
// =========================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log("GET PRODUCTS ERROR =>", error);

    res.status(500).json({
      success: false,
      message: "Could not fetch products",
    });
  }
};

// =========================
// Get Single Product
// =========================
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
    console.log("GET PRODUCT ERROR =>", error);

    res.status(500).json({
      success: false,
      message: "Could not fetch product",
    });
  }
};

// =========================
// Update Product
// =========================
const updateProduct = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    if (req.file) {
      data.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Product
// =========================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR =>", error);

    res.status(500).json({
      success: false,
      message: "Could not delete product",
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
