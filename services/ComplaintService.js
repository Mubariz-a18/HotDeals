const User = require("../models/Profile/Profile");
const Complaint = require("../models/complaintSchema");
const ObjectId = require('mongodb').ObjectId;
const currentDate = require('../utils/moment')

module.exports = class ComplainService {

  // Create Complaint
  static async createComplaint(bodyData, userId) {
    console.log("Inside Complain Service");
    const user = await User.findOne({ _id: userId });
    if (user) {
      const cmpln = {
        user_id: userId,
        reason: bodyData.complaint.reason,
        complaint_date: currentDate,
        description: bodyData.complaint.description,
        attachement: bodyData.complaint.attachement,
      }
      const findAd = await Complaint.findOne({
        ad_id: bodyData.ad_id
      })
      if (findAd) {
        console.log("inside find ad" + findAd.ad_id)
        const pushCmpln = await Complaint.findOneAndUpdate(
          { _id: ObjectId(findAd._id) },
          {
            $push: {
              complaint: {
                user_id: userId,
                reason: bodyData.complaint.reason,
                complaint_date: currentDate,
                description: bodyData.complaint.description,
                attachement: bodyData.complaint.attachement,
              },
            },
          },
          { safe: true, upsert: true, new: true },
        )
        console.log(pushCmpln)
        return pushCmpln;
      }
      else {
        console.log("inside else")
        console.log(cmpln)
        const createCmpln = await Complaint.create({
          ad_id: bodyData.ad_id,
          complaint: cmpln
        })
        return createCmpln
      }
    }
    else{
      res.send({
        statusCode:200,
        message:"User Not Found"
      })
    }
  }
};
