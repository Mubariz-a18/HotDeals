const User = require("../models/Profile/Profile");
const Complaint = require("../models/complaintSchema");
const ObjectId = require('mongodb').ObjectId;
const {currentDate} = require('../utils/moment');
const { track } = require("./mixpanel-service");

module.exports = class ComplainService {

  // Create Complaint
  static async createComplaint(bodyData, userId) {
    const user = await User.findOne({ _id: userId });
    // if user is verified new complain doc is created 
    if(!user){
     // mixpanel failed to create complain
     await track('failed !! create complaint  ', { 
       distinct_id: userId,
       complaint: bodyData.complaint.reason,
        description: bodyData.complaint.description,
       message:` user_id : ${userId} does not exist`
     });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else{
      const complaint = {
        complaint_id: ObjectId(),
        reason: bodyData.complaint.reason,
        complaint_date: currentDate,
        description: bodyData.complaint.description,
        attachment: bodyData.complaint.attachment,
        status:bodyData.complaint.status
      }
      const findComplaint = await Complaint.findOne({
        user_id : userId
      })
      if(!findComplaint) {
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
      else {
        // if complain doc is already created push another complain in the complaint array 
        const pushCmpln = await Complaint.findOneAndUpdate(
          { user_id: userId},
          {
            $push: {
              complaint: {
                complaint_id: ObjectId(),
                reason: bodyData.complaint.reason,
                complaint_date: currentDate,
                description: bodyData.complaint.description,
                attachment: bodyData.complaint.attachment,
                status :bodyData.complaint.status
              },
            },
          },
          { safe: true, upsert: true, new: true },
        )
        // mixpanel create complain  
        await track(' create complaint successfully ', { 
          distinct_id: pushCmpln._id,
          reason: bodyData.complaint.reason,
          description: bodyData.complaint.description,
        })
        return pushCmpln;
      }
    }
  }
  // update complaint
  static async updateComplain (bodyData, userId){
    const user = await User.findOne({ _id: userId });
    const complain = await Complaint.findOne({user_id:ObjectId(userId)})
    // check if user exists -if not throw error
    if(!user){
      await track('failed !! to update complaint', { 
        distinct_id: bodyData._id,
        reason: bodyData.reason
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      // if user is verified - check if complaint exist  
      if(!complain){
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
            user_id : ObjectId(userId) , 
             "complaint.complaint_id":ObjectId(bodyData.complaint_id) },
          {
            $set: {
              "complaint.$.reason": bodyData.reason,
              "complaint.$.description":bodyData.description,
              "complaint.$.attachment":bodyData.attachment,
              "complaint.$.status" :bodyData.status,
              "complaint.$.complaint_updated_date" : currentDate
            }  
          }, 
          {
            new:true,
            returnOriginal:false,
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