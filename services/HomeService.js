const generics = require('../models/Ads/genericSchema')
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
            'distanceField': 'distance',
            'maxDistance': +maxDistance,
           
            'spherical': true
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
            'isPrime': 1
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
    console.log(ads, ads.length)
    return ads;
  };
};