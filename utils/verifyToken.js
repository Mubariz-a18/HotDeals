const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;

// Verification Of Token 

exports.verifyJwtToken = async (req, res, next) => {

  // check for auth header from client
  const header = req.headers.authorization;
  if (!header) {
    return res.status(403).send("auth header is missing");
  }
  // verify  auth token
  const token = header.split("Bearer ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const { user_ID, user_phoneNumber } = jwt.verify(
      token,
      JWT_SECRET_KEY
    );
    req.user_ID = user_ID;
    req.user_phoneNumber = user_phoneNumber;
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

exports.verifyJwtTokenForAds = async (req, res, next) => {

  // check for auth header from client
  const header = req.headers.authorization;
  if (!header) {
    return next();
  }
  // verify  auth token
  const token = header.split("Bearer ")[1];

  if (!token) {
    return next();
  }
  try {
    const { user_ID, user_phoneNumber } = jwt.verify(
      token,
      JWT_SECRET_KEY
    );
    req.user_ID = user_ID;
    req.user_phoneNumber = user_phoneNumber;
  } catch (error) {
    return next();
  }
  return next();
};
