const mongoose = require('mongoose');

const forumModel = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 35
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: "Admin",
    },
    uuid: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model("Forums", forumModel);