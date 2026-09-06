import AppError from "../utils/AppError.js";

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    const field = err.errors?.[0]?.path || "field";
    message = `${field} already exists.`;
  }

  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors.map((error) => error.message).join(", ");
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 400;
    message = "Invalid doctor reference.";
  }

  if (err.name === "SequelizeDatabaseError") {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    error: true,
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export {
  notFound,
  globalErrorHandler,
};
