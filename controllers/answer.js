const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const CustomError = require("../helpers/error/CustomError");
const expressAsynchError = require("express-async-handler");

const addAnswerToQuestion = expressAsynchError(async (req, res, next) => {
  const { question_id } = req.params;
  const user_id = req.user.id;

  const information = req.body;

  const answer = await Answer.create({
    ...information,
    question: question_id,
    user: user_id,
  });

  res.status(200).json({
    success: true,
    data: answer,
  });
});

const getAllAnswers = expressAsynchError(async (req, res, next) => {
  const { question_id } = req.params;
  const question = await Question.findById(question_id).populate("answer");

  const answer = question.answer;

  res.status(200).json({
    success: true,
    count: answer.length,
    data: answer,
  });
});
const getOneAnswer = expressAsynchError(async (req, res, next) => {
  const { answer_id } = req.params;
  const answer = await Answer.findById(answer_id)
    .populate({
      path: "user",
      select: "name profileImage",
    })
    .populate({
      path: "question",
      select: "title content",
    });

  res.status(200).json({
    success: true,
    data: answer,
  });
});
const updateAnswer = expressAsynchError(async (req, res, next) => {
  const { answer_id } = req.params;
  const { information } = req.body.content;
  const answer = await Answer.findById(answer_id);

  answer.content = req.body.content;

  await answer.save();
  return res.status(200).json({
    success: true,
    data: answer,
  });
});
const deleteAnswer = expressAsynchError(async (req, res, next) => {
  const { answer_id } = req.params;
  const { question_id } = req.params;
  const answer = await Answer.findByIdAndDelete(answer_id);
  const question = await Question.findById(question_id);

  question.answer.splice(question.answer.indexOf(answer_id), 1);
  question.answerCount = question.answer.length;
  await question.save();
  res.status(200).json({
    success: true,
    data: answer,
  });
});
const likeAnswer = expressAsynchError(async (req, res, next) => {
  const { answer_id } = req.params;

  let answer = await Answer.findById(answer_id);

  if (answer.likes.includes(req.user.id)) {
    return next(new CustomError("bu cevabı begendiniz", 400));
  }
  answer.likes.push(req.user.id);
  await answer.save();
  return res.status(200).json({
    success: true,
    data: answer,
  });
});
const undoLikeAnswer = expressAsynchError(async (req, res, next) => {
  const { answer_id } = req.params;

  let answer = await Answer.findById(answer_id);

  if (!answer.likes.includes(req.user.id)) {
    return next(new CustomError("bu cevabı beğenmekden çıkaramazsınız", 400));
  }
  const index = answer.likes.indexOf(req.user.id);
  answer.likes.splice(index, 1);
  await answer.save();
  return res.status(200).json({
    success: true,
    data: answer,
  });
});
module.exports = {
  addAnswerToQuestion,
  getAllAnswers,
  getOneAnswer,
  updateAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer,
};
