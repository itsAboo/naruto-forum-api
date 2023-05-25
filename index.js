const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();
const forumRoute = require('./routes/forumRoute')
const userRoute = require("./routes/userRoute");
const cookieParser = require('cookie-parser');

const app = express();

//connect database
mongoose.connect(process.env.DB_URI,{
    useNewUrlParser : true,
    useUnifiedTopology : false
}).then(() => {
    console.log("Connect Database Success");
}).catch(err => {
    console.log(err);
})

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(morgan('dev'));

//API
app.use("/api", forumRoute);
app.use("/api", userRoute)

//start server
app.listen(process.env.PORT, (err) => {
    console.log(`Start server at port ${process.env.PORT}`);
    if(err){
        console.log(err);
    }
})
