const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "otp-secret-key";
const unirest = require("unirest");

// for SMS
async function createOtp(params, callback) {
  console.log("create OTP params", params);
  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const expires = Date.now() + 5 * 60 * 1000;
  const data = `${params.phone}.${otp}.${expires}`;
  const hash = crypto.createHash("sha256", key).update(data).digest("hex");
  const fulHash = `${hash}.${expires}`;

  console.log(`Your OTP is ${otp} and phone ${params.phone}`);

  sendOTP(params, otp, (err, res) => {
    if (err) {
      return callback(error, null, null);
    } else {
      // console.log("Success OTP");
      return callback(null, res, fulHash);
    }
  });
}

async function verifyOtp(params, callback) {
  // console.log(params);
  let [hashValue, expires] = params.hash.split(".");

  let now = Date.now();
  if (now > parseInt(expires)) return callback("OTP Expired");

  let data = `${params.phone}.${params.otp}.${expires}`;
  let newCalculateHash = crypto
    .createHash("sha256", key)
    .update(data)
    .digest("hex");

  if (newCalculateHash == hashValue) {
    return callback(null, "Success");
  }

  return callback("Invalid OTP");
}

function sendOTP(params, OTP, callback) {
  var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
  req.headers({
    authorization: "YOUR_API_KEY",
  });

  req.form({
    message: `<#> Dear Customer, Use Code ${OTP} to login to your Soldkart account. Never share OTP to any one. ${params.app_signature}`,
    language: "english",
    route: "q",
    numbers: `${params.phone}`,
  });

  req.end(function (res) {
    if (res.error) {
      return callback(err, null);
    }else {
      console.log(res.body);
      return callback(null, "Success");
    } 
  });
}

// function sendSMS(params, OTP, callback) {
//   console.log("send SMS function", params);
//   var mobile = params.phone;
//   var app_signature = params.app_signature;
//   var msg = {
//     Message: `Dear Customer, Use code ${OTP} to login to your BIS account. Never share your OTP with anyone. ${app_signature}`,
//     PhoneNumber: "+" + mobile,
//   };
// }

module.exports = {
  createOtp,
  verifyOtp,
  // sendSMS,
};
