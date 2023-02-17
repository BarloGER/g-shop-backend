// Creates the err messages for the client and sends them to the errorHandler middleware
class ErrorResponse extends Error {
  constructor({ message, statusCode, errorType, errorCode }) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.errorCode = errorCode;
  }
}

export default ErrorResponse;
