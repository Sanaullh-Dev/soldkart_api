const sql = require("../../config/db.connection.js");

// Get Data of chats room details
exports.chatRoomData = (req, res) => {
  var body = req.body;

  if (!body)
    res.status(400).send({
      message: "can't be Empty body data!",
    });

  if (!body.userId || !body.pId) {
    return res.status(400).send({
      message: "Missing userId or post Id",
    });
  }

  let query = `CALL chat_room_details('${body.userId}',${body.pId});`;

  // console.log(query);
  sql.query(query, (err, result) => {
    if (err) {
      // console.log("Error :" ,err);
      return res.status(500).send({
        message: "Some error on chat Room Data",
        error: err,
      });
    }
    return res.status(200).send(result[0]);
  });
};

// Get Last Seen user
exports.lastSeen = (req, res) => {
  if (!req.query.userId) {
    return res.status(400).send({
      message: "User can't be empty",
    });
  }

  var userId = req.query.userId;

  let query = `SELECT chat_date as lastSeen FROM chats_info WHERE user_from = ${userId} OR user_to = ${userId} ORDER BY chat_date DESC limit 1`;

  sql.query(query, (err, result) => {
    if (err) {
      // console.log("Error :" ,err);
      return res.status(500).send({
        message: " Some error on last Seen",
        error: err,
      });
    }
    // console.log("Booking_Data : " , result);
    return res.status(200).send(result);
  });
};

// Message Send save message
exports.messageSend = (req, res) => {
  if (!req.body)
    res.status(400).send({
      message: " Content can't be Empty !",
    });

  const messageData = [
    new Date(req.body.chatDate),
    req.body.message,
    req.body.FromUser,
    req.body.ToUser,
    "send",
  ];

  const column = "chat_date, message, user_from, user_to, chat_status";

  let sqlQuery = `INSERT INTO chats_info(${column}) VALUES(?,?,?,?,?)`;

  sql.query(sqlQuery, messageData, (err, result) => {
    if (err) {
      // console.log("error : ", err);
      return res.status(500).send({
        message: "Some error occurred while creating the Message",
        error: err,
      });
    } else {
      // console.log(result.insertId);
      return res.send({ id: result.insertId, result: result });
    }
  });
};
