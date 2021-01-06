const express = require("express");

const router = express.Router();
const cors = require("cors");
const {
  register,
  getUser,
  login,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  edit,
} = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const profileImageUpload = require("../middlewares/library/profileImageUpload");

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
router.put("/resetpassword", resetPassword);
router.put("/edit", getAccessToRoute, edit);

module.exports = router;
