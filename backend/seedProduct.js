require("dotenv").config();

const Product = require("./models/Product");
const connectDB = require("./config/connectDB");
const productsData = require("../frontend/src/data/products.json");

const seedData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    const products = [
      ...productsData.lipsticks.map((p) => ({
        productId: p.id,
        name: p.name,
        price: p.price,
        description: p.description || "No description available",
        image: p.image || "https://via.placeholder.com/300",
        type: p.type || "",
        category: "Lipsticks",
        stock: 20,
      })),

      ...productsData.skincare.map((p) => ({
        productId: p.id,
        name: p.name,
        price: p.price,
        description: p.description || "No description available",
        image: p.image || "https://via.placeholder.com/300",
        type: p.type || "",
        category: "Skincare",
        stock: 20,
      })),

      ...productsData.makeupkits.map((p) => ({
        productId: p.id,
        name: p.name,
        price: p.price,
        description: p.description || "No description available",
        image: p.image || "https://via.placeholder.com/300",
        type: p.type || "",
        category: "Makeupkits",
        stock: 20,
      })),

      ...productsData.perfumes.map((p) => ({
        productId: p.id,
        name: p.name,
        price: p.price,
        description: p.description || "No description available",
        image: p.image || "https://via.placeholder.com/300",
        type: p.type || "",
        category: "Perfumes",
        stock: 20,
      })),
    ];

    await Product.insertMany(products);

    console.log(`${products.length} Products Added Successfully ✅`);

    process.exit();
  } catch (error) {
    console.log("SEED ERROR =>", error);
    process.exit(1);
  }
};

seedData();