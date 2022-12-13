const jwt = require("jsonwebtoken");
const Report = require("../models/reportSchema");
const ObjectId = require('mongodb').ObjectId;

// Create Jsonwebtoken 

exports.createJwtToken = async(userID, phoneNumber) => {
  const report = await Report.findOne({user_id:ObjectId(userID)});
  const { flag } = report

  const token = jwt.sign(
    { user_phoneNumber: phoneNumber, user_ID: userID , flag:flag},
    process.env.JWT_SECRET_KEY,
    {}
  );
  return token;
};

