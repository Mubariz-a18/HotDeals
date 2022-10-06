const Profile = require('../models/Profile/Profile')
const Help = require("../models/helpCenterSchema");
const { track } = require('./mixpanel-service');
 

module.exports = class HelpService {

  // Create Help 
  static async createHelp(bodyData, userId) {
      const findUser = await Profile.findOne({ _id: userId });
      if (findUser) {
        const msg = bodyData.message;
        const newCmpln = await Help.create({
          user_id: userId,
          phone_number: bodyData.phone_number,
          title: bodyData.title,
          description: bodyData.description,
          attachment: bodyData.attachment,
          message: msg,
        });
        await track('help created ', { 
          distinct_id : userId,
          helpID: newCmpln._id
        });
        const updateUSer = await Profile.findOneAndUpdate({
          _id:userId
        },
        {
          $push:{
            help_center:newCmpln._id
          }
        })
        return newCmpln;
      }else{
        return {
          type: 'Error',
          message: "user not found",
          statusCode:403
        };
      }
  }

  // Delete Help
  static async deleteHelp(bodyData, userId) {
    const helpID = bodyData.helpID;
    // create Help doc
    const findUsr = await Profile.findOne({
      _id: userId
    });
    // verify if the user is authorized -- if authorized find help doc with users id
    if (findUsr) {
      const findHelp = await Help.findOne({
        _id: helpID
      })
      // if helpdoc exists remove helpid from user`s help_center feild
      if (findHelp) {
        const deleteHelp = await Profile.findOneAndUpdate(
          { _id: userId },
          { $pull: { help_center: helpID } },
          { new: true }
        );
        // mixpanel track -- delete help
        await track('help deleted ', { 
          distinct_id : userId,
          helpID: helpID
        });
        return deleteHelp;
      }
      else {
       return {
         type:"Error",
          message: "No helpdoc Found!!",
          statusCode: 404
        } 
      }
    }
    else {
      return {
        type:"Error",
        message: "User not found!!",
        statusCode: 403
      }
    }
  }
};
