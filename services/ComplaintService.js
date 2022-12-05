const User = require("../models/Profile/Profile");
const Complaint = require("../models/complaintSchema");
const ObjectId = require('mongodb').ObjectId;
const { currentDate } = require('../utils/moment');
const { track } = require("./mixpanel-service");
const moment = require('moment');
module.exports = class ComplainService {

  // Create Complaint
  static async createComplaint(bodyData, userId) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const { reason, description, attachment, status, ad_id } = bodyData.complaint
    const user = await User.findOne({ _id: userId });
    // if user is verified new complain doc is created 
    if (!user) {
      // mixpanel failed to create complain  & throw error
      await track('failed !! create complaint  ', {
        distinct_id: userId,
        complaint: reason,
        description: description,
        message: ` user_id : ${userId} does not exist`
      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      const complaint = {
        complaint_id: ObjectId(),
        reason,
        complaint_date: currentDate,
        description,
        ad_id,
        attachment,
        status
      }
      const findComplaint = await Complaint.findOne({
        user_id: userId
      })
      if (!findComplaint) {
        //create complaint
        const createcomplaint = await Complaint.create({
          user_id: userId,
          complaint: complaint,
        });
        // mixpanel create complain 
        await track('create complaint', {
          distinct_id: createcomplaint._id,
          reason: reason,
        })
        return createcomplaint
      }
      else {
        // if complain doc is already exist  push another complaint in the complaint array 
        const pushCmpln = await Complaint.findOneAndUpdate(
          { user_id: userId },
          {
            $push: {
              complaint: {
                complaint_id: ObjectId(),
                reason,
                complaint_date: currentDate,
                description,
                attachment,
                status
              },
            },
          },
          { safe: true, upsert: true, new: true },
        )
        // mixpanel create complain  
        await track(' create complaint successfully ', {
          distinct_id: pushCmpln._id,
          reason: reason,
          description: description,
        })
        return pushCmpln;
      }
    }
  }
  // update complaint
  static async updateComplain(bodyData, userId) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const { reason, description, attachment, status } = bodyData
    const user = await User.findOne({ _id: userId });
    // check if user exists -if not throw error
    if (!user) {
      await track('failed !! to update complaint', {
        distinct_id: bodyData._id,
        reason: bodyData.reason
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      // if user is verified - check if complaint exist
      // check if complaint exist in Complaint array of Complaint Collection 
      const complain = await Complaint.findOne({ user_id: ObjectId(userId), "complaint.complaint_id": ObjectId(bodyData.complaint_id) })
      //if not exist throw error 
      if (!complain) {
        await track('failed !! to update complaint', {
          distinct_id: userId,
          reason: bodyData.reason,
          message: `complaint : ${bodyData._id}  doesnot exists `
        })
        throw ({ status: 404, message: 'COMPLAINT_NOT_EXISTS' });
      }
      else {
        //if user and complaint exist update the complaint object
        const updatecomplaintDoc = await Complaint.findOneAndUpdate(
          {
            user_id: ObjectId(userId),
            "complaint.complaint_id": ObjectId(bodyData.complaint_id)
          },
          {
            $set: {
              "complaint.$.reason": reason,
              "complaint.$.description": description,
              "complaint.$.attachment": attachment,
              "complaint.$.status": status,
              "complaint.$.complaint_updated_date": currentDate
            }
          },
          {
            new: true,
            returnOriginal: false,
          }
        )
        // mix panel tack for updating a complain
        await track('update complain successfully !!', {
          distinct_id: updatecomplaintDoc._id,
          reason: bodyData.reason
        });

        return updatecomplaintDoc;
      }
    }
  }
};