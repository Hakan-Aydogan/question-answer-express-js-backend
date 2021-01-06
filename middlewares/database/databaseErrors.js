const User = require("../../models/User");
const Questions = require("../../models/Question");
const Answer = require("../../models/Answer");
const CustomError = require("../../helpers/error/CustomError");
const expressAsynchError = require("express-async-handler");

const checkUserExist = expressAsynchError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new CustomError("User doesnt exist", 400));
  }
  next();
});
const checkQuestionExist = expressAsynchError(async (req, res, next) => {
  const question_id = req.params.id || req.params.question_id;

  const question = await Questions.findById(question_id);

  if (!question) {
    return next(new CustomError("Question doesnt exist", 400));
  }
  next();
});
const checkAnswerExist = expressAsynchError(async (req, res, next) => {
  const answer_id = req.params.answer_id;
  const question_id = req.params.question_id;

  const answer = await Answer.findOne({
    _id: answer_id,
    question: question_id,
  });

  if (!answer) {
    return next(new CustomError("Answer doesnt exist", 400));
  }
  next();
});
module.exports = { checkUserExist, checkQuestionExist, checkAnswerExist };