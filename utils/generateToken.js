// require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.createJwtToken = (userID, phoneNumber) => {
  const token = jwt.sign(
    { user_phoneNumber: phoneNumber, user_ID: userID },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "12h" }
  );
  return token;
};
