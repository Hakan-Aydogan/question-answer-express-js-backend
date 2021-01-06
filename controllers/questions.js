const User = require("../models/User");
const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const expressAsynchError = require("express-async-handler");
const { sendJwtToUser } = require("../helpers/authorization/tokenHelpers");

const getOneQuestions = expressAsynchError(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});
const getAllquestions = expressAsynchError(async (req, res, next) => {
  res.status(200).json(res.queryResults);
});
const askQuestion = expressAsynchError(async (req, res, next) => {
  const information = req.body;
  console.log(information);
  const question = await Question.create({
    ...information,
    user: req.user.id,
  });
  res.status(200).json({
    success: true,
    data: question,
  });
});
const editQuestion = expressAsynchError(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  let question = await Question.findById(id);
  question.title = title;
  question.content = content;

  question = await question.save();

  return res.status(200).json({
    success: true,
    data: question,
  });
});
const deleteQuestion = expressAsynchError(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findById(id);

  question = await question.remove();

  return res.status(200).json({
    success: true,
    data: question,
  });
});
const likeQuestion = expressAsynchError(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findById(id);

  if (question.likes.includes(req.user.id)) {
    return next(new CustomError("bu soruyu begendiniz", 400));
  }
  question.likes.push(req.user.id);
  question.likesCount = question.likes.length;
  await question.save();
  return res.status(200).json({
    success: true,
    data: question,
  });
});
const undoLikeQuestion = expressAsynchError(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findById(id);

  if (!question.likes.includes(req.user.id)) {
    return next(new CustomError("bu soruyu beğenmekden çıkaramazsınız", 400));
  }
  const index = question.likes.indexOf(req.user.id);
  question.likes.splice(index, 1);
  question.likesCount = question.likes.length;
  await question.save();
  return res.status(200).json({
    success: true,
    data: question,
  });
});
module.exports = {
  getAllquestions,
  askQuestion,
  getOneQuestions,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
};
