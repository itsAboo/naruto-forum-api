const Forums = require("../models/forumModel");
const { v4: uuidv4 } = require("uuid");

//create forum
const create = async (req, res) => {
  let { title, content, author } = req.body;
  const uuid = uuidv4();
  let error = "";
  switch (true) {
    case !title:
      error = "กรุณาป้อนชื่อบทความ";
      break;
    case !content:
      error = "กรุณาใส่รายละเอียดบทความ";
      break;
    case !author:
      author = "Admin";
      break;
  }
  try {
    const forum = await Forums.create({ title, content, author, uuid });
    res.json(forum);
  } catch (ex) {
    res.status(404).json({ error });
  }
};
const getAllForums = async (req, res) => {
  await Forums.find({}).sort({_id : -1})
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(404).json({ error: err });
    });
};
const getSingleForum = async (req, res) => {
  const { uuid } = req.params;
  await Forums.findOne({ uuid })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(404).json({ error: err });
    });
};

const getMyForum = async (req, res) => {
  const { author } = req.body;
  try {
    const forumDoc = await Forums.find({ author });
    if (forumDoc.length > 0) {
      res.json(forumDoc);
    } else {
      res.json(null);
    }
  } catch (err) {
    res.status(404).json({ msg: "เกิดข้อผิดพลาด" });
  }
};
const deleteForumByUser = async (req, res) => {
  const { username, forumId } = req.body;
  // if(!author || !forumId) {
  //     res.json({msg:"เกิดข้อผิดพลาด"});
  //     return
  // }
  try {
    const forumDoc = await Forums.findById(forumId);
    if (username === forumDoc.author) {
      const response = await Forums.findByIdAndDelete(forumId);
      res.status(200).json({ msg: "ลบบทความสำเร็จ" });
    } else {
      res.status(404).json({ msg: "ไม่มีบทความนี้อยู่" });
    }
  } catch (err) {
    res.status(404).json({ msg: "ไม่พบรายการ" });
  }
};
const updateForum = async (req, res) => {
  const { uuid } = req.params;
  const { title, content } = req.body;
  try {
    const response = await Forums.findOneAndUpdate(
      { uuid },
      { title, content },
      { new: true }
    );
    res.json({msg:"แก้ไขข้อมูลเรียบร้อย"});
  } catch (err) {
    if(err){
        res.status(404).json({msg : "ไม่สามารถแก้ไขบทความได้"});
    }
  }
};
const deleteForumByAdmin = async(req,res)=>{
  const {forumId} = req.body;
  try{
    const response = await Forums.findByIdAndDelete(forumId);
    res.status(200).json({msg:"ลบบทความสำเร็จ"})
  }catch(err){
    res.status(404).json({ msg: "ไม่พบรายการ" });
  }
}
module.exports = {
  create,
  getAllForums,
  getSingleForum,
  getMyForum,
  deleteForumByUser,
  updateForum,
  deleteForumByAdmin
};
