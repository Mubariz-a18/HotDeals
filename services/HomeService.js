const generics = require('../models/Ads/genericSchema')
const profiles = require('../models/Profile/Profile');
const { track } = require('./mixpanel-service');
module.exports = class HomeService {

  // Get Home - Using Aggregation and GeoNear 

  static async getHome(bodyData) {
    console.log("Inside home Service");
    console.log(bodyData)
    let lng = bodyData.lng;
    let lat = bodyData.lat;
    let maxDistance = +bodyData.maxDistance;
    console.log(+lng, +lat)

    // Aggregate Generics with  geonear (longitute and latitues are provided in coordinates )
    const ads = await generics.aggregate([
      [
        {
          '$geoNear': {
            'near': { type: 'Point', coordinates: [+lng, +lat] },
            "distanceField": "dist.calculated",
            'maxDistance': maxDistance,
            "includeLocs": "dist.location",
            'spherical': true
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
            'Seller_Name': '$sample_result.name',
            'Seller_Id': '$sample_result._id',
            'Seller_Joined': '$sample_result.created_date',
            'Seller_Image': '$sample_result.profile_url',
          }
        },
        {
          '$project': {
            '_id': 1,
            'Seller_Id': 1,
            'Seller_Name': 1,
            'Seller_Joined': 1,
            'Seller_Image': 1,
            'category': 1,
            'sub_category': 1,
            'title': 1,
            'price': 1,
            'image_url': 1,
            'special_mention': 1,
            'description': 1,
            'reported': 1,
            'reported_by': 1,
            'ad_status': 1,
            'ad_type': 1,
            'ad_expire_date': 1,
            'ad_promoted': 1,
            'isPrime': 1 ,
            "dist":1
          }
        },
        {
          '$facet': {
            'PremiumAds': [
              {
                '$match': {
                  'isPrime': true
                }
              }
            ],
            'RecentAds': [
              {
                '$match': {
                  'isPrime': false
                }
              }
            ]
          }
        }
      ]
    ])
    await track('home page ', { 
      distinct_id:new Date(),      
      $latitude: +lat,
      $longitude: +lng,
    })
    console.log(ads , ads.length)
    return ads;
  };
};