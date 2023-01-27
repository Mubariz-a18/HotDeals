//Generating and OTP 

exports.generateOTP = (otp_length) => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

exports.referral_code_generator = (userName) => {
  // Get the first two letters of the username
  const firstTwoLetters = userName.slice(0, 2);

  // Generate a random four-character hexadecimal value
  var hexValue = Math.floor(Math.random() * 0x1000000).toString(16);
  while (hexValue.length < 4) {
    hexValue = "0" + hexValue;
  }

  // Concatenate the first two letters of the username and the hex value
  var code = firstTwoLetters + hexValue;

  return code;
}