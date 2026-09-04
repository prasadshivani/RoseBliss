import React, { useEffect, useState } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AdminLogin = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        return;
      }

      try {
        setCheckingAdmin(true);
        setError("");

        const email =
          user.primaryEmailAddress?.emailAddress;

        const name =
          user.fullName ||
          user.firstName ||
          "Admin";

        if (!email) {
          setError("Google account email not found.");
          return;
        }

        console.log("CLERK USER =>", email);

        const res = await api.post(
          "/auth/clerk-admin-login",
          {
            email,
            name,
          }
        );

        console.log(
          "CLERK ADMIN LOGIN =>",
          res.data
        );

        const { token, user: backendUser } = res.data;

        if (backendUser.role !== "admin") {
          setError(
            "This Google account is not authorized as admin."
          );
          return;
        }

        localStorage.setItem("token", token);

        localStorage.setItem(
          "user",
          JSON.stringify(backendUser)
        );

        window.dispatchEvent(new Event("authChanged"));

        navigate("/admin", {
          replace: true,
        });
      } catch (error) {
        console.error(
          "CLERK ADMIN LOGIN ERROR =>",
          error
        );

        setError(
          error.response?.data?.message ||
            "You are not authorized as admin."
        );
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [isLoaded, isSignedIn, user, navigate]);

  if (checkingAdmin) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff5f7",
        }}
      >
        <h4>Checking admin access...</h4>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        background: "#fff5f7",
      }}
    >
      <div style={{ width: "400px" }}>

        {/* Your heading */}
        <h2
          className="text-center mb-2"
          style={{ color: "#d32f2f" }}
        >
          Admin Login
        </h2>

        <p className="text-center text-muted mb-4">
          Sign in with your Google account
        </p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Clerk Login */}
        <SignIn
          routing="path"
          path="/admin-login"
          fallbackRedirectUrl="/admin-login"
          appearance={{
            elements: {
              card: {
                boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                borderRadius: "15px",
                width: "100%",
              },
            },
          }}
        />

      </div>
    </div>
  );
};

export default AdminLogin;