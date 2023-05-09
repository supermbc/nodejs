const mongoose = require("./db");

const meetingInfoSchema = new mongoose.Schema({
    iId: {type:String},
    iName: {type:String},
    rId: {type:String},
    uId: {type:String},
    tId: {type:String},
    iNumber: {type:Number},
    iPeople: {type:Array},
    startTime: {type:Number},
    endTime: {type:Number},
    state: {type:String}        // 0未开始，1进行中，2已结束
})

module.exports = mongoose.model("meetinginfo", meetingInfoSchema);