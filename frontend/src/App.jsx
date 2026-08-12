import api from "./api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Collection from "./pages/Collection";
import { Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Lipsticks from "./pages/Lipsticks";
import Skincare from "./pages/Skincare";
import Makeupkits from "./pages/Makeupkits";
import Perfumes from "./pages/Perfumes";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Details from "./pages/Details";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import ProductList from "./admin/ProductList";
import EditProduct from "./admin/EditProduct";
import OrderList from "./admin/OrderList";
import AdminCoupons from "./pages/AdminCoupon";

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const res = await api.get("/api/cart");
        const formattedCart = res.data.cart.map((item) => ({
          ...item.productId,
          quantity: item.quantity,
        }));
        setCart(formattedCart);
      } catch (error) {
        console.log("CART FETCH ERROR =>", error);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const res = await api.get("/api/wishlist");
        setWishlist(res.data.wishlist);
      } catch (error) {
        console.log("WISHLIST FETCH ERROR =>", error);
      }
    };
    fetchWishlist();
  }, []);

  const addToCart = async (product) => {
    console.log("ADD TO CART CALLED =>", product);

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await api.post("/api/cart/add", {
        productId: product._id,
      });

      console.log("ADD TO CART RESPONSE =>", res.data);

      const existingProduct = cart.find(
        (item) => item._id?.toString() === product._id?.toString(),
      );

      if (existingProduct) {
        setCart((prev) =>
          prev.map((item) =>
            item._id?.toString() === product._id?.toString()
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        setCart((prev) => [...prev, { ...product, quantity: 1 }]);
      }

      toast.success("Added to Cart 🛒");
    } catch (error) {
      console.log("FULL ERROR =>", error);

      toast.error(error.response?.data?.message || "Could not add to cart");
    }
  };

  const toggleWishlist = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login first");
      return;
    }

    const alreadyInWishlist = wishlist.find(
      (item) => item.productId?._id?.toString() === product._id?.toString(),
    );

    if (alreadyInWishlist) {
      try {
        await api.delete("/api/wishlist/remove", {
          data: {
            productId: product._id,
          },
        });
        setWishlist(
          wishlist.filter(
            (item) =>
              item.productId?._id?.toString() !== product._id?.toString(),
          ),
        );
        toast.info("Removed from wishlist 💔");
      } catch (error) {
        console.log("REMOVE ERROR =>", error.response?.data);
      }
    } else {
      try {
        const res = await api.post("/api/wishlist/add", {
          productId: product._id,
        });
        setWishlist([...wishlist, res.data.wishlist]);
        toast.success("Added to wishlist ❤️");
      } catch (error) {
        console.log("ADD ERROR =>", error.response?.data);
      }
    }
  };

  return (
    <>
      <Navbar cart={cart} wishlist={wishlist} />
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lipsticks"
          element={
            <ProtectedRoute>
              <Lipsticks
                addToCart={addToCart}
                cart={cart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
              <Collection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skincare"
          element={
            <ProtectedRoute>
              <Skincare
                addToCart={addToCart}
                cart={cart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/makeupkits"
          element={
            <ProtectedRoute>
              <Makeupkits
                addToCart={addToCart}
                cart={cart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfumes"
          element={
            <ProtectedRoute>
              <Perfumes
                addToCart={addToCart}
                cart={cart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <Details addToCart={addToCart} cart={cart} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist
                wishlist={wishlist}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminProtectedRoute>
              <AddProduct />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <ProductList />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminProtectedRoute>
              <EditProduct />
            </AdminProtectedRoute>
          }
        />
        <Route
  path="/admin/orders"
  element={
    <AdminProtectedRoute>
      <OrderList/>
    </AdminProtectedRoute>
  }
/>
        <Route path="/admin/coupons" element={<AdminCoupons/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
