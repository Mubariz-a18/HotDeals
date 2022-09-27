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
    else {
        const otp = generateOTP(6);
        return await OtpModel.create({
          otp,
          phoneNumber,
        });
      };
    };
  

  static async generateEmailOtpAndCreateDocument(email){
    console.log(email)
    const otpDoc = await OtpModel.findOne({
      email:email,
    });
    if (otpDoc) {
      return otpDoc;
    }
    else {
      const otp = generateOTP(6);
      console.log(otp)
      return await OtpModel.create({
        otp,
        email,
      });
    };
  }

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