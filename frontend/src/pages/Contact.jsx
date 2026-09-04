import React, { useState } from "react";
import api from "../api/axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/contact", formData);

      alert(response.data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        fontFamily: "Arial",
        background: "linear-gradient(135deg, #fff0f5 0%, #ffebee 100%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <h1
          style={{
            textAlign: "center",
            color: "#c2185b",
            fontSize: "2.5rem",
            marginBottom: "30px",
          }}
        >
          💌 Contact RoseBliss
        </h1>

        {/* Intro */}
        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#666",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          We'd love to hear from you! Send us a message and we'll respond as
          soon as possible.
        </p>

        {/* Contact Info */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            marginBottom: "40px",
          }}
        >
          <h3 style={{ color: "#c2185b", marginBottom: "20px" }}>
            📍 Get In Touch
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            <div>
              <h5>📱 Phone</h5>
              <p>+91 7499212105</p>
            </div>

            <div>
              <h5>✉️ Email</h5>
              <p>hello@rosebliss.com</p>
            </div>

            <div>
              <h5>📍 Address</h5>
              <p>
                Mumbai, Maharashtra
                <br />
                India 400001
              </p>
            </div>

            <div>
              <h5>🕒 Hours</h5>
              <p>
                Mon-Sat: 9AM-7PM
                <br />
                Sun: 10AM-5PM
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#c2185b", marginBottom: "25px" }}>
            ✍️ Send Message
          </h3>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "20px" }}
          >
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "2px solid #eee",
                  borderRadius: "10px",
                  fontSize: "16px",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "#c2185b")
                }
                onBlur={(e) => (e.target.style.borderColor = "#eee")}
              />
            </div>

            {/* Email + Phone */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "2px solid #eee",
                  borderRadius: "10px",
                  fontSize: "16px",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "#c2185b")
                }
                onBlur={(e) => (e.target.style.borderColor = "#eee")}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "2px solid #eee",
                  borderRadius: "10px",
                  fontSize: "16px",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "#c2185b")
                }
                onBlur={(e) => (e.target.style.borderColor = "#eee")}
              />
            </div>

            {/* Message */}
            <textarea
              name="message"
              rows="5"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "15px",
                border: "2px solid #eee",
                borderRadius: "10px",
                fontSize: "16px",
                fontFamily: "Arial",
                resize: "vertical",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "#c2185b")
              }
              onBlur={(e) => (e.target.style.borderColor = "#eee")}
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                background:
                  "linear-gradient(135deg, #c2185b, #e91e63)",
                color: "white",
                padding: "15px 30px",
                border: "none",
                borderRadius: "10px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 10px 20px rgba(194, 24, 91, 0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Send Message ✨
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;