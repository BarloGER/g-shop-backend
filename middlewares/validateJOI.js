import ErrorResponse from "../utils/ErrorResponse.js";

// Checks if the request body is valid according to the JOI schema and
//passes it to the next middleware if valid
const validateJOI = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  return error ? next(new ErrorResponse(error, 400)) : next();
};

export default validateJOI;
