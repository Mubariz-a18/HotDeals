const Profile = require('../models/Profile/Profile')
const Help = require("../models/helpCenterSchema");

module.exports = class HelpService {
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

        const updateUSer = await Profile.findOneAndUpdate({
          _id:userId
        },
        {
          $push:{
            help_center:newCmpln._id
          }
        })

        return newCmpln;
      }
  }

  static async deleteHelp(bodyData, userId) {
    const helpID = bodyData.helpID;
    const findUsr = await Profile.findOne({
      _id: userId
    })
    if (findUsr) {
      const findHelp = await Help.findOne({
        _id: helpID
      })
      if (findHelp) {
        const deleteHelp = await Profile.findOneAndUpdate(
          { _id: userId },
          { $pull: { help_center: helpID } },
          { new: true }
        )
        return deleteHelp;
      }
      else {
        res.send({
          message: "No Ad Found!!",
          statusCode: "404"
        })
      }
    }
    else {
      res.send({
        message: "User not found!!",
        statusCode: "404"
      })
    }
  }
};
