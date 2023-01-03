const mysql = require("mysql2");
const dbConfig = require("./db.config.js");

// Create a connection to the database
const conn = mysql.createConnection({
    host : dbConfig.HOST,
    user : dbConfig.USER,
    password : dbConfig.PASSWORD,
    database : dbConfig.DB,
    port : dbConfig.PORT,
});

conn.connect(error => {
    if(error) throw error;
    console.log("Successfully connected to the database");
});

module.exports = conn;
