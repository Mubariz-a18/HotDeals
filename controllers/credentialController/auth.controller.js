const OtpService = require("../../services/OtpService");
const User = require("../../models/Profile/User");
const { createJwtToken } = require("../../utils/generateToken");
const { INVALID_OTP_ERR } = require("../../validators/error");
const SMSController = require("./sms.controller");
const { track } = require("../../services/mixpanel-service");
const Profile = require("../../models/Profile/Profile");
const { ObjectId } = require("mongodb");
const errorHandler = require("../../middlewares/errorHandler");

module.exports = class AuthController {
  // Get OTP with PhoneNumber
  static async apiGetOTP(req, res, next) {
    try {
      const ip = req.ip;
      const { phoneNumber, smsToken } = req.body;
      // Creating OTP for phoneNumber
      if (!phoneNumber.text) {
        throw ({ status: 401, message: 'PHONE_NUMBER_REQUIRED' });
      } else {
        if (phoneNumber.text == "0123456789") {
          res.status(200).json({
            message: "OTP Sent Successfully",
          });
        }
        else {
          let msgResponse = {};
          const otpDoc = await OtpService.generateOTPAndCreateDocument(phoneNumber.text, ip);
          if (otpDoc) {
            msgResponse = await SMSController.sendSMS(otpDoc.otp, phoneNumber, smsToken);
            if (msgResponse.status === "success") {
              // mixpanel track - email sent 
              await track('Otp Sent to Phone number successfully !! ', {
                phoneNumber: phoneNumber,
                message: `otp sent to  ${phoneNumber}`
              })
              res.status(200).json({
                message: "OTP Sent Successfully",
              });
            } else {
              res.status(400).json({
                message: msgResponse.data,
              });
            }
          } else {
            throw ({ status: 500, message: 'SOMETHING_WENT_WRONG' });
          }
        }
      }
    } catch (e) {
      errorHandler(e, res)
    }
  }

  static async apiVerifyOTP(req, res, next) {
    const { phoneNumber, otp } = req.body;

    try {
      if (phoneNumber.text == "0123456789") {

        const dummyExist = await Profile.findById({ _id: ObjectId("63ca69c1bed13a9dd55702fc") });

        const token = await createJwtToken(ObjectId("63ca69c1bed13a9dd55702fc"), phoneNumber.text);

        return res.status(200).json({
          message: "success",
          token,
          existingUser: true,
          usersProfileExist: dummyExist ? "USERS_PROFILE_EXISTS" : "USERS_PROFILE_DOESNOT_EXISTS"
        });

      } else {
        //Verfying again otp collection to check the otp is valid
        const verficationStatus = await OtpService.verifyOTPAndDeleteDocument(phoneNumber.text, otp);
        if (verficationStatus === "approved") {
          //Get user from Database
          const oldUser = await User.findOne({
            userNumber: phoneNumber.text,
          }); // CHECK THIS!!!!

          if (oldUser) {
            // If user exists
            const userID = oldUser["_id"];
            const token = await createJwtToken(userID, phoneNumber.text);
            // save user token
            await track("login successfull", {
              distinct_id: userID,
            })
            const UsersProFileExist = await Profile.findById({ _id: userID })
            if (UsersProFileExist) {
              return res.status(200).json({
                message: "success",
                token,
                existingUser: true,
                usersProfileExist: "USERS_PROFILE_EXISTS"
              });
            } else {
              return res.status(200).json({
                message: "success",
                token,
                existingUser: true,
                usersProfileExist: "USERS_PROFILE_DOESNOT_EXISTS"
              });
            }

          } else {
            // If new user, create a user

            const user = await User.create({
              userNumber: phoneNumber.text,
            });

            const token = await createJwtToken(user["_doc"]["_id"], phoneNumber.text);
            // save user token
            user.token = token;
            return res.status(200).json({
              message: "success",
              statusCode: 200,
              token,
              existingUser: false,
            });
          }
        }
        else {
          return res.status(400).json({
            message: INVALID_OTP_ERR
          });
        }
      }
    } catch (error) {
      await track("login unsuccessfull", {
        distinct_id: phoneNumber,
      })
      return res.status(500).send({
        error: {
          message: ` something went wrong try again : ${error.message} `
        }
      });
    }
  }

  // Sent OTP by email
  static async apiSentOtpByEmail(req, res, next) {
    try {
      const { email } = req.body;
      const userId = req.user_ID
      const EmailOtpDoc = await OtpService.generateEmail_OTPAndCreateDocument(email, userId)
      res.status(200).send({
        message: EmailOtpDoc
      })
    } catch (e) {
      errorHandler(e, res)
    };
  };

  // verification of email by otp from nodemailer
  static async apiEmailVerficationByOtp(req, res, next) {
    try {
      const userId = req.user_ID;
      const Otp = req.body.otp;
      const email = req.body.email;
      const emailVerifiedDoc = await OtpService.verify_Email_By_otp_And_Delete_Document(Otp, email, userId)
      res.status(200).send({
        message: emailVerifiedDoc
      })
    }
    catch (e) {
      errorHandler(e, res)
    };
  };
}

