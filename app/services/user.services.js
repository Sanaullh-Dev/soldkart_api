const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "otp-secret-key";

// for SMS
async function createOtp(params, callback) {
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

  return callback(null, fulHash, otp);
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

function sendSMS(params, OTP, callback) {
  console.log("send SMS function", params);
  var mobile = params.phone;
  var app_signature = params.app_signature;
  var msg = {
    Message: `Dear Customer, Use code ${OTP} to login to your BIS account. Never share your OTP with anyone. ${app_signature}`,
    PhoneNumber: "+" + mobile,       
  };
}

module.exports = {
  createOtp,
  verifyOtp,
  sendSMS,
};
