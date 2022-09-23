const Profile = require("../models/Profile/Profile");
const Alert = require("../models/alertSchema");
const ObjectId = require('mongodb').ObjectId;

module.exports = class AlertService {
  static async createAlert(bodyData, userId) {
    console.log("Inside Alert Service");

    let usr = await Profile.findOne({ _id: userId });
    console.log(usr);
    if (usr) {
      let alertDoc = await Alert.create({
        user_id: "62b59d330f1f77fabbb9d258",
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        name: bodyData.name,
        keyword: bodyData.keyword,
        activate_status: bodyData.activate_status,
      });

      // console.log(alertDoc);

      await Profile.findByIdAndUpdate("62c2ae90f5aae83ced255735", {
        $push: {
          alert: {
            _id: alertDoc._id,
          },
        },
      });

      return alertDoc;
    }
    else{
      res.send({
        statusCode:403,
        
      })
    }
  }

  static async getAlert(bodyData, userId) {
    // let usr = await Profile.findOne({ _id: userId });
    // console.log(usr);

    const myAlert = await Alert.find({
      _id: ["62cfec0704754e7eeb3acabd", "62cfecdd04754e7eeb3acabf", "62b97bdcb27fec8895eb328d", "62bae33a4bfdbe98e0b053b0", "62bd5cbd34fb2ca9e83dcab7", "62bae34f28e5315b736a247f", "62bae3a50757cee70708f8f8", "62bae407493f4881b51324ef", "62bae534493f4881b51324f3", "62baebe7bfd8167c18b713a5"]
    })
    return myAlert;
  }

  static async updateAlert(bodyData, userId) {
    console.log("Inside Alert update Service")
    // let usr = await Profile.findOne({ _id: userId });
    // console.log(usr);

    const updateAds = await Alert.findOneAndUpdate({
      _id: "62cfec0704754e7eeb3acabd"
    }, {
      $set: {
        category: "DOGG11sa1"
        // category: bodyData.category,
        // sub_category: bodyData.sub_category,
        // name: bodyData.name,
        // keyword: bodyData.keyword,
        // activate_status: bodyData.activate_status,
      },

    }, { new: true })
    return updateAds;
  }

  static async deleteAlert(bodyData, userId) {
    console.log("I'm inside Delete Alert")

    // const findAlert = await Alert.findOne({
    //   _id:"62d13ec5a98bf7ff98c93096"
    // })

    const delteAlert = await Profile.findOneAndUpdate(
      { _id: "62c2ae90f5aae83ced255735" },
      { $pull: { alert: ObjectId("62d13ec5a98bf7ff98c93096") } },
      { new: true }
    );
    return delteAlert;
  }
};
