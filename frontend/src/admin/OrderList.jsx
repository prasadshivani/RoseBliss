import React, { useEffect, useState } from "react";
import api from "../api/axios";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/admin/all");

      setOrders(res.data.orders);
    } catch (error) {
      console.log("ORDER FETCH ERROR =>", error);
    }
  };

  const updateStatus = async (id, orderStatus) => {
    try {
      await api.put(`/api/orders/admin/update/${id}`, {
        orderStatus,
      });

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">

      {selectedOrder && (
  <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Order Details</h5>
          <button
            className="btn-close"
            onClick={() => setSelectedOrder(null)}
          ></button>
        </div>

        <div className="modal-body">
          <p><b>Customer:</b> {selectedOrder.shippingDetails?.name}</p>
          <p><b>Email:</b> {selectedOrder.shippingDetails?.email}</p>
          <p><b>Phone:</b> {selectedOrder.shippingDetails?.phone}</p>
          <p><b>Address:</b> {selectedOrder.shippingDetails?.address}, {selectedOrder.shippingDetails?.city}</p>

          <hr />

          <h5>Products</h5>

          {selectedOrder.items.map((item, i) => (
            <div key={i} className="mb-2">
              {item.name} × {item.quantity} — ₹{item.price}
            </div>
          ))}

          <hr />
<p><b>Payment Method:</b> {selectedOrder.paymentMethod}</p>
<p><b>Payment Status:</b> {selectedOrder.paymentStatus}</p>
          <h5>Total: ₹{selectedOrder.total}</h5>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedOrder(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      <h2>🛒 Order Management</h2>

      <table className="table table-bordered shadow mt-4">
        <thead className="table-dark">
          <tr>
            <th>Customer</th>
            
            <th>Total</th>
            <th>Payment</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.shippingDetails?.name}</td>

              <td>₹{order.total}</td>

              <td>{order.paymentStatus}</td>

              <td>{order.shippingDetails?.email}</td>

              <td>
                <select
                  className="form-select"
                  value={order.orderStatus}
                  onChange={async (e) => {
                    try {
                      await api.put(`/api/orders/admin/update/${order._id}`, {
                        orderStatus: e.target.value,
                      });

                      fetchOrders();
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <option value="Placed">Placed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
