const mongoose = require("./db");

const userSchema = new mongoose.Schema({
    uId: {type:String},
    tId: {type:String},
    uName: {type:String},
    username: {type:String},
    password: {type:String},
    power: {type:Number},       // 0超级，1经理，2员工
    tel: {type:String},
    avatar: {type:String},
    joinTime: {type:Number}
})

module.exports = mongoose.model("users", userSchema);