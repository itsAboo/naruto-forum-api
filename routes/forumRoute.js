const express = require('express');
const { create , getAllForums, getSingleForum, getMyForum, deleteForumByUser, updateForum, deleteForumByAdmin } = require('../controllers/forumController');
const {requiredUserLogin, requiredAdmin} = require('../controllers/userController');

const router = express.Router();

router.get("/forums" , getAllForums);
router.post("/create" , create);
router.get("/forum/:uuid" , getSingleForum);
router.post("/myforum", getMyForum);
router.post("/deletebyuser",deleteForumByUser);
router.put("/edit/:uuid", updateForum);
router.post("/deletebyadmin",deleteForumByAdmin);

module.exports = router;