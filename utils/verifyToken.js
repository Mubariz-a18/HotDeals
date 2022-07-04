const jwt = require("jsonwebtoken");

exports.verifyJwtToken = async (req, res, next) => {
  try {

    // check for auth header from client
    const header = req.headers.authorization;

    if (!header) {
      return res.status(403).send({ error: "AUTH_HEADER_MISSING_ERR" });
    }

    // verify  auth token
    const token = header.split("Bearer ")[1];

    if (!token) {
      return res.status(403).send({ error: "unauthorized" });
    }

    const { user_ID, user_phoneNumber } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );


    // if (!userId) {
    //   return res.status(403).send({ error: "JWT_DECODE_ERR" });
    // }
    req.user_ID = user_ID;
    req.user_phoneNumber = user_phoneNumber;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token!");
  }
};
