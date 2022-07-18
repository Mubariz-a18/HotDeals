const Profile = require("../models/Profile/Profile");
const Ads = require("../models/Ads/adSchema");
const AdService = require("./AdService");
module.exports = class HomeService {
  static async getHome(bodyData) {
    console.log("Inside home Service");
    console.log(bodyData)
    let lng = bodyData.lng;
    let lat = bodyData.lat;
    console.log(lng, lat)

    const premiumAds = await Ads.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [+lng, +lat],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: 600000,
          //   minDistance: 10000
        },
      },

      { $limit: 50 },
      {
        $project: {
          _id: 1,
          category: 1,
          sub_category: 1,
          special_mention: 1,
          description: 1,
          reported: 1,
          reported_by: 1,
          ad_status: 1,
          ad_type: 1,
          ad_expire_date: 1,
          ad_promoted: 1,
          isPrime: 1,
        }
      },
      {
        $facet: {
          "PremiumAds": [{ $match: { isPrime: true } }],
          "RecentAds": [{ $match: { isPrime: false } }]
        }
      },
    ]);

    return premiumAds;

  }
};
