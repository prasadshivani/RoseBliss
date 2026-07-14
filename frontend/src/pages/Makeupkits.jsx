import React, { useState, useEffect } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const MakeupKits = ({ addToCart, cart, wishlist, toggleWishlist }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products?category=Makeupkits");
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
    return <Spinner text="Loading makeup kits..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-5">
        <div className="inline-block mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            💄 MakeupKit Magic
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
          Complete Looks in Minutes | Travel-Friendly | Pro Quality 💄✨
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
            background: "linear-gradient(to right, #e11d48, #ec4899, #9333ea)",
          }}
        >
          💄 Find Your Perfect Kit →
        </button>
        <p className="mt-3 text-muted">
          Free shipping over ₹1,499 | Gift wrap available ✨
        </p>
      </div>
    </div>
  );
};

export default MakeupKits;