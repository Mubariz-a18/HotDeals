const OtpService = require("../../services/OtpService");
const User = require("../../models/Profile/User");
const Profile = require("../../models/Profile/Profile");
const testPhoneNumbers = require("../../data/testNumbers");
const { createJwtToken } = require("../../utils/generateToken");
const { INVALID_OTP_ERR } = require("../../error");
const SMSController = require("./sms.controller");

module.exports = class AuthController {
  // Get OTP with PhoneNumber
  static async apiGetOTP(req, res, next) {
    const { phoneNumber } = req.body;
    console.log(phoneNumber);

    try {
      // Creating OTP for phoneNumber
      const otpDoc = await OtpService.generateOTPAndCreateDocument(phoneNumber.text);
      let msgResponse = {};
      // If testPhoneNumber
      if (testPhoneNumbers.includes(phoneNumber)) {
        msgResponse["status"] = "success";
      }
      //  else {
      //   res.json({
      //     OTP: otpDoc.otp,
      //     message: "OTP Sent Successfully",
      //   });
      // }
         else {
          msgResponse = await SMSController.sendSMS(otpDoc.otp, phoneNumber);
        }

        if (msgResponse.status === "success") {
          res.json({
            statusCode:200,
            message: "OTP Sent Successfully",
          });
        } else {
          res.status(400).json({
            message: msgResponse.data,
          });
        }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  // Verify OTP
  static async apiVerifyOTP(req, res, next) {
    const { phoneNumber, otp } = req.body;

    try {
      //Verfying again otp collection to check the otp is valid
      const verficationStatus = await OtpService.verifyOTP(phoneNumber.text, otp);
      console.log("verification_checkstatus: ", verficationStatus);

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

          //Get user profile
          // let profileDoc = await Profile.findOne({
          //   userNumber: phoneNumber.text,
          // });

          //   if (profileDoc.fcmToken !== fcmToken) {
          //     console.log("Token Not same", fcmToken);
          //     await Profile.updateOne(
          //       {
          //         userNumber: phoneNumber,
          //       },
          //       {
          //         fcmToken: fcmToken,
          //       }
          //     );
          //     profileDoc = await Profile.findOne({
          //       userNumber: phoneNumber,
          //     });
          //   }
          return res.status(200).json({
            message: "success",
            statusCode:200,
            token,          
            existingUser: true,
          });
          //return res.send({ token });
        }

        // If new user, create a user

        const user = await User.create({
          userNumber: phoneNumber.text,
        });
        //Create Default user profile
        // const profileData = await Profile.create({
        //   userNumber: phoneNumber,
        //   userID: user["_doc"]["_id"],
        //   //   fcmToken: fcmToken,
        // });
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
      return res.status(400).json({
        message: INVALID_OTP_ERR,
        statusCode:401
      });
    } catch (error) {
      console.log("errorInVerifyingOTP: ", error);
      return res.status(400).send(error);
    }
  }
};
