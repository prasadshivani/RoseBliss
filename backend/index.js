require("dotenv").config();   // ✅ Ye sabse upar, sabse pehle

const express = require("express");
const authRouter = require("./routes/authRouter");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const connectDB = require("./config/connectDB");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/auth", authRouter);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/home", (req, res) => {
  res.send("welcome");
});

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});