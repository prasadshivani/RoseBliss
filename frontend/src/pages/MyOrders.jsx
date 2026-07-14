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

  if (loading) {
    return <h3 className="text-center mt-5">Loading orders...</h3>;
  }

  if (orders.length === 0) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{ background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)" }}
      >
        <h3 className="text-muted">No orders yet 😢</h3>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{ background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)" }}
    >
      <div className="container">
        <h2 className="text-center mb-4 fw-bold">📦 My Orders</h2>

        {orders.map((order) => (
          <div key={order._id} className="card mb-3 p-3 shadow-sm rounded-4">
            <div className="d-flex justify-content-between align-items-center">
              <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
              <span className="badge bg-success">{order.orderStatus}</span>
            </div>
            <small className="text-muted">
              {new Date(order.createdAt).toLocaleString()}
            </small>

            <hr />

            {order.items.map((item, i) => (
              <div key={i} className="d-flex align-items-center mb-2">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }}
                />
                <div className="ms-3">
                  <div className="fw-bold">{item.name}</div>
                  <small className="text-muted">
                    Qty: {item.quantity} × ₹{item.price}
                  </small>
                </div>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between">
              <span className="text-muted">
                Shipping to: {order.shippingDetails?.city}, {order.shippingDetails?.pincode}
              </span>
              <h5 className="fw-bold text-success mb-0">Total: ₹{order.total}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;