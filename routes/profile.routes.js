const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const verifyToken = require("../utils/verifyToken").verifyJwtToken;
const ProfileCotroller = require("../controllers/profileController/pofile.controller");
const Validator = require("../middlewares/validatorMiddleware");

router.post(
  "/api/v1/createProfile",
  verifyToken,
  upload.single('profile_url'),
  ProfileCotroller.apiCreateProfileWithPhone
);

module.exports = router;
