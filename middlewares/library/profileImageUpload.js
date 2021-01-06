const multer = require("multer");
const path = require("path");
const customError = require("../../helpers/error/CustomError");

//storage; nereye hangi isimle kaydedilecek , filefilter; hangi formatlara izin vericez

const storage = multer.diskStorage({
  destination: function (req, res, callback) {
    const rootDir = path.dirname(require.main.filename);
    callback(null, path.join(rootDir, "public/uploads"));
  },
  filename: function (req, file, callback) {
    const extension = file.mimetype.split("/")[1];
    req.savedProfileImage = "image_" + req.user.id + "." + extension;
    callback(null, req.savedProfileImage);
  },
});
const fileFilter = (req, file, callback) => {
  let allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/JPEG",
    "image/JPG",
    "image/PNG",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new customError("Please upload a valid type image", 400),
      false
    );
  }
  return callback(null, true);
};
const profileImageUpload = multer({ storage, fileFilter });
module.exports = profileImageUpload;
