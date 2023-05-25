const User = require("../models/userModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//สมัครสมาชิก
const register = async (req, res) => {
    const { username, password } = req.body;
    //เช็ค username เป็นภาษาอังกฤษ
    const usernamePattern = /^(?=.*[a-zA-Z])[a-zA-Z\d]+$/;
    if (!username.match(usernamePattern)) {
        res.status(400).json({ msg: "กรุณากรอกชื่อผู้ใช้เป็นภาษาอังกฤษหรือตัวเลข และจะต้องมีตัวอักษรภาษาอังกฤษอย่างน้อย 1 ตัว (a-z)" });
        return;
    }
    //เช็ค username < 8 ตัว
    const lessUsernameCha = username.length < 8;
    if (lessUsernameCha) {
        res.status(400).json({ msg: "ชื่อผู้ใช้น้อยกว่า 8 ตัวอักษร" });
        return;
    }
    //เช็ค username ซ้ำ
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
        res.status(400).json({ msg: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
        return;
    }
    //เช็ค password เป็นภาษาอังกฤษ
    const passwordPattern = /^[a-zA-Z0-9]+$/;
    if (!password.match(passwordPattern)) {
        res.status(400).json({ msg: "กรุณาใส่รหัสผ่านเป็นภาษาอังกฤษ" });
        return;
    }
    //เช็ค password < 8 ตัว
    const lessPasswordCha = password.length < 8;
    if (lessPasswordCha) {
        res.status(400).json({ msg: "รหัสผ่านน้อยกว่า 8 ตัวอักษร" })
        return;
    }
    //hash password
    const bcryptSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, bcryptSalt);
    //to DB
    await User.create({ username, password: hashPassword }).catch(err => {
        res.status(400).json({ error: "เกิดข้อผิดพลาด" })
    });
    res.status(200).json({ msg: "สมัครสมาชิกสำเร็จ" });
}

//Login
const login = async (req, res) => {
    const { username, password } = req.body;
    //ตรวจสอบ username
    if (!username || !password) {
        res.status(400).json({ msg: "กรุณากรอกชื่อผู้ใช้หรือรหัสผ่าน" });
        return;
    }
    const user = await User.findOne({ username: username });
    if (!user) {
        res.status(400).json({ msg: "ชื่อผู้ใช้ หรือ รหัสผ่าน ผิด" });
        return;
    }
    //ตรวจสอบ password
    const pwIsMatch = await bcrypt.compare(password, user.password);
    if (pwIsMatch) {
        const maxAge = 2 * 60 * 60;
        const token = jwt.sign({
            username: user.username,
            role: user.role,
            id: user._id
        }, process.env.JWT_SECRET, { expiresIn: maxAge * 1000 });
        res
          .cookie("token", token, { maxAge: maxAge * 1000, secure: true,httpOnly : true })
          .json({ username: user.username, role: user.role });
    } else {
        res.status(400).json({ msg: "ชื่อผู้ใช้ หรือ รหัสผ่าน ผิด" });
    }
}
const authUser = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if (err) throw err;
            const { username, role } = await User.findById(userData.id)
            res.json({ username, role })
        })
    } else {
        res.json(null)
    }
}

const logout = (req,res)=>{
    res.cookie('token','',{maxAge:0}).json({msg:"ออกจากระบบสำเร็จ"});
}

const requiredUserLogin = (req,res,next)=>{
    const {token} = req.cookies;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) throw err;
        next();
      });
    } else {
      res.status(404).json({error:"เกิดข้อผิดพลาด",notCookie : true});
    }
}

const requiredAdmin = (req,res,next)=>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET , {}, (err,userData)=>{
            if(err) throw err;
            if(userData.role === "admin"){
                next();
            }else{
                res.status(400).json({msg:"คุณไม่มีสิทธิ์เข้าถึง",error : true});
            }
        })
    }else{
        res.status(404).json({error:"เกิดข้อผิดพลาด",notCookie:true});
    }
}
module.exports = { register, login, authUser , logout , requiredUserLogin ,requiredAdmin }