import React, { useState, useEffect, useRef, useCallback } from "react";

const About = () => {
  const [nebulaPos, setNebulaPos] = useState({ x: 0, y: 0 });
  const [orbitals, setOrbitals] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const containerRef = useRef(null);

  // Generate orbital particles
  useEffect(() => {
    const newOrbitals = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * Math.PI * 2,
      radius: 50 + Math.random() * 70,
      size: Math.random() * 8 + 4,
      hue: Math.random() * 40 + 340,
    }));
    setOrbitals(newOrbitals);
  }, []);

  // Gentle mouse tracking
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setNebulaPos({
        x: (x - 0.5) * 80,
        y: (y - 0.5) * 80,
      });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [handleMouseMove]);

  const features = [
    {
      icon: "🌸",
      title: "Petal-Soft Touch",
      desc: "Silky formulas that melt into your skin like rose petals at dawn",
      gradient: "linear-gradient(135deg, #f9a8d4, #f472b6, #ec4899)",
    },
    {
      icon: "💕",
      title: "Heart-Charged",
      desc: "Infused with love & intention under moonlit skies for radiant energy",
      gradient: "linear-gradient(135deg, #f472b6, #ec4899, #e11d48)",
    },
    {
      icon: "✨",
      title: "Dewdrop Pure",
      desc: "Crystal-clear ingredients harvested at dawn for untouched purity",
      gradient: "linear-gradient(135deg, #fda4af, #f472b6, #fb7185)",
    },
    {
      icon: "🦢",
      title: "Swan-Grace Finish",
      desc: "Elegant radiance that moves with effortless, timeless beauty",
      gradient: "linear-gradient(135deg, #f9a8d4, #fb7185, #f472b6)",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-vh-100 position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fff1f2 0%, #fce7f3 50%, #fbcfe8 100%)",
        color: "#881337",
        padding: "5rem 1rem",
      }}
    >
      {/* 🌸 Subtle Pink Nebula Background */}
      <div className="position-fixed top-0 start-0 w-100 h-100 pointer-events-none">
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: `radial-gradient(circle at ${50 + nebulaPos.x * 0.15}% ${50 + nebulaPos.y * 0.15}%, #fff1f5 0%, #fce7f3 40%, #fbcfe8 100%)`,
            transition: "background 0.6s ease-out",
          }}
        />

        {/* Gentle Floating Orbitals */}
        {orbitals.map((orbital) => (
          <div
            key={orbital.id}
            className="position-absolute rounded-circle opacity-60"
            style={{
              left: `calc(50% + ${Math.cos(orbital.angle) * orbital.radius}px)`,
              top: `calc(50% + ${Math.sin(orbital.angle) * orbital.radius}px)`,
              width: `${orbital.size}px`,
              height: `${orbital.size}px`,
              background: `radial-gradient(circle, hsl(${orbital.hue}, 80%, 90%) 0%, transparent 70%)`,
              filter: "blur(2px)",
            }}
          />
        ))}

        {/* Central Soft Glow */}
        <div
          className="position-absolute top-50 start-50 translate-middle rounded-circle"
          style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #fbcfe8, #f472b6)",
            boxShadow: "0 0 60px rgba(244,114,182,0.5)",
            opacity: 0.7,
          }}
        />
      </div>

      {/* 🎀 Clean Hero Section */}
      <section className="position-relative z-1 text-center mb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="mb-4">
                <span className="display-3">🌸</span>
                <h1
                  className="display-1 fw-black mb-4 mt-3"
                  style={{
                    background: "linear-gradient(135deg, #fb7185, #ec4899, #f43f5e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontSize: "clamp(3rem, 7vw, 6rem)",
                    lineHeight: "1.1",
                  }}
                >
                  RoseBliss Dreams
                </h1>
                <p
                  className="lead fs-4 fw-light mx-auto"
                  style={{
                    color: "rgba(136,19,55,0.85)",
                    maxWidth: "800px",
                    lineHeight: "1.8",
                  }}
                >
                  Where{" "}
                  <span className="fw-bold text-danger">soft elegance</span>{" "}
                  transforms everyday moments into{" "}
                  <span className="fw-bold text-danger">timeless grace</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌺 Feature Cards */}
      <section className="position-relative z-1 mb-5">
        <div className="container">
          <h2
            className="text-center fw-black mb-5"
            style={{
              background: "linear-gradient(135deg, #fb7185, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Blush Attributes
          </h2>

          <div className="row g-4 g-lg-5">
            {features.map((feature, idx) => (
              <div className="col-md-6" key={idx}>
                <div
                  className="position-relative h-100 p-5 rounded-4 border-2 overflow-hidden shadow-sm"
                  style={{
                    borderColor: "rgba(251,176,208,0.6)",
                    background: "linear-gradient(135deg, rgba(255,245,248,0.95), rgba(255,240,245,0.92))",
                    minHeight: "380px",
                    transition: "all 0.4s ease",
                    transform: activeCard === idx ? "translateY(-5px)" : "translateY(0)",
                    boxShadow: activeCard === idx ? "0 15px 40px rgba(244,114,182,0.25)" : "0 4px 20px rgba(244,114,182,0.08)",
                  }}
                  onMouseEnter={() => setActiveCard(idx)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  {/* Subtle Gradient Overlay */}
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: feature.gradient,
                      opacity: activeCard === idx ? 0.2 : 0,
                      transition: "opacity 0.5s ease",
                    }}
                  />

                  <div className="position-relative z-1 h-100 d-flex flex-column justify-content-between">
                    {/* Icon */}
                    <div className="text-center mb-4">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-4"
                        style={{
                          width: "120px",
                          height: "120px",
                          background: feature.gradient,
                          fontSize: "3.5rem",
                          boxShadow: "0 8px 30px rgba(244,114,182,0.3)",
                          transition: "transform 0.4s ease",
                          transform: activeCard === idx ? "scale(1.1)" : "scale(1)",
                        }}
                      >
                        {feature.icon}
                      </div>
                    </div>

                    <div className="text-center">
                      <h3
                        className="fw-black mb-3"
                        style={{
                          background: "linear-gradient(135deg, #be123c, #db2777)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                        }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="fw-light"
                        style={{
                          color: "rgba(136,19,55,0.85)",
                          fontSize: "1.15rem",
                          lineHeight: "1.7",
                        }}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎀 Clean CTA */}
      <section className="position-relative z-1 text-center pt-5 mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h2
                className="fw-black mb-3"
                style={{
                  background: "linear-gradient(135deg, #fb7185, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                }}
              >
                Step Into Softness
              </h2>
              <p
                className="fs-5 fw-light mb-4"
                style={{ color: "rgba(136,19,55,0.85)" }}
              >
                Join 50K+ graceful souls on their glow journey
              </p>

              <button
                className="btn px-5 py-4 border-0 rounded-4 mx-auto d-block"
                style={{
                  background: "linear-gradient(135deg, #fb7185, #ec4899, #f43f5e)",
                  color: "white",
                  fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
                  fontWeight: "700",
                  boxShadow: "0 8px 35px rgba(244,114,182,0.4)",
                  transition: "all 0.3s ease",
                  border: "2px solid rgba(255,255,255,0.5)",
                  minWidth: "280px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 15px 45px rgba(244,114,182,0.55)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 35px rgba(244,114,182,0.4)";
                }}
              >
                <span className="d-flex align-items-center justify-content-center gap-3">
                  <span>🎀</span>
                  Begin Your Glow
                </span>
              </button>

              {/* Trust Signals */}
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-5">
                {[
                  { icon: "🚚", text: "Free Shipping Above ₹999" },
                  { icon: "↩️", text: "30-Day Easy Returns" },
                  { icon: "🔒", text: "100% Secure Payments" },
                  { icon: "🌿", text: "Cruelty-Free & Vegan" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center gap-2 px-4 py-3 rounded-4 border-2"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      borderColor: "rgba(251,176,208,0.6)",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 20px rgba(244,114,182,0.15)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.7)";
                    }}
                  >
                    <span className="fs-4">{badge.icon}</span>
                    <span className="fw-semibold" style={{ color: "#881337" }}>
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Custom Styles */}
      <style>{`
        .fw-black { font-weight: 900; }
      `}</style>
    </div>
  );
};

export default About;