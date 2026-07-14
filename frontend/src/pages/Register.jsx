import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/register", form);

      toast.success(res.data.message || "Registered Successfully ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)"
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-5 p-4 p-md-5"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="card-body text-center mb-5">
          <h1
            className="display-4 fw-bolder mb-3"
            style={{
              background: "linear-gradient(45deg, #ec4899, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            RoseBliss
          </h1>
          <p className="lead text-muted fw-medium">
            Join the beauty world ✨
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control form-control-lg rounded-4 p-3"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control form-control-lg rounded-4 p-3"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control form-control-lg rounded-4 p-3"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="form-control form-control-lg rounded-4 p-3"
              placeholder="Confirm password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-4 py-3 fw-bold"
            style={{
              background: "linear-gradient(45deg, #ec4899, #f472b6)",
              color: "white"
            }}
          >
            Create Account ✨
          </button>

          <p className="text-center mt-4 mb-0">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#ec4899",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;