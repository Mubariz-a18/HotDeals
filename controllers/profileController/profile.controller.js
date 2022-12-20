const Profile = require("../../models/Profile/Profile");
const ProfileService = require("../../services/ProfileService");

module.exports = class ProfileController {
  //API to create Profile First Time With The Phone Number
  static async apiCreateProfileWithPhone(req, res, next) {
    try {
      const {
        profileDoc1,
        message,
        userProfile,
        statusCode
      } = await ProfileService.createProfile(
        req.body,
        req.user_ID,
        req.user_phoneNumber
      );
      //response code is sent
      res.status(statusCode).json({
        message: message,
        profileDoc1,
        userProfile
      })
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
  }

  //API to Get Profile
  static async apiGetOthersProfile(req, res, next) {
    try {
      const profileData = await ProfileService.getOthersProfile(req.user_ID, req.body.user_Id);
      res.status(200).send(profileData);
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
  static async apiGetMyProfile(req, res, next) {
    try {
      const MyProfileData = await ProfileService.getMyProfile(req.user_ID);
      // response code is send 
      res.status(200).send({
        message: "Get My Profile Success",
        MyProfileData: MyProfileData
      });

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

  // API Update Profile
  static async apiUpdateProfile(req, res, next) {
    try {
      const profileData = await ProfileService.updateProfile(req.body, req.user_ID);
      res.send({
        message: "success updated Profile",
        ProfileDoc: profileData
      });
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
  };

  // Check if user Exist
  static async apiCheckUserProfileExist(req, res, next) {
    try {
      const findUser = await ProfileService.checkUserProfileService(req.user_ID)
      if (findUser) {
        res
          .send({ message: "USER_EXIST" })
          .status(200)
      }
    } catch (e) {
      if (!e.status) {
        res.status(500).json({
          error: {
            message: `something went wrong try again : ${e.message} `
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