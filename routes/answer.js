const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAccessToRoute,
  getQuestionOwnerAccess,
  getAnswerOwnerAccess,
} = require("../middlewares/authorization/auth");
const { checkAnswerExist } = require("../middlewares/database/databaseErrors");

const {
  addAnswerToQuestion,
  getAllAnswers,
  getOneAnswer,
  updateAnswer,
  deleteAnswer,
  undoLikeAnswer,
  likeAnswer,
} = require("../controllers/answer");

router.post("/", getAccessToRoute, addAnswerToQuestion);
router.get("/", getAllAnswers);
router.get("/:answer_id/", checkAnswerExist, getOneAnswer);
[checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  router.get(
    "/:answer_id/like",
    [checkAnswerExist, getAccessToRoute],
    likeAnswer
  );
router.get(
  "/:answer_id/unlike",
  [checkAnswerExist, getAccessToRoute],
  undoLikeAnswer
);
router.put(
  "/:answer_id/edit/",
  [checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  updateAnswer
);
router.delete(
  "/:answer_id/delete/",
  [checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  deleteAnswer
);

module.exports = router;
