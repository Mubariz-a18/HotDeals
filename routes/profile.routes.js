const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyToken").verifyJwtToken;
const ProfileCotroller = require("../controllers/profileController/profile.controller");
const { rateLimiter } = require("../middlewares/rateLimiterMiddleWare");
const { globalWindowTime, globalApiHits } = require("../utils/globalRateLimits");

const {
    getMyProfileTime,
    getOthersProfileTime,
    updateProfileTime,
} = globalWindowTime
const {
    getMyProfileHits,
    getOthersProfileHits,
    updateProfileHits,
} = globalApiHits
// Profiles Routes
router.post("/api/v1/createProfile", 
verifyToken, 
ProfileCotroller.apiCreateProfileWithPhone);   //Create 
router.post("/api/v1/getOthersProfile", 
rateLimiter(getOthersProfileTime,getOthersProfileHits), 
verifyToken, ProfileCotroller.apiGetOthersProfile);                  //Get
router.get("/api/v1/getMyProfile", 
rateLimiter(getMyProfileTime,getMyProfileHits), 
verifyToken, ProfileCotroller.apiGetMyProfile);               //Get my profile
router.post('/api/v1/updateProfile', 
rateLimiter(updateProfileTime,updateProfileHits), 
verifyToken, ProfileCotroller.apiUpdateProfile)             //Upddate
router.get("/api/v1/checkUserProfile", 
verifyToken, 
ProfileCotroller.apiCheckUserProfileExist);
router.delete("/api/v1/deleteUser", 
verifyToken,
ProfileCotroller.apiDeleteUser);

module.exports = router;
