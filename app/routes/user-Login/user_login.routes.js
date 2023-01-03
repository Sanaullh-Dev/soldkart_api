var router = require("express").Router();
const { body, validationResult, check } = require("express-validator");
const upload = require("../../services/userPhoto_upload.js");

const {
  signUpValidation,
  loginValidation,
} = require("../../authentication/Validation.js");

const userController = require("./user_login.controller.js");

// For check User Registration
router.post("/checkUser", userController.checkUser);

// For User signUp/ registration
router.post("/singUp", signUpValidation, userController.signUp);

// For User Login
router.post("/logIn", loginValidation, userController.logIn);

// For Update User data
router.post(
  "/updateUserProfile",
  upload.array("profile_photo", 1),
  userController.updateUserProfile
);

// For Get Otp
router.post("/otpLogin", userController.getOtp);

// for verification of OTP code
router.post("/verifyOtp", userController.verifyOtp);

// for Send SMS  ******** this test current not available
// router.post("/sendSMS", userController.sendSMS);

module.exports = router;
