const { generateOTP } = require('../utils/otp.util');
const OtpModel = require('../models/Otp');
const EmailController = require('../controllers/CredentialController/email.controller');
const Profile = require('../models/Profile/Profile');
const { INVALID_OTP_ERR } = require('../error');
const { track } = require('./mixpanel-service');


module.exports = class OtpService {
  //Generating OTP and Creating a Document  
  static async generateOTPAndCreateDocument(phoneNumber) {
    const otpDoc = await OtpModel.findOne({
      phoneNumber,
    });
    if (otpDoc) {
      await OtpModel.deleteOne(
        { phoneNumber: phoneNumber }
      )
      const otp = generateOTP(6);

      return await OtpModel.create({
        otp,
        phoneNumber,
      });

    } else {
      const otp = generateOTP(6);
      return await OtpModel.create({
        otp,
        phoneNumber,
      });
    }
  };

  //Verify Otp and Delete Document 
  static async verifyOTPAndDeleteDocument(phoneNumber, otp) {
    const otpDoc = await OtpModel.findOne({
      phoneNumber,
      otp,
    });
    // Deleting Doc
    if (otpDoc) {
      await OtpModel.deleteOne({
        phoneNumber,
        otp,
      });
      return "approved";
    }
    else {
      // mixpanel track - invalid otp 
      track('Otp invalid !! ', {
        phoneNumber: phoneNumber,
      })
      return "unapproved";
    };
  };

  //Generating OTP for email and Creating a Document  
  static async generateEmail_OTPAndCreateDocument(email, userId) {
    //check if user is existing or not
    const userExist = await Profile.findOne({
      _id: userId
    })
    //if exist generate 6 digit otp to the email by nodemailer
    if (userExist) {
      const otp = generateOTP(6);
      const email_OtpDoc = await OtpModel.findOne({
        email,
      });
      if (email_OtpDoc) {
        return email_OtpDoc;
      }
      else {
        // sent email to user 
        await EmailController.sendEmailWithNodemailer(email, otp)
          .then(async (res) => {
            await OtpModel.create({
              otp,
              email,
              user_id: userId
            });
          })
        // mixpanel track - email sent 
        await track('Otp Sent to Email Success !! ', {
          email: email,
          message: `sent email to user : ${userId}  `
        })
        return "OTP_SENT_TO_EMAIL_SUCCESS"
      };
    }
    else {
      throw ({ status: 401, message: 'USER_NOT_EXIST' });
    }
  };

  //Verify Otp and Delete Document 
  static async verify_Email_By_otp_And_Delete_Document(otp, email, userId) {
    //check if user exist 
    const userExist = await Profile.findOne({
      _id: userId
    })
    //if exist find document in otp collection
    if (userExist) {
      const verify_otp = await OtpModel.findOne({
        user_id: userId,
        email,
        otp
      })
      //if exists update users profile email as well as is_email_verified 
      if (verify_otp) {
        await Profile.findOneAndUpdate({ _id: userId }, {
          $set: {
            "email.text": email,
            "is_email_verified": true
          }
        })
        //delete doc
        await OtpModel.deleteOne({ email, otp })
        // mixpanel track - email sent 
        await track('Otp verfication Success !! ', {
          email: email,
          message: `sent email to user : ${userId}  `
        })
        return "EMAIL_VERIFICATION_SUCCESSFULL"
      } else {
        throw ({ status: 401, message: INVALID_OTP_ERR });
      }
    }
    else {
      throw ({ status: 401, message: 'USER_NOT_EXIST' });
    }
  };
};