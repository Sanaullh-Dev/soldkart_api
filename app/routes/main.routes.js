var router = require('express').Router();


// Routes : Category
router.use("/category", require("./category/category.routes.js"));

// Routes : Add Post
router.use("/adspost", require("./adspost/adspost.routes.js"));

// Routes : Add Post
router.use("/chats", require("./chats/chats.routes.js"));

// Routes : Add Post
router.use("/userLogin", require("./user-Login/user_login.routes.js"));

module.exports = router;