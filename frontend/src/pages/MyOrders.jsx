
import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ORDER_STEPS = [
  "Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          setOrders([]);
          return;
        }

        // Token should be added by the axios interceptor.
        const res = await api.get("/api/orders/my-orders");

        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("FETCH ORDERS ERROR =>", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(orderId);

      const res = await api.put(`/api/orders/cancel/${orderId}`, {
        cancellationReason: "Cancelled by customer",
      });

      const updatedOrder = res.data.order;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? updatedOrder || {
                ...order,
                orderStatus: "Cancelled",
              }
            : order
        )
      );

      window.alert("Order cancelled successfully!");
    } catch (error) {
      console.error(
        "CANCEL ORDER ERROR =>",
        error.response?.data || error.message
      );

      window.alert(
        error.response?.data?.message ||
          "Unable to cancel order. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-success";
      case "Shipped":
      case "Out for Delivery":
        return "bg-primary";
      case "Cancelled":
        return "bg-danger";
      case "Processing":
        return "bg-info text-dark";
      default:
        return "bg-warning text-dark";
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status" />
        <p className="mt-3">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #fce7f3, #f3e8ff)",
        }}
      >
        <div className="text-center p-4">
          <h2>📦 My Orders</h2>
          <p className="text-muted mt-3">
            No orders found. Your RoseBliss orders will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: "linear-gradient(135deg, #fce7f3, #f3e8ff)",
      }}
    >
      <div className="container">
        <h2 className="text-center fw-bold mb-2">
          📦 My Orders
        </h2>

        <p className="text-center text-muted mb-4">
          Track your RoseBliss purchases and delivery updates.
        </p>

        {orders.map((order) => {
          const cancelled = order.orderStatus === "Cancelled";
          const currentStep = ORDER_STEPS.indexOf(order.orderStatus);
          const history = order.trackingHistory || [];

          return (
            <div
              key={order._id}
              className="card border-0 shadow-sm rounded-4 mb-4"
            >
              <div className="card-body p-3 p-md-4">
                {/* Order header */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <h5 className="fw-bold mb-1">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h5>

                    <small className="text-muted">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </small>
                  </div>

                  <span
                    className={`badge ${getStatusClass(
                      order.orderStatus
                    )} p-2`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <hr />

                {/* Order progress */}
                {!cancelled && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      Delivery Progress
                    </h6>

                    <div className="d-flex justify-content-between gap-1">
                      {ORDER_STEPS.map((step, index) => {
                        const completed =
                          currentStep >= 0 && index <= currentStep;

                        return (
                          <div
                            key={step}
                            className="text-center flex-fill"
                            style={{ minWidth: 0 }}
                          >
                            <div
                              className={`rounded-circle mx-auto mb-2 ${
                                completed ? "bg-success" : "bg-secondary"
                              }`}
                              style={{
                                width: 20,
                                height: 20,
                                opacity: completed ? 1 : 0.25,
                              }}
                            />

                            <small
                              className="text-muted d-block"
                              style={{
                                fontSize: "clamp(9px, 2vw, 12px)",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {step}
                            </small>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {cancelled && (
                  <div className="alert alert-danger py-2">
                    This order has been cancelled.
                    {order.cancellationReason && (
                      <div className="small mt-1">
                        Reason: {order.cancellationReason}
                      </div>
                    )}
                  </div>
                )}

                {/* Products */}
                <h6 className="fw-bold">Items</h6>

                {order.items?.map((item, index) => (
                  <div
                    key={item.productId || index}
                    className="d-flex align-items-center gap-3 mb-3"
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name || "Product"}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/placeholder.png";
                      }}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 10,
                        background: "#f8f8f8",
                      }}
                    />

                    <div className="flex-grow-1">
                      <div className="fw-semibold">
                        {item.name}
                      </div>

                      <small className="text-muted">
                        Qty: {item.quantity} × ₹{item.price}
                      </small>
                    </div>

                    <strong>
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}

                <hr />

                {/* Tracking details */}
                {!cancelled && (
                  <div className="rounded-3 p-3 mb-3 bg-light">
                    <h6 className="fw-bold mb-3">
                      🚚 Shipment Details
                    </h6>

                    {order.courierName && (
                      <p className="mb-2">
                        <strong>Courier:</strong>{" "}
                        {order.courierName}
                      </p>
                    )}

                    {order.trackingNumber && (
                      <p className="mb-2">
                        <strong>Tracking Number:</strong>{" "}
                        {order.trackingNumber}
                      </p>
                    )}

                    {order.trackingUrl &&
                      /^https?:\/\//i.test(order.trackingUrl) && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary mt-1"
                        >
                          Track Shipment
                        </a>
                      )}

                    {!order.courierName &&
                      !order.trackingNumber &&
                      !order.trackingUrl && (
                        <p className="text-muted mb-0 small">
                          Courier and tracking details will appear
                          here when the admin adds them.
                        </p>
                      )}
                  </div>
                )}

                {/* Tracking history */}
                {history.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold mb-3">
                      Order Activity
                    </h6>

                    {[...history].reverse().map((event, index) => (
                      <div
                        key={`${event.status}-${event.updatedAt}-${index}`}
                        className="d-flex gap-3 mb-3"
                      >
                        <div className="text-success">●</div>

                        <div>
                          <div className="fw-semibold">
                            {event.status}
                          </div>

                          {event.note && (
                            <div className="text-muted small">
                              {event.note}
                            </div>
                          )}

                          {event.updatedAt && (
                            <div className="text-muted small">
                              {new Date(
                                event.updatedAt
                              ).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <hr />

                {/* Payment and shipping */}
                <div className="row g-3">
                  <div className="col-12 col-md-7">
                    <h6 className="fw-bold">Shipping Address</h6>

                    <p className="text-muted mb-0">
                      {order.shippingDetails?.name}
                      <br />
                      {order.shippingDetails?.address}
                      <br />
                      {order.shippingDetails?.city} -{" "}
                      {order.shippingDetails?.pincode}
                      {order.shippingDetails?.phone && (
                        <>
                          <br />
                          Phone: {order.shippingDetails.phone}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="col-12 col-md-5 text-md-end">
                    <p className="mb-1">
                      <strong>Payment:</strong>{" "}
                      {order.paymentMethod || "COD"}
                    </p>

                    <p className="mb-2">
                      <strong>Payment Status:</strong>{" "}
                      {order.paymentStatus || "Pending"}
                    </p>

                    <h5 className="fw-bold text-success">
                      Total: ₹
                      {Number(order.total || 0).toLocaleString("en-IN")}
                    </h5>
                  </div>
                </div>

                {/* Cancellation */}
                {["Placed", "Processing"].includes(
                  order.orderStatus
                ) && (
                  <div className="text-end mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      disabled={cancellingId === order._id}
                      onClick={() => cancelOrder(order._id)}
                    >
                      {cancellingId === order._id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
