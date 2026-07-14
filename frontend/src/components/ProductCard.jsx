import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item, addToCart, cart, wishlist, toggleWishlist }) => {
  const navigate = useNavigate();

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
      <div
        className="card border-0 shadow-lg h-100 position-relative product-card"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        <span
          className="badge bg-danger position-absolute"
          style={{ top: "10px", left: "10px", zIndex: "10" }}
        >
          20% OFF
        </span>

        <button
          className="btn btn-light position-absolute"
          style={{ top: "10px", right: "10px", borderRadius: "50%", zIndex: "10" }}
          onClick={() => toggleWishlist(item)}
        >
         {wishlist?.some((p) => p.productId?._id?.toString() === item._id?.toString()) ? "❤️" : "🤍"}
        </button>

        <div
          className="d-flex justify-content-center align-items-center p-3"
          style={{ height: "220px", backgroundColor: "#fff" }}
        >
          <img
            src={item.image || null}
            alt={item.name}
            className="img-fluid product-image"
            style={{
              maxHeight: "180px",
              objectFit: "contain",
              transition: "transform 0.3s ease",
            }}
            onError={(e) => {
              e.target.src = "https://placehold.co/180x180?text=No+Image";
            }}
          />
        </div>

        <div className="card-body d-flex flex-column">
          <h5
            className="fw-bold text-center"
            style={{ minHeight: "50px", fontSize: "17px" }}
          >
            {item.name}
          </h5>

          <div className="text-center text-warning mb-2">⭐⭐⭐⭐⭐</div>

          <p className="text-center">
            <span className="text-muted text-decoration-line-through">
              ₹{Math.round(item.price * 1.2)}
            </span>
            <span className="fw-bold fs-4 text-danger ms-2">₹{item.price}</span>
          </p>

          <div className="mt-auto d-flex justify-content-center gap-2">
            <div className="mt-auto">
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <button
                  className={`btn ${
                    cart?.some((p) => p._id === item._id)
                      ? "btn-success"
                      : "btn-danger"
                  }`}
                  onClick={() => addToCart(item)}
                >
                  {cart?.some((p) => p._id === item._id) ? "✓ Added" : "Add to Cart"}
                </button>

                <button
                  className="btn btn-warning text-dark fw-bold"
                  onClick={() => {
                    const exists = cart?.find((p) => p._id === item._id);
                    if (!exists) {
                      addToCart({ ...item, quantity: 1 });
                    }
                    navigate("/cart");
                  }}
                >
                  Buy Now
                </button>
              </div>

              <div className="text-center mt-2">
                <button
                  className="btn btn-primary px-4"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 35px rgba(0,0,0,0.15) !important;
          }
          .product-card:hover .product-image {
            transform: scale(1.08);
          }
        `}
      </style>
    </div>
  );
};

export default ProductCard;