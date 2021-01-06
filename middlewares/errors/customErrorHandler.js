const CustomError = require("../../helpers/error/CustomError");
const customErrorHandler = (err, req, res, next) => {
  let customError = err;

  //syntax error
  if (err.name === "SyntaxError") {
    customError = new CustomError("Unexpected Syntax Error", 400);
  }

  //duplicate mail error
  if (err.code === 11000) {
    customError = new CustomError("Provide a different email", 400);
  }

  //mongoDb cast error
  if (err.name === "CastError") {
    customError = new CustomError("User Id casting error", 400);
  }
  res.status(customError.status || 500).json({
    success: false,
    data: [
      customError.name,
      customError.message || "Internal Server Error",
      customError.status,
    ],
  });
};
module.exports = customErrorHandler;
