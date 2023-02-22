import ErrorResponse from "../utils/ErrorResponse.js";

// Checks if the request body is valid according to the JOI schema and
// passes it to the next middleware if valid
const validateJOI = (schema) => (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse({
        message: "Keine Daten zum Validieren vorhanden.",
        statusCode: 400,
        errorType: "Validation Error",
        errorCode: "Joi_002",
      })
    );
  }

  const { error } = schema.validate(req.body);
  return error
    ? next(
        new ErrorResponse({
          message: error.details[0].message,
          statusCode: 400,
          errorType: "Validation Error",
          errorCode: "Joi_001",
        })
      )
    : next();
};

export default validateJOI;
