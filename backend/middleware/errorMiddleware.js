const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Invalid Mongo ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }

  // Duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate value found";
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Auth routes response
  if (req.originalUrl.startsWith("/auth")) {
    return res.status(statusCode).json({
      message,
    });
  }

  // API routes response
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;