import ErrorResponse from "../utils/ErrorResponse.js";

// ----- Takes JOI validation schema, to validate req.body ----- //
const validateJOI = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  return error ? next(new ErrorResponse(error, 400)) : next();
};

export default validateJOI;
