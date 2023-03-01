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

  let letters = userName.split("").filter(char => char !== " ");

  // Get the first two letters of the username
  const firstTwoLetters = letters[0]+letters[1];

  // Generate a random four-character hexadecimal value

  let hexValue = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();

  // Concatenate the first two letters of the username and the hex value
  var code = firstTwoLetters.toUpperCase() + hexValue;

  return code;
}