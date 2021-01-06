const customError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Answer = require("../../models/Answer");
const Question = require("../../models/Question");
const jwt = require("jsonwebtoken");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/authorization/tokenHelpers");
const getAccessToRoute = (req, res, next) => {
  //token
  const { JWT_SECRET_KEY } = process.env;
  if (!isTokenIncluded(req)) {
    return next(new customError("token yok ", 401));
  }

  const accessToken = getAccessTokenFromHeader(req);
  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new customError("You are not authorized access  this route", 401)
      );
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    // console.log(decoded);
  });
  next();
  //custom error handling
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (user.role !== "admin") {
    return next(new customError("Only Admins can access to route", 403));
  }
  next();
});
const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.id;

  const question = await Question.findById(questionId);

  if (userId != question.user) {
    return next(new customError("Bu soruya erişim yetkiniz yok", 403));
  }

  next();
});
const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const answerId = req.params.answer_id;

  const answer = await Answer.findById(answerId);

  if (userId != answer.user) {
    return next(new customError("Bu cevaba erişim yetkiniz yok", 403));
  }

  next();
});

module.exports = {
  getAccessToRoute,
  getAdminAccess,
  getQuestionOwnerAccess,
  getAnswerOwnerAccess,
};
