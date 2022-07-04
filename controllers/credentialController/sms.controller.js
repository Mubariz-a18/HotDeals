const { default: axios } = require("axios");
const {
  EXOTEL_API_KEY,
  EXOTEL_API_TOKEN,
  EXOTEL_ACCOUNT_SID,
} = process.env;

const otpHash = "mkfUSi/iBOi";
const formUrlEncoded = (x) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");

module.exports = class SMSController {
  /**
   * Method To Send SMS with EXOTEL
   *
   * @param {string} otp - OTP code to be sent.
   * @param {string} phoneNumber - PhoneNumber to sent the OTP Code.
   */
  static async sendSMSWithExotel(otp, phoneNumber) {
    const url =
      "https://" +
      EXOTEL_API_KEY +
      ":" +
      EXOTEL_API_TOKEN +
      "@api.exotel.in/v1/Accounts/" +
      EXOTEL_ACCOUNT_SID +
      "/Sms/send.json";
    try {
      const exoResponse = await axios.post(
        url,
        formUrlEncoded({
          From: "EXOSMS",
          To: phoneNumber,
          Body: `OTP for Cyberlink is  ${otp} ${otpHash}`,
          Priority: "HIGH",
        }),
        {
          withCredentials: true,
          headers: {
            Accept: "application/x-www-form-urlencoded",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return {
        status: "success",
        data: exoResponse.data,
      };
    } catch (error) {
      console.log("EXOTEL OTP Send Error", error.message);
      return {
        status: "failed",
        data: JSON.stringify(error),
      };
    }
  }

  static async sendSMS(otp, phoneNumber) {
    return await this.sendSMSWithExotel(otp, phoneNumber);

    // if (phoneNumber.startsWith("+91")) {
    //   return await this.sendSMSWithExotel(otp, phoneNumber);
    // } else {
    //   return await this.sendSMSWithTwilio(otp, phoneNumber);
    // }
  }
};
