const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyToken").verifyJwtToken;
const ProfileCotroller = require("../controllers/profileController/profile.controller");


// Profiles Routes
router.post("/api/v1/createProfile", verifyToken, ProfileCotroller.apiCreateProfileWithPhone);   //Create 
router.post("/api/v1/getOthersProfile", verifyToken, ProfileCotroller.apiGetOthersProfile);                  //Get
router.get("/api/v1/getMyProfile", verifyToken, ProfileCotroller.apiGetMyProfile);               //Get my profile
router.post('/api/v1/updateProfile', verifyToken, ProfileCotroller.apiUpdateProfile)             //Upddate

module.exports = router;
