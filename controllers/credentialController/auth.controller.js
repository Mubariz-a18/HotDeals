const OtpService = require("../../services/OtpService");
const User = require("../../models/Profile/User");
const testPhoneNumbers = require("../../data/testNumbers");
const { createJwtToken } = require("../../utils/generateToken");
const { INVALID_OTP_ERR } = require("../../error");
const SMSController = require("./sms.controller");
const Profile = require("../../models/Profile/Profile");


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
      const verficationStatus = await OtpService.verifyOTPAndDeleteDocument(phoneNumber.text, otp);
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
  
          return res.status(200).json({
            message: "success",
            statusCode:200,
            token,          
            existingUser: true,
          });
        }

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
      return res.status(400).json({
        message: INVALID_OTP_ERR,
        statusCode:401
      });
    } catch (error) {
      console.log("errorInVerifyingOTP: ", error);
      return res.status(400).send(error);
    }
  }

  // static async apiGetEmailOtp(req,res,next){
  //   const {email} = req.body;
  //   try{
  //     const findUsr = await Profile.findOne({
  //       _id: (req.user_ID)
  //     })
  //     const otpDoc = await OtpService.generateEmailOtpAndCreateDocument(email)
  //     const message = `Your email verifivation OTP is  :- \n\n ${otpDoc.otp}`
  //     const email_To_User = await sendEmail({
  //       email:email,
  //       subject:"Email Verification",
  //       message
  //     })
  //     res.send("email sent sucess")
  //     console.log(message)
  //     console.log(email_To_User)
  //   }catch (e){
  //       res.send(e.message).status(401)
  //   }
  // }

};

