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
        profileDocument: profileDocument
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
  static async apiGetProfile(req, res, next) {
    try {
      const profileData = await ProfileService.getProfile(req.body.user_Id);
      if (profileData) {
        res.send(profileData);
      } else {
        res.status(400).json({ error: "Profile Not Found" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }

  static async apiUpdateProfile(req, res, next) {
    try {
      const profileData = await ProfileService.updateProfile(req.body,req.user_ID);
      if (profileData) {
        res.send({
          message:"success",
          statusCode:200,
          ProfileDoc:profileData
        });
      } else {
        res.status(400).send({ msg: "Update profile Failed" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }
};