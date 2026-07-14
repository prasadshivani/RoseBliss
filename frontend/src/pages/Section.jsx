import React from "react";
import { NavLink } from "react-router-dom";
import data from "../data/products.json";

function Section() {
  // Popular collections data for cleaner structure
  const collections = [
    {
      title: "Lipsticks",
      icon: "💄",
      description: "Long-lasting matte & glossy shades",
      link: "/lipsticks",
    },
    {
      title: "Perfumes",
      icon: "🌸",
      description: "A long-lasting fragrance that keeps you fresh all day",
      link: "/perfumes",
    },
    {
      title: "Skincare",
      icon: "🧴",
      description: "Complete glow-up routines",
      link: "/skincare",
    },
  ];

  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #fff 0%, #ffebee 50%, #fce4ec 100%)",
      }}
    >
      {/* Hero Section */}
      <section className="py-5 position-relative">
        <div className="container">
          <div className="row align-items-center min-vh-90">
            {/* Left Content */}
            <div className="col-lg-6 ps-lg-2">
              <div className="hero-content">
                <h1
                  className="display-4 fw-bold mb-4"
                  style={{
                    fontFamily: "serif",
                    color: "#d32f2f",
                  }}
                >
                  💄 Welcome to Rose Bliss
                </h1>
                <p className="lead mb-4 fs-4 text-muted">
                  Premium beauty products delivered with love. Perfect for your
                  glow-up.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <NavLink
                    to="/collections"
                    className="btn btn-danger btn-lg px-5 py-3 fw-bold rounded-pill shadow-sm nav-hover"
                  >
                    Shop Collections
                  </NavLink>
                  <NavLink
                    to="/about"
                    className="btn btn-outline-danger btn-lg px-5 py-3 fw-bold rounded-pill nav-hover"
                  >
                    Our Story
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="col-lg-6 text-center">
              <div
                className="hero-flower"
                style={{
                  fontSize: "8rem",
                  animation: "gentleFloat 6s ease-in-out infinite",
                }}
              >
                ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Collections */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2
            className="text-center fw-bold"
            style={{
              color: "#d32f2f",
              fontFamily: "serif",
              fontSize: "2.5rem",
            }}
          >
            Popular Collections
          </h2>
          <p className="text-center text-muted mb-5">
            Discover our most loved beauty essentials.
          </p>

          <div className="row g-4">
            {collections.map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className="card h-100 shadow-sm border-0 nav-card-hover position-relative overflow-hidden">
                  <div className="card-body text-center p-5">
                    <div
                      className="flower-icon mb-4"
                      style={{ fontSize: "4rem" }}
                    >
                      {item.icon}
                    </div>
                    <h5
                      className="card-title fw-bold mb-3"
                      style={{ color: "#d32f2f" }}
                    >
                      {item.title}
                    </h5>
                    <p className="text-muted">{item.description}</p>
                    <NavLink
                      to={item.link}
                      className="btn btn-outline-danger nav-hover mt-3"
                    >
                      Shop Now
                    </NavLink>
                    <div className="card-gradient-overlay"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5" style={{ backgroundColor: "#ffebee" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500"
                className="img-fluid rounded-4 shadow-lg img-hover"
                alt="Beauty products"
              />
            </div>
            <div className="col-lg-6">
              <h2
                className="fw-bold mb-4"
                style={{
                  fontFamily: "serif",
                  color: "#d32f2f",
                }}
              >
                Why Choose Rose Bliss?
              </h2>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center feature-hover">
                    <div
                      className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3 icon-pulse"
                      style={{ width: "50px", height: "50px" }}
                    >
                      🌟
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-1">
                        Premium Quality
                      </h5>
                      <p className="text-muted mb-0">
                        Authentic brands you trust
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center feature-hover">
                    <div
                      className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3 icon-pulse"
                      style={{ width: "50px", height: "50px" }}
                    >
                      🚚
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-1">
                        Same Day Delivery
                      </h5>
                      <p className="text-muted mb-0">
                        Fast delivery across city
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .nav-hover {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s;
        }

        .nav-hover:hover::before {
          left: 100%;
        }

        .nav-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(211, 47, 47, 0.3);
        }

        .nav-card-hover {
          transition: all 0.4s ease;
          border: 1px solid rgba(225, 83, 109, 0.3);
        }

        .nav-card-hover:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(211, 47, 47, 0.15);
          border-color: rgba(211, 47, 47, 0.5);
        }

        .card-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(255, 235, 238, 0.8) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .nav-card-hover:hover .card-gradient-overlay {
          opacity: 1;
        }

        .img-hover {
          transition: all 0.4s ease;
        }

        .img-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 50px rgba(211, 47, 47, 0.2);
        }

        .feature-hover:hover .icon-pulse {
          animation: iconPulse 0.6s ease;
        }

        @media (max-width: 768px) {
          .hero-content {
            text-align: center;
          }
          .hero-flower {
            font-size: 5rem !important;
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Section;