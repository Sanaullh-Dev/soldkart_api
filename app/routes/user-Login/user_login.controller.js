const sql = require("../../config/db.connection.js");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const userServices = require("../../services/user.services.js");

exports.getOtp = (req, res, next) => {
  console.log(req.body);
  var body = req.body;
  userServices.createOtp(body, (error, hashCode, otp) => {
    if (error) {
      return next(error);
    } else {
      console.log("OTP : ", otp);
      console.log("hashCode : ", hashCode);
      // for testing purpose without otp send
      return res.status(200).send({
        message: "Success Sent OTP",
        hash: hashCode,
      });
    }
  });
};

exports.verifyOtp = (req, res, next) => {
  userServices.verifyOtp(req.body, (error, result) => {
    if (error) {
      // console.log("Invalid OTP");
      return res.status(403).send({ error: "Invalid OTP" });
    } else {
      // console.log("Success OTP");
      return res.status(200).send({
        message: "Success",
        data: result,
      });
    }
  });
};

// check user registration
exports.checkUser = (req, res, next) => {
  const body = req.body;
  console.log(body);
  if (!body.uid)
    res.status(400).send({
      message: "User Id is not given for check!",
    });

  const loginId = body.uid;
  console.log(loginId);
  sql.query(
    `select * from users where log_id='${loginId}';`,
    async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(409).send({
          message: `Some error occurred check User while sql query :`,
          error: err,
        });
      }
      if (result.length !== 0) {
        return res.status(200).send(result[0]);
      } else {
        return res.status(404).send({
          message: `This ${loginId} Not found`,
        });
      }
    }
  );
};

// for User Register
exports.signUp = (req, res, next) => {
  console.log("sing up", req.body);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log("sing up error", error);
    return res.status(503).send(error);
  }
  const body = req.body;

  if (body.login_with === "phone" && body.u_phone === "") {
    console.log("If you have Login with Phone than can't be empty");
    return res.status(503).send({
      error: "If you have Login with Phone than can't be empty",
    });
  }
  if (body.login_with === "email" && body.u_email === "") {
    console.log("If you have Login with Email than can't be empty");
    return res.status(503).send({
      error: "If you have Login with Email than can't be empty",
    });
  }

  const loginId = body.login_with === "phone" ? body.u_phone : body.u_email;

  console.log(loginId);
  sql.query(
    `select * from users where u_phone = '${loginId}' or u_email='${loginId}';`,
    async (err, result) => {
      if (err) {
        return res.status(409).send({
          message: `Some error occurred signUp while sql query :`,
          error: err,
        });
      }
      if (result.length !== 0) {
        return res.status(409).send({
          message: `This ${body.login_with} already register`,
        });
      } else {
        // const salt = await bcrypt.genSalt(10);
        console.log("result", result);
        bcrypt.hash(body.log_pass, 10, (err, hashResult) => {
          if (err) {
            return res.status(500).send({
              error: "Hash Err :" + err,
            });
          } else {
            // console.log("hashCod");
            console.log("hashCode : ", hashResult);
            const userData = [
              loginId,
              hashResult,
              body.u_name,
              body.u_about || null,
              body.u_country || null,
              body.u_phone || null,
              body.u_email || null,
              body.u_photo || null,
              body.login_with,
            ];
            const column =
              "`log_id`,`log_pass`,`u_name`,`u_about`,\
            `u_country`,`u_phone`,`u_email`,`u_photo`,`login_with`";

            let sqlQuery = `INSERT INTO users(${column}) VALUES(?,?,?,?,?,?,?,?,?)`;

            sql.query(sqlQuery, userData, (err, result) => {
              if (err) {
                console.log("error : ", err);
                return res.status(500).send({
                  message:
                    "Some error occurred while creating the SignUp :" ||
                    err.message,
                });
              } else {
                // console.log(result.insertId);
                return res
                  .status(200)
                  .send({ id: result.insertId, date: result });
              }
            });
          }
        });
      }
    }
  );
};

exports.logIn = (req, res, next) => {
  // console.log(req.body);
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return res.status(503).send(error);
  }

  const body = req.body;

  let sqlQuery = `select log_pass,login_with from users where log_id='${body.loginId}'`;

  sql.query(sqlQuery, (err, result) => {
    if (err) {
      console.log("error : ", err);
      return res.status(500).send({
        message: "Some error occurred while Login :" || err.message,
      });
    }

    if (result.length == 0) {
      return res.status(404).send({
        message: "Login Id is not registered" || err.message,
      });
    } else {
      // if user is login with google is already authorized( don't check password)
      if (result[0]["login_with"] == "google") {
        return res.status(200).send({ message: "Login Successfully" });
      }

      bcrypt.compare(body.password, result[0]["log_pass"], (err, result) => {
        if (err) {
          console.log("has ero: ", err);
          return res.status(503).send({ "hash compare error": err });
        } else if (result === true) {
          return res.status(200).send({ message: "Login Successfully" });
        } else {
          return res.status(422).send({ message: "Invalid password" });
        }
      });
    }
  });
};

// for User Register
exports.updateUserProfile = (req, res, next) => {
  const body = req.body;

  const loginId = body.login_with === "phone" ? body.u_phone : body.u_email;

  
  const userData = [
    body.u_name,
    body.u_about || null,
    body.u_phone || null,
    body.u_email || null,
    body.u_photo == "" || body.u_photo == null
      ? Object.keys(req.files).length == 1
        ? req.files[0].path
        : null
      : body.u_photo || null,
    body.log_id,
  ];

  let sqlQuery =
    "UPDATE users SET `u_name`=?, `u_about`=?, \
      `u_phone`=?, `u_email`=?,`u_photo`=? WHERE `log_id`=?";

  sql.query(sqlQuery, userData, (err, result) => {
    if (err) {
      console.log("error : ", err);
      return res.status(500).send({
        message:
          "Some error occurred while creating the SignUp :" || err.message,
      });
    } else {
      return res.status(200).send({ id: result.insertId, date: result });
    }
  });
};
