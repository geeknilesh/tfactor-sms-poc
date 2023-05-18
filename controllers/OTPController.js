const axios = require("axios");
class SendOTP {
  static async customOTP(req, res) {
    const { phone } = req.body;
    const COUNTRY_CODE = "+91";
    const otp = Math.floor(100000 + Math.random() * 900000);
    const ttl = 2 * 60 * 1000;
    const expires = Date.now() + ttl;
    // Add phone number to Redis/DB with expiry

    const OTP_TEMPLATE = "otpVerify";
    try {
      const response = await axios({
        method: "get",
        url: `https://2factor.in/API/V1/${process.env.TFACTOR_API_KEY}/SMS/${COUNTRY_CODE}${phone}/${otp}/${OTP_TEMPLATE}`,
      });
      const status = response.data.Status;
      const sessionId = response.data.Details;

      res.status(200).json({
        message: "OTP sent successfully",
        status: "Success",
        sessionId: sessionId,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Error in sending OTP" });
    }
  }

  static async autogenOTP(req, res) {
    const { phone } = req.body;
    const ttl = 2 * 60 * 1000;
    const expires = Date.now() + ttl;
    const COUNTRY_CODE = "+91";

    const OTP_TEMPLATE = "otpVerify";
    const smsURL = `https://2factor.in/API/V1/${process.env.TFACTOR_API_KEY}/SMS/${COUNTRY_CODE}${phone}/AUTOGEN3/${OTP_TEMPLATE}`;
    try {
      const response = await axios({
        method: "get",
        url: smsURL,
      });
      const status = response.data.Status;
      const sessionId = response.data.Details;

      if (status === "Success") {
        res.status(200).json({
          message: "OTP sent successfully",
          status: "Success",
          sessionId: sessionId,
        });
      } else {
        res.status(500).send({ message: "Error in sending OTP" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async verifyOTP(req, res) {
    const { phone, otp, method, sessionid } = req.body;
    const COUNTRY_CODE = "+91";
    let VERIFY_OTP_URL = "";
    if (method === "sessionid" && sessionid !== undefined) {
      VERIFY_OTP_URL = `https://2factor.in/API/V1/${process.env.TFACTOR_API_KEY}/SMS/VERIFY/${sessionid}/${otp}`;
    } else if (method === "phone" && phone !== undefined) {
      VERIFY_OTP_URL = `https://2factor.in/API/V1/${process.env.TFACTOR_API_KEY}/SMS/VERIFY3/${COUNTRY_CODE}${phone}/${otp}`;
    } else {
      return res
        .status(500)
        .send({ message: "Please pass correct parameters" });
    }

    try {
      const response = await SendOTP.httpRequest(VERIFY_OTP_URL);
      const status = response.Status;
      const details = response.Details;
      console.log(response);
      if (status === "Success") {
        res.status(200).json({
          message: "OTP verified successfully",
          status: status,
          details: details,
        });
      } else {
        console.log(response);
        return res.status(500).send({ message: "Error in verifying OTP" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ message: "Error in verifying OTP", error: err });
    }
  }

  static async httpRequest(url) {
    const response = await axios({ method: "get", url: url });
    return response.data;
  }
}
module.exports = SendOTP;
