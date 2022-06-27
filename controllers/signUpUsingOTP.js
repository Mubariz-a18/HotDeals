const User = require("../models/Users");
const axios = require("axios");
var request = require("request");
https = require("https");
var unirest = require("unirest");
// var req1 = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
var req1 = unirest(
  "GET",
  "http://2factor.in/API/V1/84039e54-f142-11ec-9c12-0200cd936042/BAL/SMS"
);

// const fast2sms = require("fast-two-sms");
const { generateOTP } = require("../../utils/generateOTP");
const { response } = require("express");
exports.signUpUsingOTP = async function (req, res) {
  try {

    
    console.log("reached here");
    console.log(req.body);
    let { phone, name } = req.body;
    const userExists = await User.findOne({ phone: phone });

    if (userExists) {
      res.status(400).json({
        type: "error",
        error: "Account Already Exists",
      });
    }

    const createUser = await new User({
      name: name,
      phone: phone,
    });

    console.log(createUser);

    const user = await createUser.save();

    console.log(user);
    res.status(200).json({
      type: "success",
      message: "Account created OTP sended to mobile number",
    });

    const otp = generateOTP(6);
    console.log(otp);

    user.OTP = otp;
    await user.save();

    console.log(user.phone);

    // send otp to phone number

    req1.headers({
      "content-type": "application/x-www-form-urlencoded",
    });

    req1.form({
      message: "This is a test message",
      language: "english",
      route: "q",
      numbers: "9462445893",
    });

    req1.end(function (res) {
      if (res.error) {
        console.log(res.error.message);
      }

      console.log(res.body);
    });
    // req1.headers({
    //   "authorization": "vhjOm5EzMsYDeZLbti3bil4MHnYfa05Zma8ziwxAxR4iS2YIYBwILwguHVFZ"
    // });

    // let num = "9391476398"

    // req1.form({
    //   "message": "This is a test message",
    //   "language": "english",
    //   "route": "q",
    //   "numbers": num,
    // });

    // req1.end(function (res) {
    //   if (res.error){
    //     console.log(res.error.message);
    //   }

    //   console.log(res.body);
    // });
  } catch (error) {}
};
