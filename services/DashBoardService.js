const Profile = require("../models/Profile/Profile");
const Ads = require("../models/Ads/adSchema");
const AdService = require("./AdService");
module.exports = class DashBoardService {
  static async getDashBoard(bodyData) {
    console.log("Inside DashBoard Service");

    const results = await Ads.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [78.390452, 17.450877],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: 600000,
        //   minDistance: 10000
        },
      },
    ]);
    console.log(results.length);
  }
};
