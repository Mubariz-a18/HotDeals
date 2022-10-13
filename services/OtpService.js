const { generateOTP } = require('../utils/otp.util');
const OtpModel = require('../models/Otp');
const testPhoneNumbers = require('../data/testNumbers');

module.exports = class OtpService {
  //Generating OTP and Creating a Document  
  static async generateOTPAndCreateDocument(phoneNumber) {
    const otpDoc = await OtpModel.findOne({
      phoneNumber,
    });
    //if  number is already present return otpDoc  
    if (otpDoc) {
      return otpDoc;
    }
    else {
        const otp = generateOTP(6);
        return await OtpModel.create({
          otp,
          phoneNumber,
        });
      };
    };
  



  //Verify Otp and Delete Document 
  static async verifyOTPAndDeleteDocument(phoneNumber, otp) {
    const otpDoc = await OtpModel.findOne({
      phoneNumber,
      otp,
    });
    // Deleting Doc
    if (otpDoc) {
      if (phoneNumber) {
        await OtpModel.deleteOne({
          phoneNumber,
          otp,
        });
      };
      return "approved";
    }
    else {
      return "unapproved";
    };
  };
};