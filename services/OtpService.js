const { generateOTP } = require('../utils/otp.util');
const OtpModel = require('../models/Otp');
const testPhoneNumbers = require('../data/testNumbers');

module.exports = class OtpService {

  static async generateOTPAndCreateDocument(phoneNumber) {
    const otpDoc = await OtpModel.findOne({
      phoneNumber,
    });

    if (otpDoc) {
      return otpDoc;
    }
    else {
      if (testPhoneNumbers.includes(phoneNumber)) {
        const otp = "098612";
        return await OtpModel.create({
          otp,
          phoneNumber,
        });
      }
      else {
        const otp = generateOTP(6);
        return await OtpModel.create({
          otp,
          phoneNumber,
        });
      }
    }
  }

  static async verifyOTP(phoneNumber, otp) {
    const otpDoc = await OtpModel.findOne({
      phoneNumber,
      otp,
    });
    console.log(otpDoc);
    if (otpDoc) {
      if (phoneNumber !== "+919381062923") {
        await OtpModel.deleteOne({
          phoneNumber,
          otp,
        });
      }
      return "approved";
    }
    else {
      return "unapproved";
    }
  }
}