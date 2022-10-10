const Profile = require('../models/Profile/Profile')
const Help = require("../models/helpCenterSchema");
const { track } = require('./mixpanel-service');
 

module.exports = class HelpService {

  // Create Help 
  static async createHelp(bodyData, userId) {
      const findUser = await Profile.findOne({ _id: userId });
      if(!findUser){
        await track('Failed to create Help Doc ', { 
          distinct_id : userId,
          message : bodyData.message,
          title: bodyData.title,
          description: bodyData.description,
          attachment: bodyData.attachment,
        });
        throw ({ status: 404, message: 'USER_NOT_EXISTS' });
      }
      else {
        const msg = bodyData.message;
        const helpdoc = await Help.create({
          user_id: userId,
          phone_number: bodyData.phone_number,
          title: bodyData.title,
          description: bodyData.description,
          attachment: bodyData.attachment,
          message: msg,
        });
        await track('help created ', { 
          distinct_id : userId,
          helpID: helpdoc._id
        });
        const updateUser = await Profile.findOneAndUpdate({
          _id:userId
        },
        {
          $push:{
            help_center:helpdoc._id
          }
        })
        return helpdoc;
      }
  }

  // Delete Help
  static async deleteHelp(bodyData, userId) {
    const helpID = bodyData.helpID;
    // create Help doc
    const findUser = await Profile.findOne({
      _id: userId
    });
    // verify if the user is authorized -- if authorized find help doc with users id
    if(!findUser){
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    if (findUser) {
      const findHelp = await Help.findOne({
        _id: helpID
      })
      // if helpdoc exists remove helpid from user`s help_center feild
      if(!findHelp){
        await track('help deleted ', { 
          distinct_id : userId,
          message:`${findUser.name } tried to delete help doc -- failed`,
          helpID: helpID
        });
        throw ({ status: 404, message: 'HELP_DOC_NOT_EXISTS' });
      }
      else{
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
    }
  }
};
