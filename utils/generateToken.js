const jwt = require("jsonwebtoken");

// Create Jsonwebtoken 

exports.createJwtToken = async(userID, phoneNumber) => {
  const token = jwt.sign(
    { user_phoneNumber: phoneNumber, user_ID: userID },
    process.env.JWT_SECRET_KEY,
    {}
  );
  return token;
};

