const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : [true,"กรุณากรอกชื่อผู้ใช้งาน"]
    },
    password : {
        type : String,
        required : [true , "กรุณากรอกพาสเวิร์ด"]
    },
    role : {
        type : String,
        default : "member"
    }
}, {timestamps : true});

module.exports = mongoose.model("User" , userModel);