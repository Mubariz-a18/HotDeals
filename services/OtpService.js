const { generateOTP } = require('../utils/otp.util');
const OtpModel = require('../models/Otp');
const testPhoneNumbers = require('../data/testNumbers');

module.exports = class OtpService {
  //Generating OTP and Creating a Document  
  static async generateOTPAndCreateDocument(phoneNumber) {
    console.log(phoneNumber.length)
    const otpDoc = await OtpModel.findOne({
      phoneNumber,
    });
    //if  number is already present return otpDoc  
    if (otpDoc) {
      return otpDoc;
    }
    //testing dummy numbers
    else {
      if (testPhoneNumbers.includes(phoneNumber)) {
        const otp = "098612";
        return await OtpModel.create({
          otp,
          phoneNumber,
        });
      }

     //else  generate an otp of 6 Digits 
    else {
        const otp = generateOTP(6);
        return await OtpModel.create({
          otp,
          phoneNumber,
        });
      };
    };
  };

  //Verify Otp and Delete Document 
  static async verifyOTPAndDeleteDocument(phoneNumber, otp) {
    const otpDoc = await OtpModel.findOne({
      phoneNumber,
      otp,
    });
    console.log(otpDoc);
    
    // Deleting Doc
    if (otpDoc) {
      if (phoneNumber !== "+919381062923") {
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