const Profile = require("../models/Profile/Profile");
const Ads = require("../models/Ads/adSchema");
const generics = require('../models/Ads/genericSchema')
const AdService = require("./AdService");
module.exports = class HomeService {
  static async getHome(bodyData) {
    console.log("Inside home Service");
    console.log(bodyData)
    let lng = bodyData.lng;
    let lat = bodyData.lat;
    console.log(lng, lat)

    const premiumAds = await generics.aggregate([
      {
        '$geoNear': {
          'near': {
            'type': 'Point',
            'coordinates': [+lng, +lat]
          },
          'distanceField': 'distance',
          'spherical': true,
          'maxDistance': 600000
        }
      },
      {
        '$lookup': {
          'from': 'profiles',
          'localField': 'user_id',
          'foreignField': '_id',
          'as': 'sample_result'
        }
      },
      {
        '$unwind': {
          'path': '$sample_result'
        }
      },
      {
        '$addFields': {
          'Name': '$sample_result.name',
          'User_id': '$sample_result._id',
          'Since': '$sample_result.created_date',
          'Profile_URL': '$sample_result.profile_url'
        }
      },
      {
        $project: {
          _id: 1,
          User_id: 1,
          Name: 1,
          Since: 1,
          Profile_URL: 1,
          category: 1,
          sub_category: 1,
          title: 1,
          price: 1,
          image_url: 1,
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
    ])

    return premiumAds;

  }
};
