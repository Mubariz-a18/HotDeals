const User = require("../models/Profile/Profile");
const Complaint = require("../models/complaintSchema");
const ObjectId = require('mongodb').ObjectId;
const {currentDate} = require('../utils/moment');
const { track } = require("./mixpanel-service");

module.exports = class ComplainService {

  // Create Complaint
  static async createComplaint(bodyData, userId) {
    console.log("Inside Complain Service");
    const user = await User.findOne({ _id: userId });
    if (user) {
      const complaint = {
        complaint_id: ObjectId(),
        reason: bodyData.complaint.reason,
        complaint_date: currentDate,
        description: bodyData.complaint.description,
        attachment: bodyData.complaint.attachment,
        status:bodyData.complaint.status
      }
      const findComplaint = await Complaint.findOne({
        _id : bodyData._id
      })
      if (findComplaint) {
        console.log("inside complain " + findComplaint._id)
        const pushCmpln = await Complaint.findOneAndUpdate(
          { _id: ObjectId(bodyData._id) },
          {
            $push: {
              complaint: {
                complaint_id: ObjectId(),
                reason: bodyData.complaint.reason,
                complaint_date: currentDate,
                description: bodyData.complaint.description,
                attachment: bodyData.complaint.attachment,
                status :bodyData.status
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
        console.log(complaint)
        const createcomplaint= await Complaint.create({
          user_id: userId,
          complaint: complaint,
  
        });
        await track('create complain', { 
          distinct_id: createcomplaint._id,
          reason: bodyData.complaint.reason,
        })
        return createcomplaint
      }
    }
    else{
      res.send({
        statusCode:200,
        message:"User Not Found"
      })
    }
  }
  
  static async updateComplain (bodyData, userId){
    const user = await User.findOne({ _id: userId });
    const complain = await Complaint.findOne({ad_id:ObjectId(bodyData.ad_id)})
    console.log(complain)
    if(user){
      const updatecomplaintDoc = await Complaint.findOneAndUpdate(
        { ad_id:ObjectId(bodyData.ad_id) },
        {
          $set: {
            complaint: {
              user_id: userId,
              reason: bodyData.complaint.reason,
              description: bodyData.complaint.description,
              attachment: bodyData.complaint.attachment
            }
          }
          
        },
        {new: true }
      )
      await track('update complain', { 
        distinct_id: updatecomplaintDoc._id,
        reason: bodyData.complaint.reason
      })
      return updatecomplaintDoc;
    }
  }
};