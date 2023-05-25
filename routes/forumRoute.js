const express = require('express');
const { create , getAllForums, getSingleForum, getMyForum, deleteForumByUser, updateForum, deleteForumByAdmin } = require('../controllers/forumController');
const {requiredUserLogin, requiredAdmin} = require('../controllers/userController');

const router = express.Router();

router.get("/forums" , getAllForums);
router.post("/create" ,requiredUserLogin, create);
router.get("/forum/:uuid" , getSingleForum);
router.post("/myforum",requiredUserLogin, getMyForum);
router.post("/deletebyuser",requiredUserLogin,deleteForumByUser);
router.put("/edit/:uuid",requiredUserLogin, updateForum);
router.post("/deletebyadmin",requiredAdmin,deleteForumByAdmin);

module.exports = router;