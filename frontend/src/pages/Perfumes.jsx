import React, { useState, useEffect } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const Perfumes = ({ addToCart, cart, wishlist, toggleWishlist }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products?category=Perfumes");
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
    return <Spinner text="Loading perfumes..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-5">
        <div className="inline-block mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 bg-clip-text text-transparent leading-tight">
            🌹 Perfume Paradise
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
          Long-Lasting 8+ Hours | Eau De Parfum | Luxury Fragrances ✨
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
            background: "linear-gradient(to right, #4f46e5, #9333ea, #d97706)",
          }}
        >
          🌹 Discover Your Signature Scent →
        </button>
        <p className="mt-3 text-muted">
          Free shipping over ₹1,499 | Free samples with every order ✨
        </p>
      </div>
    </div>
  );
};

export default Perfumes;