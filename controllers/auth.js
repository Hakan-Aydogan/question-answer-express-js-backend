const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const expressAsynchError = require("express-async-handler");
const { sendJwtToUser } = require("../helpers/authorization/tokenHelpers");
const sendMail = require("../helpers/libraries/sendEmail");
const {
  validateUserInput,
  comparePasswords,
} = require("../helpers/input/inputHelpers");

const register = expressAsynchError(async (req, res, next) => {
  const { userName, email, password, role } = req.body;
  const user = await User.create({
    userName,
    email,
    password,
    role,
  });
  sendJwtToUser(user, res);
});
const getUser = expressAsynchError(async (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      userName: req.user.userName,
    },
  });
});
const login = expressAsynchError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please fill email and password field", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new CustomError("please check your pass and login crediciantel", 400)
    );
  }
  if (!comparePasswords(password, user.password)) {
    return next(
      new CustomError("please check your pass and login crediciantel", 400)
    );
  }
  sendJwtToUser(user, res);
});
const logout = expressAsynchError(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? true : false,
    })
    .json({
      success: true,
      message: "Logout Succesfull",
    });
});
const imageUpload = expressAsynchError(async (req, res, next) => {
  let x = "profileImage";
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profileImage: req.savedProfileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json({
    success: true,
    message: "Image Upload Succesfull",
    data: user,
  });
});
const forgotPassword = expressAsynchError(async (req, res, next) => {
  const resetEmail = req.body.email;
  const user = await User.findOne({ email: resetEmail });
  if (!user) {
    return next(new CustomError("Kullanıcı Bulunamadı", 400));
  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  console.log(resetPasswordToken);
  await user.save();
  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
  const emailTemplate = `
  <h3>Reset Password</h3>
  <p> This <a href='${resetPasswordUrl}' target='_blank' link> will expire in 1 hour</a>
  `;

  try {
    await sendMail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Reset your Password",
      html: emailTemplate,
    });
    return res.status(200).json({
      success: true,
      message: "Token send to your email",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    console.log(err);
    return next(new CustomError("Email can not be sent", 500));
  }
});
const resetPassword = expressAsynchError(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;

  if (!resetPasswordToken) {
    return next(new CustomError("token yok", 400));
  }
  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new CustomError("Token Expired", 400));
  }
  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Reset Succesfull",
  });
});

const edit = expressAsynchError(async (req, res, next) => {
  // const { name, password, email, password, title, about, place, website, profileImage } = req.body;

  const editInformation = req.body;
  let user = await User.findByIdAndUpdate(req.user.id, editInformation, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    data: user,
  });
});
module.exports = {
  register,
  getUser,
  login,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  edit,
};
