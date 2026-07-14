import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Details = ({ addToCart, cart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  if (!product) {
    return <h2 className="text-center mt-5">Product Not Found</h2>;
  }

  return (
    <div className="container py-5">
      <div className="row align-items-center shadow-lg rounded p-4 bg-white">

        <div className="col-md-6 text-center">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid"
            style={{ maxHeight: "450px", objectFit: "contain" }}
          />
        </div>

        <div className="col-md-6">
          <h1 className="fw-bold">{product.name}</h1>
          <h3 className="text-danger my-3">₹{product.price}</h3>
          <h5 className="mb-3">⭐⭐⭐⭐⭐ (4.8)</h5>
          <p className="text-success fw-bold">✅ In Stock</p>
          <p className="text-secondary">🚚 Free Delivery Available</p>
          <p className="text-muted">{product.description}</p>

          <button
            className="btn btn-danger btn-lg mt-3"
            onClick={() => addToCart(product)}
          >
            {cart?.some((p) => p._id === product._id)
              ? "Added To Cart"
              : "Add To Cart"}
          </button>

          <p className="small text-muted mt-3">
            🔒 Secure Checkout • Easy Returns
          </p>
        </div>
      </div>
    </div>
  );
};

export default Details;