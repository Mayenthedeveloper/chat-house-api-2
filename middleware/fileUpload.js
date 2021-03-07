const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.userFile = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {},
    filename: function (req, file, cb) {},
  });
  return multer({ storage, fileFilter }).single("avatar");
};
