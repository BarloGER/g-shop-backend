// Returns a new function that will handle errors thrown by the given function fn
// and pass them to the next function in the middleware stack.
function asyncHandler(fn) {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
