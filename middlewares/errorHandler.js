// Used in server.js

// Sends errors to client
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message,
    errorType: err.errorType,
    errorCode: err.errorCode,
  });
};

export default errorHandler;
