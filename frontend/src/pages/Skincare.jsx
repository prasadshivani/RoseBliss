import React, { useState, useEffect } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const Skincare = ({ addToCart, cart, wishlist, toggleWishlist }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products?category=Skincare");
        setProducts(res.data.products);
      } catch (error) {
        console.log("FETCH ERROR =>", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <Spinner text="Loading skincare products..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-5">
        <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            🧴 SkinBliss Essentials
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light mt-4">
          Dermatologist Approved | Clean Ingredients | Visible Results in 14 Days ✨
        </p>
      </div>

      <div className="container-fluid">
        <div className="row g-4">
          {products.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              addToCart={addToCart}
              cart={cart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-5">
        <button
          className="btn btn-lg text-white fw-bold px-5 py-3"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(to right, #059669, #2563eb, #4f46e5)",
          }}
        >
          🧴 Build My Routine →
        </button>
        <p className="mt-3 text-muted">
          Free shipping over ₹999 | Free sample with every order ✨
        </p>
      </div>
    </div>
  );
};

export default Skincare;