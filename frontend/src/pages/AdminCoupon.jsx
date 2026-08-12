import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expiryDate: "",
  });

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/api/coupons/all");
      setCoupons(res.data.coupons);
    } catch (err) {
      toast.error("Failed to load coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createCoupon = async () => {
    try {
      await api.post("/api/coupons/create", formData);

      toast.success("Coupon Created");

      setFormData({
        code: "",
        discount: "",
        expiryDate: "",
      });

      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await api.delete(`/api/coupons/${id}`);

      toast.success("Coupon Deleted");

      fetchCoupons();
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">🎟 Admin Coupon Management</h2>

      <div className="card p-4 shadow mb-4">

        <input
          className="form-control mb-3"
          placeholder="Coupon Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Discount %"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />

        <button
          className="btn btn-success"
          onClick={createCoupon}
        >
          Create Coupon
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Expiry</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>{coupon.discount}%</td>
              <td>
                {new Date(coupon.expiryDate).toLocaleDateString()}
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCoupon(coupon._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCoupons;