var multer = require("multer");
var upload = multer();
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
      res.status(200).json(profileDocument);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Something went wrong in profile controller" });
    }
  }

  //API to Get Profile
  static async apiGetProfile(req, res, next) {
    try {
      const id = "62c82ba70e0677180c29a07d";
      const profileData = await ProfileService.getProfile(id);
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
      const profileData = await ProfileService.updateProfile(req.body);
      if (profileData) {
        res.send(profileData);
      } else {
        res.status(400).send({ msg: "Update profile Failed" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }
};
