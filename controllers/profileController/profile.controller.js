const ProfileService = require("../../services/ProfileService");

module.exports = class ProfileController {
  //API to create Profile First Time With The Phone Number
  static async apiCreateProfileWithPhone(req, res, next) {
    try {
      console.log(req.body)
      const profileDocument = await ProfileService.createProfile(
        req.body,
        req.user_ID,
        req.user_phoneNumber
      );
      res.send({
        message:"Success",
        statusCode:200,
        Profile_Data:profileDocument
      })
    } catch (error) {
      res
        .status(400)
        .json({ error: "Something went wrong in profile controller" });
    }
  }

  //API to Get Profile
  static async apiGetProfile(req, res, next) {
    try {
      console.log(req.user_ID)
      const profileData = await ProfileService.getProfile(req.user_ID);
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