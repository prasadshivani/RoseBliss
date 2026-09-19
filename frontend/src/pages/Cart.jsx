import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const Cart = ({ cart, setCart, onOrderPlaced }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const increaseQty = async (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
    try {
      await api.put("/api/cart/update", {
        userId: user._id,
        productId: id,
        action: "increase",
      });
    } catch (error) {
      console.log("INCREASE QTY ERROR =>", error);
    }
  };

  const decreaseQty = async (id) => {
    setCart(
      cart.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
    try {
      await api.put("/api/cart/update", {
        userId: user._id,
        productId: id,
        action: "decrease",
      });
    } catch (error) {
      console.log("DECREASE QTY ERROR =>", error);
    }
  };

  const removeItem = async (id) => {
    setCart(cart.filter((item) => item._id !== id));
    try {
      await api.delete("/api/cart/remove", {
        data: { userId: user._id, productId: id },
      });
    } catch (error) {
      console.log("REMOVE ITEM ERROR =>", error);
    }
  };

  const totalPrice = (cart || []).reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  useEffect(() => {
    setFinalTotal(totalPrice - discount);
  }, [totalPrice, discount]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = () => {
    setFinalTotal(totalPrice);
    setShowCheckout(true);
  };
  const applyCoupon = async () => {
    if (!couponCode) {
      toast.error("Enter Coupon Code");
      return;
    }

    try {
      const res = await api.post("/api/coupons/apply", {
        code: couponCode,
        total: totalPrice,
      });

      setDiscount(res.data.discount);
      setFinalTotal(res.data.finalTotal);

      toast.success("Coupon Applied Successfully 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Coupon");
    }
  };

  // ✅ Real Razorpay flow
  const handlePayment = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      toast.error("Please fill in all shipping details first!");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Razorpay is still loading. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // STEP 1: Create Razorpay order
      const orderResponse = await api.post("/api/payment/create-order", {
        amount: finalTotal || totalPrice,
      });

      console.log("RAZORPAY ORDER =>", orderResponse.data);

      const { orderId, amount, currency, keyId } = orderResponse.data;

      // STEP 2: Open Razorpay popup
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,

        name: "RoseBliss",
        description: "RoseBliss Order",

        order_id: orderId,

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        notes: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },

        theme: {
          color: "#ec4899",
        },

        // STEP 3: Payment successful
        handler: async function (response) {
          console.log("RAZORPAY PAYMENT RESPONSE =>", response);

          try {
            // STEP 4: Verify payment
            const verifyResponse = await api.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,

              userId: user._id,

              items: cart.map((item) => ({
                productId: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
              })),

              total: finalTotal || totalPrice,

              shippingDetails: formData,
            });

            console.log("VERIFY RESPONSE =>", verifyResponse.data);

            if (verifyResponse.data.success) {
              setCart([]);
              setOrderSuccess(true);

              toast.success("Payment Successful & Order Placed 🎉");
            }
          } catch (error) {
            console.error("PAYMENT VERIFY ERROR =>", error);

            console.error("SERVER RESPONSE =>", error.response?.data);

            toast.error(
              error.response?.data?.message || "Payment verification failed",
            );
          } finally {
            setIsProcessing(false);
          }
        },

        // User closes Razorpay popup
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      // STEP 5: Create Razorpay instance
      const razorpay = new window.Razorpay(options);

      // Payment failed
      razorpay.on("payment.failed", function (response) {
        console.error("PAYMENT FAILED =>", response.error);

        setIsProcessing(false);

        toast.error(response.error?.description || "Payment failed");
      });

      // STEP 6: Open popup
      razorpay.open();
    } catch (error) {
      console.error("RAZORPAY ORDER ERROR =>", error);

      console.error("SERVER RESPONSE =>", error.response?.data);

      toast.error(error.response?.data?.message || "Unable to start payment");

      setIsProcessing(false);
    }
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  if (orderSuccess) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
        }}
      >
        <h1 className="fw-bold text-success display-4">✅ Order Placed!</h1>
        <p className="text-muted fs-5">Thank you for your order! 💖</p>
        <button
          className="btn mt-3 px-4 py-2 fw-bold rounded-4"
          style={{
            background: "linear-gradient(45deg, #ec4899, #f472b6)",
            color: "white",
          }}
          onClick={() => (window.location.href = "/")}
        >
          Continue Shopping 🛍️
        </button>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div
        className="min-vh-100 p-4"
        style={{
          background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
        }}
      >
        <div className="container">
          <button
            className="btn btn-outline-secondary mb-4"
            onClick={handleBackToCart}
          >
            ← Back to Cart
          </button>

          <h2 className="text-center mb-4 fw-bold">💳 Checkout</h2>

          <div className="row">
            <div className="col-lg-5">
              <div className="card shadow-sm rounded-4 p-3">
                <h4 className="mb-3">Order Summary ({cart.length} items)</h4>

                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex align-items-center mb-3 pb-2 border-bottom"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">
                        Qty: {item.quantity} × ₹{item.price}
                      </small>
                    </div>

                    <span className="fw-bold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}

                <hr />

                <h5 className="mb-3">🎁 Apply Coupon</h5>

                <div className="d-flex mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />

                  <button
                    type="button"
                    className="btn btn-success ms-2"
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>
                </div>

                <div className="mt-3 pt-2 border-top">
                  <div className="d-flex justify-content-between">
                    <h6>Subtotal</h6>
                    <h6>₹{totalPrice}</h6>
                  </div>

                  <div className="d-flex justify-content-between">
                    <h6>Shipping</h6>
                    <h6 className="text-success">Free</h6>
                  </div>

                  <div className="d-flex justify-content-between">
                    <h6>Tax</h6>
                    <h6>₹0</h6>
                  </div>

                  <div className="d-flex justify-content-between">
                    <h6>Discount</h6>
                    <h6 className="text-danger">-₹{discount.toFixed(2)}</h6>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <h4 className="mb-0">Final Total</h4>
                    <h4 className="fw-bold text-success">
                      ₹{(finalTotal || totalPrice).toFixed(2)}
                    </h4>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-light rounded-3">
                  <h6 className="mb-2">💳 Payment Methods</h6>

                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-secondary">UPI</span>
                    <span className="badge bg-secondary">Card</span>
                    <span className="badge bg-secondary">Net Banking</span>
                    <span className="badge bg-secondary">Wallet</span>
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div className="col-lg-7">
              <form className="card shadow-sm rounded-4 p-4">
                <h4 className="mb-3">Shipping Details</h4>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control rounded-3"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded-3"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control rounded-3"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    className="form-control rounded-3"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Flat no., Building, Street..."
                  />
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control rounded-3"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      className="form-control rounded-3"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                    />
                  </div>
                </div>
                <div className="alert alert-info rounded-3">
                  <strong>ℹ️ Note:</strong> Fill all details above, then click
                  Pay.
                </div>
                <button
                  type="button"
                  disabled={isProcessing}
                  className="btn w-100 py-3 fw-bold rounded-4 fs-5"
                  style={{
                    background: isProcessing
                      ? "#ccc"
                      : "linear-gradient(45deg, #ec4899, #f472b6)",
                    color: "white",
                  }}
                  onClick={handlePayment}
                >
                  {isProcessing
                    ? "⏳ Placing Order..."
                    : `Place Order • ₹${finalTotal || totalPrice} 💖`}
                </button>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    🔒 Secured by Razorpay | UPI, Cards, Net Banking & Wallets
                    accepted
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 p-4"
      style={{
        background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
      }}
    >
      <h2 className="text-center mb-4 fw-bold">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center">
          <h4 className="mb-3">Cart is empty 😢</h4>
          <button
            className="btn px-4 py-2 fw-bold rounded-4"
            style={{
              background: "linear-gradient(45deg, #ec4899, #f472b6)",
              color: "white",
            }}
            onClick={() => (window.location.href = "/")}
          >
            Start Shopping 🛍️
          </button>
        </div>
      ) : (
        <div className="container">
          {cart.map((item) => (
            <div
              key={item._id}
              className="card mb-3 p-3 shadow-sm rounded-4 d-flex flex-row align-items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100px", borderRadius: "10px" }}
              />

              <div className="ms-3 flex-grow-1">
                <h5>{item.name}</h5>
                <p className="mb-1">₹{item.price}</p>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => decreaseQty(item._id)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => increaseQty(item._id)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-end">
                <p className="fw-bold">₹{item.price * item.quantity}</p>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-end mt-4">
            <h4 className="mb-2">Total: ₹{totalPrice}</h4>
            <button
              className="btn mt-2 px-5 py-3 fw-bold rounded-4 fs-5"
              style={{
                background: "linear-gradient(45deg, #ec4899, #f472b6)",
                color: "white",
              }}
              onClick={handleCheckout}
            >
              Proceed to Checkout 💖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
