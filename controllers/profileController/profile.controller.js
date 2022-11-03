const ProfileService = require("../../services/ProfileService");

module.exports = class ProfileController {
  //API to create Profile First Time With The Phone Number
  static async apiCreateProfileWithPhone(req, res, next) {
    try {
      const profileDocument = await ProfileService.createProfile(
        req.body,
        req.user_ID,
        req.user_phoneNumber
      );
      //response code is sent
      res.status(200).json({
        message:"successfully created",
        // profileDocument: profileDocument
      })
    } catch (e) {
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
    };
  }
  //API to Get Profile
  static async apiGetOthersProfile(req, res, next) {
    try {
      const profileData = await ProfileService.getOthersProfile(req.body.user_Id);
      if (profileData) {
        res.send(profileData);
      } else {
        res.status(400).json({ error: "Profile Not Found" });
      }
    } catch (e) {
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
    };
  }
  // API Get My Profile
  static async apiGetMyProfile(req,res,next){
    try{
      const MyProfileData = await ProfileService.getMyProfile(req.user_ID);
        // response code is send 
       res.status(200).send({
        message: "Get My Profile Success",
        MyProfileData : MyProfileData
       });
            
    }catch (e) {
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
    };
  }
  // API Update Profile
  static async apiUpdateProfile(req, res, next) {
    try {
      const profileData = await ProfileService.updateProfile(req.body,req.user_ID);
        res.send({
          message:"success updated Profile",
          ProfileDoc:profileData
        });
    } catch (e) {
      console.log(e)
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
    };
  };
};