const AdService = require("../../services/AdService");

module.exports = class AdController {
  //API to create Profile First Time With The Phone Number
  static async apiCreateAd(req, res, next) {
    try {
      console.log("inside ad create controller");
      const adDocument = await AdService.createAd(req.body, req.user_ID);

      res.status(200).send({
        message: "Ad Successfully created!",
        Ad: adDocument,
      });
    } catch (error) {
      res
        .status(400)
        .json({ error: "Something went wrong in creating the Ad" });
    }
  }

  //   //API to Get Profile
  //   static async apiGetAd(req, res, next) {
  //     try {
  //       const profileData = await ProfileService.createProfile(req.body);
  //       res.send(profileData);
  //     } catch (error) {
  //       res.status(400).json({ error: error });
  //     }
  //   }

  //   static async apiUpdateAd(req, res, next) {
  //     try {
  //       const profileData = await ProfileService.updateProfile(req.body);
  //       if (profileData) {
  //         res.send(profileData);
  //       } else {
  //         res.status(400).send({ msg: "Update profile Failed" });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       res.status(400).json({ error: error });
  //     }
  //   }
};
