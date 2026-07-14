import React from "react";

const Spinner = ({ text = "Loading..." }) => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "50vh" }}
    >
      <div
        className="spinner-border text-danger"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-semibold">{text}</p>
    </div>
  );
};

export default Spinner;