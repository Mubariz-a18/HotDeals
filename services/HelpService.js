const Profile = require('../models/Profile/Profile')
const Help = require("../models/helpCenterSchema");
const { validateHelpBody } = require('../validators/HelpValidator');
const { track } = require('./mixpanel-service');
const moment = require('moment');


module.exports = class HelpService {

  // Create Help 
  static async createHelp(bodyData, userId) {
    const isHelpAttachmentValid = validateHelpBody(bodyData)
    if(!isHelpAttachmentValid){
      throw ({ status: 401, message: 'Bad Request' });
    }
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const { phone_Info, title, description, attachment } = bodyData
    //check if user exist 
    const findUser = await Profile.findOne({ _id: userId });
    if (!findUser) {
      // mixpanel track failed to create help doc
      await track('Failed to create Help Doc ', {
        distinct_id: userId,
        $message: `user_id : ${userId} doesnot exists`
      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      // create help doc
      const helpdoc = await Help.create({
        user_id: userId,
        phone_Info,
        title,
        description,
        attachment,
        created_Date: currentDate
      });
      //mixpanel track help doc created
      await track('help created successfully !!', {
        distinct_id: userId,
        helpID: helpdoc._id,
        phone_Info,
        title,
        description,
        attachment,
        created_Date: currentDate
      });
      //user profile updated
      await Profile.findOneAndUpdate({
        _id: userId
      },
        {
          $push: {
            help_center: helpdoc._id
          }
        })
      return helpdoc;
    }
  };

  // Delete Help
  static async deleteHelp(bodyData, userId) {

    const helpID = bodyData.helpID;
    
    // create Help doc
    const findUser = await Profile.findOne({
      _id: userId
    });
      // check if help exists
      const findHelp = await Help.findOne({
        _id: helpID
      })
      // if helpdoc exists remove helpid from user`s help_center feild
      if (!findHelp) {
        // mixpane track  help deleted failed 
        await track('help deleted ', {
          distinct_id: userId,
          message: `${findUser.name} tried to delete help doc -- failed`,
          helpID: `help_id : ${helpID} doesnot exist `
        });
        throw ({ status: 404, message: 'HELP_DOC_NOT_EXISTS' });
      }
      else {
        // remove help id from help_center in user profile
        const deleteHelp = await Profile.findOneAndUpdate(
          { _id: userId },
          { $pull: { help_center: helpID } },
          { new: true }
        );
        // mixpanel track -- delete help
        await track('help deleted successfully !! ', {
          distinct_id: userId,
          helpID: helpID,
        });
        return "SUCCESSFULLY DELETED";
      }
  };

  static async getHelp(userId) {
    // create Help doc
    const findUser = await Profile.findOne({
      _id: userId
    });
    // verify if the user is authorized -- if authorized find help doc with users id
    if (!findUser) {
      //mixpanel track for failed to delete help
      await track('failed to get help !!', {
        distinct_id: userId,
        message: `user_id : ${userId} doesnot exists `,
      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      const helpDocs = await Help.aggregate([
        {
          $match: {
            _id: {
              $in: findUser.help_center
            }
          }
        }, {
          $project: {
            title: 1,
            description: 1,
            attachment: 1,
            created_Date: 1
          }
        }
      ])
      if (helpDocs.length == 0) {
        //mixpanel track for failed to delete help
        await track('failed to get help !!', {
          distinct_id: userId,
          message: `user_id : ${userId} doesnot have any Help Docs `,
        });
        throw ({ status: 404, message: 'HELPS_NOT_EXISTS' });
      } else {
        //mixpanel track for failed to delete help
        await track('get help success !!', {
          distinct_id: userId,
          message: `user_id : ${userId}  fetched help documents `,
        });
        return helpDocs
      }
    }
  };
};
