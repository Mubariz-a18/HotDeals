const errorHandler = require("../../middlewares/errorHandler");
const ProfileService = require("../../services/ProfileService");

module.exports = class ProfileController {
  //API to create Profile First Time With The Phone Number
  static async apiCreateProfileWithPhone(req, res, next) {
    try {
      const {
        profileDoc1,
        message,
        userProfile,
        ShowReferral,
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
        showReferral:ShowReferral,
        userProfile
      })
    } catch (e) {
      errorHandler(e, res)
    };
  }

  //API to Get Profile
  static async apiGetOthersProfile(req, res, next) {
    try {
      const profileData = await ProfileService.getOthersProfile(req.user_ID, req.body.user_Id);
      res.status(200).send(profileData);
    } catch (e) {
      errorHandler(e, res)
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
      errorHandler(e, res)
    };
  }

  // API Update Profile
  static async apiUpdateProfile(req, res, next) {
    try {
      const { updateUsr, referral_code,payoutFlag } = await ProfileService.updateProfile(req.body, req.user_ID);
      res.send({
        message: "success updated Profile",
        ProfileDoc: updateUsr,
        referral_code,
        payoutFlag
      });
    } catch (e) {
      errorHandler(e, res)
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
      errorHandler(e, res)
    };
  };

  static async apiDeleteUser(req, res, next) {
    try {
      const deleteUser = await ProfileService.deleteUserService(
        req.user_ID,
      );
      //response code is sent
      if (deleteUser) {
        res.status(200).json({
          message: "User deleted successfully"
        })
      }
    } catch (e) {
      errorHandler(e, res)
    };
  }

};