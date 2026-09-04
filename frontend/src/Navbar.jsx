import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "./api/axios";
import { useClerk } from "@clerk/clerk-react";

const Navbar = ({ cart, wishlist }) => {
  const token = localStorage.getItem("token");

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const isAdmin = currentUser?.role === "admin";
  const { signOut } = useClerk();

  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateUser = () => {
      try {
        setCurrentUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products/search?q=${query}`);
        setResults(Array.isArray(res.data.products) ? res.data.products : []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (id) => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    navigate(`/product/${id}`);
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setCollectionsOpen(false);
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light sticky-top shadow-sm"
        style={{ background: "linear-gradient(135deg, #fff 0%, #ffebee 100%)" }}
      >
        <div className="container-fluid">
          <NavLink
            className="navbar-brand fw-bold fs-2 text-danger"
            to="/"
            onClick={closeMenus}
            style={{ fontFamily: "serif", textDecoration: "none" }}
          >
            💄 Rose Bliss
          </NavLink>

          {/* Search — Desktop */}
          <div className="position-relative d-none d-lg-block mx-4">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              style={{
                width: "300px",
                borderRadius: "25px",
                border: "1px solid #d32f2f",
              }}
            />
            {showDropdown && (
              <div
                className="position-absolute bg-white border shadow-lg"
                style={{
                  top: "110%",
                  left: 0,
                  width: "300px",
                  zIndex: 9999,
                  maxHeight: "300px",
                  overflowY: "auto",
                  borderRadius: "12px",
                }}
              >
                {loading && (
                  <div className="p-3 text-muted text-center">Searching...</div>
                )}
                {!loading && results.length === 0 && (
                  <div className="p-3 text-muted text-center">
                    No results found
                  </div>
                )}
                {!loading &&
                  Array.isArray(results) &&
                  results.map((product) => (
                    <div
                      key={product._id}
                      className="d-flex align-items-center gap-2 p-2 border-bottom"
                      style={{ cursor: "pointer" }}
                      onMouseDown={() => handleSelect(product._id)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fff5f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "contain",
                        }}
                        onError={(e) =>
                          (e.target.src = "https://placehold.co/40x40?text=?")
                        }
                      />
                      <div>
                        <div className="fw-bold" style={{ fontSize: "14px" }}>
                          {product.name}
                        </div>
                        <div
                          className="text-danger fw-bold"
                          style={{ fontSize: "13px" }}
                        >
                          ₹{product.price}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${mobileOpen ? "show" : ""}`}
          >
            {/* Search — Mobile */}
            <div className="d-lg-none px-3 py-2 position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                style={{ borderRadius: "25px", border: "1px solid #d32f2f" }}
              />
              {showDropdown && (
                <div
                  className="position-absolute bg-white border shadow-lg"
                  style={{
                    top: "110%",
                    left: "12px",
                    right: "12px",
                    zIndex: 9999,
                    maxHeight: "250px",
                    overflowY: "auto",
                    borderRadius: "12px",
                  }}
                >
                  {loading && (
                    <div className="p-3 text-muted text-center">
                      Searching...
                    </div>
                  )}
                  {!loading && results.length === 0 && (
                    <div className="p-3 text-muted text-center">
                      No results found
                    </div>
                  )}
                  {!loading &&
                    Array.isArray(results) &&
                    results.map((product) => (
                      <div
                        key={product._id}
                        className="d-flex align-items-center gap-2 p-2 border-bottom"
                        style={{ cursor: "pointer" }}
                        onMouseDown={() => handleSelect(product._id)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fff5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                          onError={(e) =>
                            (e.target.src = "https://placehold.co/40x40?text=?")
                          }
                        />
                        <div>
                          <div className="fw-bold" style={{ fontSize: "14px" }}>
                            {product.name}
                          </div>
                          <div
                            className="text-danger fw-bold"
                            style={{ fontSize: "13px" }}
                          >
                            ₹{product.price}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  className="nav-link mx-2 px-4 py-2 rounded-pill text-dark fw-medium nav-hover"
                  to="/home"
                  onClick={closeMenus}
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item position-relative" ref={dropdownRef}>
                <button
                  className="nav-link mx-2 px-4 py-2 rounded-pill text-dark fw-medium nav-hover"
                  onClick={() => setCollectionsOpen(!collectionsOpen)}
                  style={{ border: "none", background: "none" }}
                >
                  Collections
                </button>
                <ul
                  className={`dropdown-menu-custom ${collectionsOpen ? "dropdown-open" : ""}`}
                >
                  <li>
                    <NavLink
                      className="dropdown-item-custom"
                      to="/lipsticks"
                      onClick={closeMenus}
                    >
                      💄 Lipsticks
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item-custom"
                      to="/skincare"
                      onClick={closeMenus}
                    >
                      🧴 Skincare
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item-custom"
                      to="/makeupkits"
                      onClick={closeMenus}
                    >
                      💋 Makeup Kits
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item-custom"
                      to="/perfumes"
                      onClick={closeMenus}
                    >
                      🌸 Perfumes
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link mx-2 px-4 py-2 rounded-pill text-dark fw-medium nav-hover"
                  to="/about"
                  onClick={closeMenus}
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link mx-2 px-4 py-2 rounded-pill text-dark fw-medium nav-hover"
                  to="/contact"
                  onClick={closeMenus}
                >
                  Contact
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link mx-2 px-4 py-2 rounded-pill text-dark fw-medium nav-hover"
                  to="/cart"
                  onClick={closeMenus}
                >
                  🛒 Cart
                </NavLink>
              </li>

              <Link
                className="nav-link mx-2 px-4 py-2 rounded-pill text-dark fw-medium nav-hover"
                to="/my-orders"
                onClick={closeMenus}
              >
                📦 My Orders
              </Link>

              <Link to="/wishlist" className="btn btn-outline-danger mx-2">
                ❤️ Wishlist ({wishlist.length})
              </Link>

              {token ? (
                <li className="nav-item position-relative" ref={dropdownRef}>
                  <button
                    className="nav-link mx-2 px-3 py-2 rounded-pill text-dark fw-medium nav-hover border-0 bg-transparent"
                    onClick={() => setCollectionsOpen(!collectionsOpen)}
                  >
                    👤 {currentUser?.name || "Profile"} ▾
                  </button>

                  <ul
                    className={`dropdown-menu-custom ${
                      collectionsOpen ? "dropdown-open" : ""
                    }`}
                    style={{ right: 0, left: "auto", minWidth: "200px" }}
                  >
                    {isAdmin && (
                      <li>
                        <NavLink
                          className="dropdown-item-custom"
                          to="/admin"
                          onClick={closeMenus}
                        >
                          📊 Admin Dashboard
                        </NavLink>
                      </li>
                    )}

                    <li>
                      <button
                        className="dropdown-item-custom border-0 bg-transparent"
                        onClick={async () => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");

                          window.dispatchEvent(new Event("authChanged"));

                          await signOut();

                          navigate("/");
                        }}
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink
                    className="nav-link mx-2 px-4 py-2 rounded-pill text-dark fw-medium nav-hover"
                    to="/register"
                    onClick={closeMenus}
                  >
                    Register
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <style>{`
        .dropdown-menu-custom {
          position: absolute; top: 100%; left: 0; z-index: 1000;
          min-width: 280px; padding: 12px 0; margin: 0;
          background: rgba(255,255,255,0.98); backdrop-filter: blur(10px);
          border: 1px solid rgba(225,83,109,0.3); border-radius: 15px;
          box-shadow: 0 20px 40px rgba(211,47,47,0.15);
          opacity: 0; visibility: hidden; transform: translateY(-10px);
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1); list-style: none;
        }
        .dropdown-open { opacity: 1 !important; visibility: visible !important; transform: translateY(0) !important; }
        .dropdown-toggle-custom:hover, .nav-hover:hover {
          background: rgba(211,47,47,0.1) !important;
          color: #d32f2f !important; transform: translateY(-2px) !important;
        }
        .dropdown-item-custom {
          display: flex; align-items: center; width: 100%;
          padding: 14px 24px; color: #333; text-decoration: none;
          font-weight: 600; transition: all 0.3s ease;
        }
        .dropdown-item-custom:hover {
          background: rgba(211,47,47,0.1) !important;
          color: #d32f2f !important; padding-left: 32px;
        }
        @media (max-width: 991px) {
          .dropdown-menu-custom {
            position: static; width: auto; margin-top: 8px;
            background: rgba(255,235,238,0.95); border-radius: 12px;
            box-shadow: none; opacity: 1; visibility: visible; transform: none;
          }
          .navbar-nav { text-align: center; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
