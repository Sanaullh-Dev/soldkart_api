const sql = require("../../config/db.connection.js");


// Get Main Category
exports.getMain = (req, res) => {
  let query = "SELECT * FROM category where cat_subid=0 order by cat_id ASC";

  sql.query(query, (err, result) => {
    if (err) {
      console.log("Error :" ,err);
      return res.status(500).send({
        message: " Some error on find all Main Category data",
      });
    }
    // console.log("Main Categories : " , result);
    return res.status(200).send(result);
  });
};

// Get Sub-Main Category
exports.getSub = (req, res) => {

  if (!req.params.mainId){
    return res.status(400).send({
      message: " Content can't be Empty !",
    });
  }

  var mainId = req.params.mainId;
  
  let query = `SELECT * FROM category where cat_subid='${mainId}$'`;

  sql.query(query, (err, result) => {
    if (err) {
      // console.log("Error :" ,err);
      return res.status(500).send({
        message: " Some error on find all Sub Category data",
      });
    }
    return res.status(200).send(result);
  });
};




