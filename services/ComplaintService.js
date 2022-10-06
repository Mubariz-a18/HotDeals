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

    // if user is verified new complain doc is created 

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
        // if complain doc is already created push another complain in the complaint array 
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
        // mixpanel create complain  
        await track('create complaint', { 
          distinct_id: pushCmpln._id,
          reason: bodyData.complaint.reason
        })
        return pushCmpln;
      }
      else {
        console.log("inside else")
        console.log(complaint)
        const createcomplaint= await Complaint.create({
          user_id: userId,
          complaint: complaint,
  
        });
        // mixpanel create complain 
        await track('create complaint', { 
          distinct_id: createcomplaint._id,
          reason: bodyData.complaint.reason,
        })
        return createcomplaint
      }
    }
    else{
      // mixpanel failed to create complain
      await track('failed create complaint', { 
        distinct_id: userId,
        reason: bodyData.complaint.reason
      });

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
      // if user is verified complain is find and update 
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
      // mix panel tack for updating a complain
      await track('update complain', { 
        distinct_id: updatecomplaintDoc._id,
        reason: bodyData.complaint.reason
      });
      return updatecomplaintDoc;
    }else{
      // mixpanel track -failed to update complain
      await track('failed to update complaint', { 
        distinct_id: updatecomplaintDoc._id,
        reason: bodyData.complaint.reason
      })
      return {
        message:"user not found"
      }
    }
  }
};