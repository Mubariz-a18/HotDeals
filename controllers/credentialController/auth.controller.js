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

    try {
      // Creating OTP for phoneNumber
      const otpDoc = await OtpService.generateOTPAndCreateDocument(phoneNumber);
      let msgResponse = {};
      // If testPhoneNumber
      if (testPhoneNumbers.includes(phoneNumber)) {
        msgResponse["status"] = "success";
      } else {
        res.json({
          OTP: otpDoc.otp,
          message: "OTP Sent Successfully",
        });
      }
      //    else {
      //     msgResponse = await SMSController.sendSMS(otpDoc.otp, phoneNumber);
      //   }

      //   if (msgResponse.status === "success") {
      //     res.json({
      //       message: "OTP Sent Successfully",
      //     });
      //   } else {
      //     res.status(400).json({
      //       message: msgResponse.data,
      //     });
      //   }
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
      const verficationStatus = await OtpService.verifyOTP(phoneNumber, otp);
      console.log({ phoneNumber, otp });
      console.log("verification_checkstatus: ", verficationStatus);

      if (verficationStatus === "approved") {
        //Get user from Database
        const oldUser = await User.findOne({
          userNumber: phoneNumber,
        }); // CHECK THIS!!!!

        if (oldUser) {
          // If user exists
          console.log("user exists");
          const userID = oldUser["_id"];
          const token = createJwtToken(userID, phoneNumber);
          // save user token

          //Get user profile
          let profileDoc = await Profile.findOne({
            userNumber: phoneNumber,
          });

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
            ...oldUser["_doc"],
            token,
            // profile: profileDoc["_doc"],
            existingUser: true,
            isProfileSetupCompleted: oldUser["_doc"]["displayName"].length > 0,
            // acceptedTerms: profileDoc["_doc"]["acceptedTerms"],
          });
          //return res.send({ token });
        }

        // If new user, create a user

        const user = await User.create({
          userNumber: phoneNumber,
        });
        //Create Default user profile
        // const profileData = await Profile.create({
        //   userNumber: phoneNumber,
        //   userID: user["_doc"]["_id"],
        //   //   fcmToken: fcmToken,
        // });
        const token = await createJwtToken(user["_doc"]["_id"], phoneNumber);
        // save user token
        user.token = token;

        return res.status(200).json({
          ...user["_doc"],
          token,
        //   profile: profileData,
          existingUser: false,
        });
      }
      return res.status(400).json({
        message: INVALID_OTP_ERR,
      });
    } catch (error) {
      console.log("errorInVerifyingOTP: ", error);
      return res.status(400).send(error);
    }
  }
};
