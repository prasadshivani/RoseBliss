import React from "react";
import { toast } from "react-toastify";

const Wishlist = ({ wishlist, toggleWishlist, addToCart }) => {
  if (!wishlist || wishlist.length === 0) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
        }}
      >
        <div className="text-center">
          <h1>❤️ My Wishlist</h1>
          <h3 className="text-muted mt-3">Wishlist Empty 😢</h3>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
      }}
    >
      <div className="container">
        <h1 className="text-center fw-bold mb-5">
          ❤️ My Wishlist ({wishlist.length})
        </h1>

        <div className="row g-4">
          {wishlist.map((item) => {
            const product = item.productId;

            if (!product || !product._id) return null;

            return (
              <div key={item._id} className="col-lg-3 col-md-4 col-sm-6">
                <div
                  className="card border-0 shadow-lg h-100"
                  style={{ borderRadius: "20px", overflow: "hidden" }}
                >
                  <div
                    className="d-flex justify-content-center align-items-center p-3"
                    style={{ height: "220px", background: "#fff" }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid"
                      style={{ maxHeight: "180px", objectFit: "contain" }}
                    />
                  </div>

                  <div className="card-body text-center">
                    <h5 className="fw-bold">{product.name}</h5>

                    <p className="fs-4 fw-bold text-danger">
                      ₹{product.price}
                    </p>

                    <div className="d-grid gap-2">
                     <button
  className="btn btn-success"
  onClick={() => {
    addToCart(product);
  }}
>
  🛒 Add To Cart
</button>

<button
  className="btn btn-outline-danger"
  onClick={() => {
    toggleWishlist(product);
  }}
>
  ❌ Remove
</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;