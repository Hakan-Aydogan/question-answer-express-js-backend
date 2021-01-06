const express = require("express");

const router = express.Router();
const User = require("../models/User");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const { getSingleUser, getAllUsers } = require("../controllers/user");
const { checkUserExist } = require("../middlewares/database/databaseErrors");
const userQueryMiddleWare = require("../middlewares/query/userQueryMiddleWare");

router.get("/:id", checkUserExist, getSingleUser);
router.get("/", userQueryMiddleWare(User), getAllUsers);
module.exports = router;
