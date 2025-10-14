// use with external web methods
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(
      (
        error // here, you can also use reject block instead of catch block
      ) => next(error) // if error occurred, express skip all regular middleware, and jumping directly to error-handling middleware
    );
  };
};

export { asyncHandler };

// A function which contain funcion as paramenter or return function variable known as Higher Order Function.
// const asyncHandler = () => {}
// const asyncHandler = (fn) => {() => {}}
// or
// const asyncHandler = (fn) => () => {}
// Make HOF async
// const asyncHandler = (fn) => async () => {}

// here, next use for middleware
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json({ success: false, message: error.message });
//   }
// };
