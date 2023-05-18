const SendOTP = require("../controllers/OTPController");
const Router = require("express").Router();

Router.route("/").get((req, res) => {
  res.send("SMS Service Test API");
});

Router.route("/send-custom-otp").post(SendOTP.customOTP);
Router.route("/send-autogen-otp").post(SendOTP.autogenOTP);
Router.route("/verify-otp").post(SendOTP.verifyOTP);

module.exports = Router;
