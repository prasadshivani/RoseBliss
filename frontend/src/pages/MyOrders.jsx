import React, { useEffect, useState } from "react";
import api from "../api/axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/orders/${user._id}`);
        setOrders(res.data.orders);
      } catch (error) {
        console.log("FETCH ORDERS ERROR =>", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ===============================
  // Cancel Order
  // ===============================
  const cancelOrder = async (orderId) => {
    console.log("CANCEL BUTTON CLICKED =>", orderId);

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      console.log("SENDING CANCEL REQUEST =>", orderId);

      const res = await api.put(
        `/api/orders/cancel/${orderId}`
      );

      console.log("CANCEL RESPONSE =>", res.data);

      alert("Order cancelled successfully!");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: "Cancelled",
              }
            : order
        )
      );
    } catch (error) {
      console.error("CANCEL ORDER ERROR =>", error);

      console.error(
        "SERVER RESPONSE =>",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    }
  };

  if (loading) {
    return (
      <h3 className="text-center mt-5">
        Loading orders...
      </h3>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{
          background:
            "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
        }}
      >
        <h3 className="text-muted">
          No orders yet 😢
        </h3>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background:
          "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
      }}
    >
      <div className="container">

        <h2 className="text-center mb-4 fw-bold">
          📦 My Orders
        </h2>

        {orders.map((order) => (
          <div
            key={order._id}
            className="card mb-3 p-3 shadow-sm rounded-4"
          >

            {/* Order Header */}
            <div className="d-flex justify-content-between align-items-center">

              <strong>
                Order #
                {order._id
                  .slice(-6)
                  .toUpperCase()}
              </strong>

              <div className="d-flex align-items-center gap-2">

                {/* Status */}
                <span
                  className={`badge ${
                    order.orderStatus === "Delivered"
                      ? "bg-success"
                      : order.orderStatus === "Shipped"
                      ? "bg-primary"
                      : order.orderStatus === "Cancelled"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {order.orderStatus}
                </span>

                {/* Cancel Button */}
                {order.orderStatus === "Placed" && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      cancelOrder(order._id)
                    }
                  >
                    Cancel Order
                  </button>
                )}

              </div>
            </div>

            <small className="text-muted">
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </small>

            <hr />

            {/* Products */}
            {order.items.map((item, i) => (
              <div
                key={i}
                className="d-flex align-items-center mb-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />

                <div className="ms-3">
                  <div className="fw-bold">
                    {item.name}
                  </div>

                  <small className="text-muted">
                    Qty: {item.quantity} × ₹
                    {item.price}
                  </small>
                </div>
              </div>
            ))}

            <hr />

            {/* Bottom */}
            <div className="d-flex justify-content-between">

              <span className="text-muted">
                Shipping to:{" "}
                {order.shippingDetails?.city},{" "}
                {order.shippingDetails?.pincode}
              </span>

              <h5 className="fw-bold text-success mb-0">
                Total: ₹{order.total}
              </h5>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default MyOrders;