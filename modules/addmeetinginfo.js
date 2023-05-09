const meetinginfo = require("../sql/meetinginfo");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const meetingroom = require("../sql/meetingroom");
const user = require("../sql/user");

module.exports = (req, res) => {
  // iPeople 数据格式要求：["user-xxx", "user-xxx"];
  let { token, iName, rId, iPeople, startTime, endTime } = req.body;
  if(typeof iPeople !== "object"){
    iPeople = iPeople ? JSON.parse(iPeople) : [];
  }
  startTime -= 0;
  endTime -= 0;

  // 验证 token
  jwt.verify(token, "有志者事竟成", (tokenErr, tokenData) => {
    if (tokenErr) {
      res.send({code: 0, msg: "登陆失效",});
    } else {
      // 验证权限是否为经理
      if (tokenData.power === 1) {
        // 根据当前时间与传入的会议时间对比，设置会议的状态信息
        let state = null;
        const now = Date.now();
        
        if (now > endTime) {
          // 传入的时间为过去的时间
          res.send({
            code: 1,
            msg: "请输入正确的会议时间",
          });
          return;
        } else if (now >= startTime && now <= endTime) {
          // 当前时间在传入的时间段内
          state = 1;
        } else {
          // 传入时间在当前时间的未来
          state = 0;
        }

        // 根据 uId 去 user 集合查找 tId（部门）
        user.find({ uId: tokenData.uId }, (err, data) => {
          let tId = data[0].tId;
          const iId = "i-" + uuid.v1();
          // 定义会议的具体信息
          const meetData = {
            tId, // 部门编号
            iId, // 会议信息编号
            state, // 会议状态
            uId: tokenData.uId, // 用户id
            iNumber: iPeople.length, // 参会人数
            iName, // 会议名称
            rId, // 会议室id
            iPeople, // 参会人员
            startTime, // 会议开始时间
            endTime, // 会议结束时间
          };

          // 向数据库插入数据
          meetinginfo.insertMany(meetData, err => {
            // 根据会议室 rId 去 meetingroom 集合更新信息
            meetingroom.updateOne({ rId }, { iId, uId: tokenData.uId, tId, iNumber: iPeople.length, startTime, endTime, state }, err => {
              res.send({ code: 2, msg: "设置会议成功！", data: meetData });
            });
          });
        });
      } else {
        res.send({ code: 3, msg: "权限不足，无法设置会议信息" });
      }
    }
  });
};
