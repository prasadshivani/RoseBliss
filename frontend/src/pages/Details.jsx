import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const Details = ({ addToCart, cart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const submitReview = async () => {

  if (!comment.trim()) {
    return alert("Please write your review.");
  }

  try {

    await api.post(`/api/products/review/${id}`, {
      rating: Number(rating),
      comment: comment.trim(),
    });

    alert("Review Added Successfully");

    const res = await api.get(`/api/products/${id}`);
    setProduct(res.data.product);

    setRating(5);
    setComment("");

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Could not submit review"
    );
  }
};
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
          <h5 className="mb-3">
⭐ {product.averageRating?.toFixed(1) || 0}
 ({product.numReviews || 0} Reviews)
</h5>
          <p className="text-success fw-bold">✅ In Stock</p>
          <p className="text-secondary">🚚 Free Delivery Available</p>
          <p className="text-muted">{product.description}</p>

         <button
  className="btn btn-danger btn-lg mt-3"
  onClick={() => {
    console.log("PRODUCT =>", product);
    addToCart(product);
  }}
>
  {cart?.some((p) => p._id === product._id)
    ? "Added To Cart"
    : "Add To Cart"}
</button>

          <p className="small text-muted mt-3">
            🔒 Secure Checkout • Easy Returns
          </p>
          <hr />

<h4 className="mt-4">Write a Review</h4>

<select
  className="form-control mb-3"
  value={rating}
  onChange={(e) => setRating(e.target.value)}
>
  <option value="5">⭐⭐⭐⭐⭐</option>
  <option value="4">⭐⭐⭐⭐</option>
  <option value="3">⭐⭐⭐</option>
  <option value="2">⭐⭐</option>
  <option value="1">⭐</option>
</select>

<textarea
  className="form-control"
  rows="3"
  placeholder="Write your review..."
  value={comment}
  onChange={(e) => setComment(e.target.value)}
/>

<button
  className="btn btn-success mt-3"
  onClick={submitReview}
>
Submit Review
</button>

<hr />

<h4>Customer Reviews</h4>

{product.reviews?.length === 0 ? (
  <p>No Reviews Yet</p>
) : (
  product.reviews.map((review) => (
    <div
      key={review._id}
      className="border rounded p-3 mb-3"
    >
      <h6>{review.name}</h6>

      <p>
        {"⭐".repeat(review.rating)}
      </p>

      <p>{review.comment}</p>
    </div>
  ))
)}
        </div>
      </div>
    </div>
  );
};

export default Details;