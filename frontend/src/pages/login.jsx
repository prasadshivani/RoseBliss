import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      console.log(res.data);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message || "Login Successful ✅");

      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-5 p-4 p-md-5"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="card-body text-center mb-4">
          <h1
            className="display-4 fw-bolder mb-2"
            style={{
              background: "linear-gradient(45deg, #ec4899, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            RoseBliss
          </h1>
          <p className="lead text-muted fw-medium">Welcome back 💖</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control form-control-lg rounded-4"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control form-control-lg rounded-4"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-100 rounded-4 py-3 fw-bold"
            style={{
              background: "linear-gradient(45deg, #ec4899, #f472b6)",
              color: "white",
            }}
          >
            {loading ? "Logging in..." : "Login 💖"}
          </button>
        </form>

        <p className="text-center mt-4 mb-0">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#ec4899",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;