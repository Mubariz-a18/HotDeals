const OtpService = require("../../services/OtpService");
const User = require("../../models/Profile/User");
const { createJwtToken } = require("../../utils/generateToken");
const { INVALID_OTP_ERR } = require("../../error");
const SMSController = require("./sms.controller");
const { track } = require("../../services/mixpanel-service");
const mixpanel = require("mixpanel");


module.exports = class AuthController {
  // Get OTP with PhoneNumber
  static async apiGetOTP(req, res, next) {
    const { phoneNumber } = req.body;
      // Creating OTP for phoneNumber
      const otpDoc = await OtpService.generateOTPAndCreateDocument(phoneNumber.text);
      let msgResponse = {};

      msgResponse = await SMSController.sendSMS(otpDoc.otp, phoneNumber);
      if (msgResponse.status === "success") {
        // mixpanel track - email sent 
        await track('Otp Sent to Phone number successfully !! ', {
          phoneNumber: phoneNumber,
          message: `otp sent to  ${phoneNumber}`
        })
        res.json({
          message: "OTP Sent Successfully",
        });
      } else {
        res.status(400).json({
          message: msgResponse.data,
        });
      }
  }

  static async apiVerifyOTP(req, res, next) {
    const { phoneNumber, otp } = req.body;

    try {
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
          const token = createJwtToken(userID, phoneNumber.text);
          // save user token
          await track("login successfull", {
            distinct_id: userID,
          })
          return res.status(200).json({
            message: "success",
            token,          
            existingUser: true,
          });
          //return res.send({ token });
        }else{
        // If new user, create a user

        const user = await User.create({
          userNumber: phoneNumber.text,
        });

        const token = createJwtToken(user["_doc"]["_id"], phoneNumber.text);
        // save user token
        user.token = token;

        return res.status(200).json({
          message: "success",
          statusCode:200,
          token,
          existingUser: false,
        });
      }
      }
      return res.status(400).json({
        message: INVALID_OTP_ERR,
        statusCode:401
      });
    } catch (error) {
          await track("login unsuccessfull", {
            distinct_id: phoneNumber,
          })
          return res.status(500).send({
            error: {
              message: ` something went wrong try again : ${e.message} `
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
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
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
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
    };
  };
}

