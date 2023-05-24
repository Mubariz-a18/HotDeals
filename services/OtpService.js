const { generateOTP } = require('../utils/otp.util');
const OtpModel = require('../models/Otp');
const EmailController = require('../controllers/CredentialController/email.controller');
const Profile = require('../models/Profile/Profile');
const { INVALID_OTP_ERR } = require('../validators/error');
const { track } = require('./mixpanel-service');
const moment = require('moment');

module.exports = class OtpService {
  //Generating OTP and Creating a Document  
  static async generateOTPAndCreateDocument(phoneNumber, ip) {
    const ipPrefix = ip.split(":")[0];
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss.SSS');
    const otpDocWithPhoneNumber = await OtpModel.countDocuments({
      phoneNumber
    });
    const otpWithIpAddress = await OtpModel.countDocuments({
      ipAddress: ipPrefix
    });

    if (otpWithIpAddress >= 10) {
      throw ({ status: 403, message: 'OTP CANT BE GENERATED AT THE MOMENT' });
    }
    if (otpDocWithPhoneNumber >= 3) {
      throw ({ status: 403, message: 'OTP CANT BE GENERATED AT THE MOMENT' });
    }
    const otpDoc = await OtpModel.findOne({
      phoneNumber: phoneNumber,
      isVerified: false,
      expireAt: {
        $gte: currentDate,
      }
    });

    if (otpDoc) {
      const twoMinutesAfter = moment().utcOffset("+05:30").subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss.SSS');

      if (moment(otpDoc.sentAt, 'YYYY-MM-DD HH:mm:ss.SSS').isSameOrBefore(twoMinutesAfter)) {
        const newDoc = await OtpModel.findOneAndUpdate({
          phoneNumber,
        }, {
          $set: {
            sentAt: currentDate
          }
        });
        return newDoc;
      } else {
        throw ({ status: 403, message: 'OTP CANT BE GENERATED AT THE MOMENT' });
      }
    } else {

      const otp = generateOTP(6);
      const fiveMinutesLater = moment().utcOffset("+05:30").add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss.SSS');
      const newOtp = await OtpModel.create({
        otp,
        phoneNumber,
        ipAddress: ipPrefix,
        sentAt: currentDate,
        createdAt: Date.now(),
        expireAt: fiveMinutesLater
      });

      return newOtp;
    }
  };

  //Verify Otp and Delete Document 
  static async verifyOTPAndDeleteDocument(phoneNumber, otp) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss.SSS');
    const otpDoc = await OtpModel.findOne({
      phoneNumber,
      otp,
      isVerified: false,
      expireAt: {
        $gte: currentDate,
      }
    });
    // Deleting Doc
    if (otpDoc) {
      await OtpModel.updateOne({
        phoneNumber,
        otp,
      }, {
        $set: {
          isVerified: true
        }
      });
      return "approved";
    }
    else {
      // mixpanel track - invalid otp 
      await track('Otp invalid !! ', {
        phoneNumber: phoneNumber,
      });
      return "unapproved";
    };
  };


  //Generating OTP for email and Creating a Document  
  static async generateEmail_OTPAndCreateDocument(email, userId, ip) {
    if (!email) {
      throw ({ status: 403, message: 'Email Required' });
    }
    //check if user is existing or not
    const userExist = await Profile.findOne({
      _id: userId
    })
    if (!userExist) {
      throw ({ status: 401, message: 'USER_NOT_EXIST' });
    }
    if (email === userExist?.email?.text) {
      throw ({ status: 403, message: 'This Email is Already Verified' });
    }
    const ipPrefix = ip.split(":")[0];
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss.SSS');

    const otpDocWithEmail = await OtpModel.countDocuments({
      email
    });
    const otpWithIpAddress = await OtpModel.countDocuments({
      ipAddress: ipPrefix
    });

    if (otpWithIpAddress >= 10) {
      throw ({ status: 403, message: 'OTP CANT BE GENERATED AT THE MOMENT' });
    }
    if (otpDocWithEmail >= 3) {
      throw ({ status: 403, message: 'OTP CANT BE GENERATED AT THE MOMENT' });
    }

    const otpDoc = await OtpModel.findOne({
      email: email,
      isVerified: false,
      expireAt: {
        $gte: currentDate,
      }
    });
    const otp = generateOTP(6);
    if (otpDoc) {
      const twoMinutesAfter = moment().utcOffset("+05:30").subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss.SSS');

      if (moment(otpDoc.sentAt, 'YYYY-MM-DD HH:mm:ss.SSS').isSameOrBefore(twoMinutesAfter)) {
        const newDoc = await OtpModel.findOneAndUpdate({
          email,
        }, {
          $set: {
            sentAt: currentDate
          }
        });
        return newDoc;
      } else {
        throw ({ status: 403, message: 'OTP CANT BE GENERATED AT THE MOMENT' });
      }
    }
    else {
      // sent email to user 
      const fiveMinutesLater = moment().utcOffset("+05:30").add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss.SSS');
      await EmailController.sendEmailWithNodemailer(email, otp, userExist.name)
        .then(async (res) => {
          await OtpModel.create({
            otp,
            email,
            ipAddress: ipPrefix,
            sentAt: currentDate,
            createdAt: Date.now(),
            expireAt: fiveMinutesLater
          });
        })

      // mixpanel track - email sent 
      await track('Otp Sent to Email Success !! ', {
        email: email,
        message: `sent email to user : ${userId}  `
      })
      return "OTP_SENT_TO_EMAIL_SUCCESS"
    };
  };

  //Verify Otp and Delete Document 
  static async verify_Email_By_otp_And_Delete_Document(otp, email, userId) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss.SSS');
    //check if user exist 
    const userExist = await Profile.findOne({
      _id: userId
    })
    //if exist find document in otp collection
    if (userExist) {
      const verify_otp = await OtpModel.findOne({
        user_id: userId,
        email,
        otp,
        isVerified: false,
        expireAt: {
          $gte: currentDate,
        }
      })
      //if exists update users profile email as well as is_email_verified 
      if (verify_otp) {
        await Profile.findOneAndUpdate({ _id: userId }, {
          $set: {
            "email.text": email,
            "is_email_verified": true
          }
        })
        // mixpanel track - email sent 
        await track('Otp verfication Success !! ', {
          email: email,
          message: `sent email to user : ${userId}  `
        })
        await OtpModel.updateOne({ _id: verify_otp._id },
          {
            $set: {
              isVerified: true
            }
          });
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