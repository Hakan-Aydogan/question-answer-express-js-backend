# question-answer-express-js-backend
Question Answer Api backend javascript express.js... 

# npm install   for node modules

# routers:

# Auth: 

router.post("/register", cors(), register);

router.post("/login", cors(), login);
router.get("/profile", getAccessToRoute, getUser);
router.get("/logout", getAccessToRoute, logout);
router.post("/forgotpassword", forgotPassword);
router.post("/upload", [
  getAccessToRoute,
  profileImageUpload.single("profile_image"),
  imageUpload,
]);


#  Admin: 
router.get("/block/:id", checkUserExist, blockUser);
router.delete("/delete/:id", checkUserExist, deleteUser);

Answer: 
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

 #  Question: 
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

#  Users:
router.get("/:id", checkUserExist, getSingleUser);
router.get("/", userQueryMiddleWare(User), getAllUsers);

