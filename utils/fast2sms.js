const fast2sms = require('fast-two-sms')
const FAST2SMS = require('../config')
console.log(FAST2SMS.config)

exports.fast2sms = async ({ message, contactNumber }, next) => {
    try {
      console.log("inside fas2sms")
      const res = await fast2sms.sendMessage({
        authorization: FAST2SMS,
        message,
        numbers: [contactNumber],
      });
      console.log(res);
    } catch (error) {
      next(error);
    }
  };