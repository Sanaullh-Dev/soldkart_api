var router = require("express").Router();
const categoryCont = require("./category.controller.js");


// get All Main Category
router.get("/main", categoryCont.getMain);

// get All Main Category
router.get("/sub-:mainId", categoryCont.getSub);

module.exports = router;