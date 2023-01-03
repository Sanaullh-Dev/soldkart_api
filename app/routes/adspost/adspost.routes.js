var router = require("express").Router();
const addpostCont = require("./adspost.controller.js");
const upload = require("../../services/post_upload.js");
const {userActionValidation} = require("../../authentication/Validation.js");
  

// Get top 20 recent ads 
router.post("/", addpostCont.recentAds);

// Related Ads
router.post("/relatedAds/mainId", addpostCont.relatedAds);

// Get All favorite List of Ads
router.post("/favoriteList", addpostCont.getFavoriteList);

// Get All My Sales Ads List
router.post("/mySalesAds", addpostCont.getMySalesAds);

// Delete My Sales Ads
router.delete("/deleteMySalesAds", addpostCont.deleteMySalesAds);

// Get top 20 recent ads 
router.get("/filter", addpostCont.filterAds);

// Get Search keyword list result 
router.get("/search-:keyword", addpostCont.keywordSearch);

// Get Ads list keyword wise 
router.get("/keywordSearch-:keyword", addpostCont.keywordWiseList);


// For data insert data into models-profile
router.post("/saveAds", upload.array("ads_image", 5), addpostCont.postCreate);

// add user favorites and view Ads
router.post("/userAction",userActionValidation, addpostCont.userAction);

// Update favorites into post reaction 
router.post("/favoritesUpdate",userActionValidation, addpostCont.favoritesUpdate);

// get One post details with user post reaction
router.post("/getPostDetails",userActionValidation, addpostCont.getPostDetails);

// Get top 20 recent ads 
router.post("/userProfileAds", addpostCont.userProfileAds);

module.exports = router;