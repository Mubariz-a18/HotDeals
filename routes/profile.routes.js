const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyToken").verifyJwtToken;
const ProfileCotroller = require("../controllers/profileController/profile.controller");


// Profiles Routes
router.post("/api/v1/createProfile", verifyToken, ProfileCotroller.apiCreateProfileWithPhone);   //Create 
router.post("/api/v1/getProfile", verifyToken, ProfileCotroller.apiGetProfile);                  //Get
router.post('/api/v1/updateProfile', verifyToken, ProfileCotroller.apiUpdateProfile)             //Upddate

module.exports = router;
