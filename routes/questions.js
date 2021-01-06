const express = require("express");
const answer = require("./answer");
const Question = require("../models/Question");
const {
  getAllquestions,
  askQuestion,
  getOneQuestions,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
} = require("../controllers/questions");
const {
  getAccessToRoute,
  getQuestionOwnerAccess,
} = require("../middlewares/authorization/auth");
const {
  checkQuestionExist,
} = require("../middlewares/database/databaseErrors");
const questionQueryMiddleWare = require("../middlewares/query/questionQueryMiddleWare");
const answerQueryMiddleWare = require("../middlewares/query/answerQueryMiddleWare");
const router = express.Router();

router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion);
router.get(
  "/:id/unlike",
  [getAccessToRoute, checkQuestionExist],
  undoLikeQuestion
);
router.get(
  "/",
  questionQueryMiddleWare(Question, {
    population: {
      path: "user",
      select: "name profileImage",
    },
  }),
  getAllquestions
);
router.get(
  "/:id",
  checkQuestionExist,
  answerQueryMiddleWare(Question, {
    population: [
      {
        path: "user",
        select: "name profileImage",
      },
      {
        path: "answer",
        select: "content",
      },
    ],
  }),
  getOneQuestions
);
router.post("/ask", getAccessToRoute, askQuestion);
router.put(
  "/:id/edit",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
router.delete(
  "/:id/delete",
  getAccessToRoute,
  checkQuestionExist,
  getQuestionOwnerAccess,
  deleteQuestion
);
router.use("/:question_id/answer", checkQuestionExist, answer);

module.exports = router;
