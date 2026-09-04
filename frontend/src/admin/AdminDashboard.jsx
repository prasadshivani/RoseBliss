import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./AdminDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaBox, FaShoppingCart, FaUsers, FaRupeeSign } from "react-icons/fa";
import { saveAs } from "file-saver";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/api/admin/dashboard");
      setDashboard(res.data.dashboard);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/admin-login");
};
  const exportOrders = () => {
    const orders = dashboard.recentOrders;

    let csv = "Customer,Email,Amount,Payment,Status,Date\n";

    orders.forEach((order) => {
      const name = order.shippingDetails?.name || order.userId?.name;
      const email = order.shippingDetails?.email || order.userId?.email;

      csv += `${name},${email},${order.total},${order.paymentMethod},${order.orderStatus},${order.createdAt}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, "rosebliss-orders.csv");
  };

  if (!dashboard) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  const filteredOrders = dashboard.recentOrders.filter((order) => {
    const name = order.userId?.name || order.shippingDetails?.name || "";

    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Admin Dashboard</h2>

        <div>
          <span className="me-3">
            👤 {JSON.parse(localStorage.getItem("user"))?.name}
          </span>

          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card shadow p-4 text-center">
            <FaBox size={35} />
            <h5 className="mt-3">Total Products</h5>
            <h2>{dashboard.totalProducts}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-4 text-center">
            <FaShoppingCart size={35} />
            <h5 className="mt-3">Total Orders</h5>
            <h2>{dashboard.totalOrders}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-4 text-center">
            <FaUsers size={35} />
            <h5 className="mt-3">Total Users</h5>
            <h2>{dashboard.totalUsers}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-4 text-center">
            <FaRupeeSign size={35} />
            <h5 className="mt-3">Total Revenue</h5>
            <h2>₹{dashboard.totalRevenue}</h2>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Placed</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>
      {/* Recent Orders */}

      <div className="mt-5">
        <h3>🛒 Recent Orders</h3>
        <button className="btn btn-dark mb-4" onClick={exportOrders}>
          📥 Export Orders
        </button>

        <table className="table table-bordered shadow mt-3">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.userId?.name || order.shippingDetails?.name}</td>

                <td>₹{order.total}</td>

                <td>{order.orderStatus}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate("/admin/orders")}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Latest Users */}

      <div className="mt-5">
        <h3>👤 Latest Users</h3>

        <table className="table table-bordered shadow mt-3">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.latestUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>

                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Monthly Sales */}

      <div className="mt-5">
        <h3>📈 Monthly Sales</h3>

        <table className="table table-bordered shadow mt-3">
          <thead className="table-dark">
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Total Sales</th>
              <th>Total Orders</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.monthlySales.map((sale, index) => (
              <tr key={index}>
                <td>{sale._id.month}</td>

                <td>{sale._id.year}</td>

                <td>₹{sale.totalSales}</td>

                <td>{sale.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Sales Chart */}

      <div className="mt-5">
        <h3>📈 Monthly Sales</h3>

        <div className="card shadow p-4 mt-3">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="_id.month"
                label={{ value: "Month", position: "insideBottom", offset: -5 }}
              />

              <YAxis />

              <Tooltip />

              <Bar dataKey="totalSales" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Selling Products */}

      <div className="mt-5">
        <h3>🏆 Best Selling Products</h3>

        {/* Table */}

        <div className="card shadow p-3 mt-3">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Sold Quantity</th>
                <th>Revenue</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.bestSellingProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product._id}</td>

                  <td>{product.totalSold}</td>

                  <td>₹{product.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}

        <div className="card shadow p-4 mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.bestSellingProducts}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="_id" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="totalSold" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Analytics */}

      <div className="mt-5">
        <h3>📦 Order Status Analytics</h3>

        <div className="card shadow p-4 mt-3">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboard.orderStatusAnalytics}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {dashboard.orderStatusAnalytics.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Products */}

      {/* Low Stock Alert */}

      <div className="mt-5 mb-5">
        <h3>⚠️ Low Stock Alert</h3>

        {dashboard.lowStockProducts.length === 0 ? (
          <div className="alert alert-success shadow">
            ✅ Inventory Healthy
            <br />
            All products have enough stock.
          </div>
        ) : (
          <div className="row g-3 mt-3">
            {dashboard.lowStockProducts.map((product) => (
              <div className="col-md-4" key={product._id}>
                <div className="card shadow border-danger p-3">
                  <h5>📦 {product.name}</h5>

                  <p className="mb-0 text-danger">
                    Stock Remaining: {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Buttons */}

      <div className="mt-5 d-flex gap-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-product")}
        >
          ➕ Add Product
        </button>

        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/products")}
        >
          📦 Manage Products
        </button>

        <button
          className="btn btn-warning"
          onClick={() => navigate("/admin/orders")}
        >
          🛒 Manage Orders
        </button>
        <button
          className="btn btn-info"
          onClick={() => navigate("/admin/coupons")}
        >
          🎟️ Manage Coupons
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
