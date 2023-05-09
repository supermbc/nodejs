const mongoose = require("./db");

const meetingRoomSchema = new mongoose.Schema({
    rId: {type:String},    // 会议室编号
    number: {type:Number}, // 会议室容量
    config: {type:Array},  // 会议室配置
    uId: {type:String},    // 会议室申请人
    tId: {type:String},    // 会议室申请部门
    iNumber: {type:Number},// 会议人数
    iId: {type:String},    // 会议编号
    startTime: {type:Number},    // 会议开始时间
    endTime: {type:Number},      // 会议结束时间
    state: {type:String}   // 状态：0申请中，1使用中，2空闲
})

module.exports = mongoose.model("meetingroom", meetingRoomSchema);
