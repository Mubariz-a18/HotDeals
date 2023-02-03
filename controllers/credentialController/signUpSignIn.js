const User = require("../../models/Profile/Profile");
const OTP = require("../../models/Otp");
const { generateOTP } = require("../../utils/otp.util");
const { createJwtToken } = require("../../utils/generateToken");

//signup and signin

exports.signUpSignIn = async function (req, res) {
  try {
    const phone_number = req.body.phone_number;
    const country_code = req.body.country_code;
    const otp = req.body.otp;
    const user = await User.findOne({
      phone_number: phone_number,
    });

    //if user is new user,then create new user and save in database
    if (!user) {
      const newUsr = await User({
        phone_number: phone_number,
      }).save();

      const otp = generateOTP(6);

      const ottp = await new OTP({
        phone_number: phone_number,
        country_code: country_code,
        otp: otp,
      }).save();

      res.status(200).send({
        message: "OTP sent successfully",
      });
    }
    // if user is old user
    if (user) {
      const ottpt = await OTP.findOne({
        phone_number: phone_number,
      });

      //if otp provided by user and database otp dosen't match
      if (otp && ottpt.otp != otp) {
        res.status(400).send({
          error: "wrong otp!!!",
        });
      } else {
        //if otp matched  then generate token and update otp
        if (ottpt.otp == otp) {
          const token = createJwtToken({
            userId: user._id,
            phone_number: phone_number,
          });

          await OTP.findOneAndUpdate(
            {
              phone_number: phone_number,
            },
            { otp: otp }
          );
          // mixpanel track for otp verify 
          await track('login success !1  ', {
            message: `user ${user._id} has login `
          });
          res.status(201).json({
            type: "success",
            message: "OTP verified successfully",
            data: {
              token,
              userId: user._id,
            },
          });
        }
        //if user is old user and trying to log in again
        else {
          const otp = generateOTP(6);
          await OTP.findOneAndUpdate(
            {
              phone_number: phone_number,
            },
            { otp: otp }
          );
          await track('login success !1  ', {
            message: `user ${user._id} has login `
          });
          res.status(200).send({
            message: "OTP sent successfully!!!!!",
          });
        }
      }
    }
  } catch (error) { }
};
