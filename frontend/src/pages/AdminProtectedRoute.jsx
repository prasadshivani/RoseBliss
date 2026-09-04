import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  console.log("ADMIN PROTECTED ROUTE =>", {
    token,
    user,
  });

  // Login hi nahi hai
  if (!token || !user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Admin nahi hai
  if (user.role !== "admin") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/admin-login" replace />;
  }

  // Admin hai
  return children;
};

export default AdminProtectedRoute;