const meetinginfo = require("../sql/meetinginfo");
const meetingroom = require("../sql/meetingroom");
const jwt = require("jsonwebtoken");

// 需要的数据：
//   token  iId  要修改的数据

// 可以修改的内容：
//   iName  rId  iPeople  startTime  endTime

// 只有会议创建人可以修改会议信息
// 已结束和正在进行的会议不可修改

module.exports = (req, res) => {
  // iPeople 数据格式要求：["user-xxx", "user-xxx"];

  let { token, iId, iName, rId, iPeople, startTime, endTime } = req.body;

  if(typeof iPeople !== "object"){
    iPeople = iPeople ? JSON.parse(iPeople) : [];
  }

  startTime -= 0;
  endTime -= 0;

  // 验证 token
  jwt.verify(token, "有志者事竟成", (tokenErr, tokenData) => {
    if (tokenErr) {
      // token 验证失败
      res.send({ code: 0, msg: "登陆失效" });
    } else {
      // token 验证通过
      // 验证权限是否为经理
      if (tokenData.power !== 1) return res.send({ code: 2, msg: "权限不足，无法修改会议信息" });

      meetinginfo.find({ iId }, (err, data) => {
        // 验证是否为本人
        if (data[0].uId !== tokenData.uId) return res.send({ code: 3, msg: "仅能修改本人创建的会议" });
        // 验证会议状态
        if (data[0].state !== "0") return res.send({ caode: 4, msg: "会议正在进行或已结束，无法修改相关信息" });

        const infoNewData = {};
        const roomNewData = {};

        if(iName) infoNewData.iName = iName;
        if(rId) infoNewData.rId = rId;
        if(iPeople) {
          infoNewData.iPeople = iPeople;
          infoNewData.iNumber = iPeople.length;
          roomNewData.iNumber = iPeople.length;
        }
        if(startTime) {
          infoNewData.startTime = startTime;
          roomNewData.startTime = startTime;
        }
        if(endTime) {
          infoNewData.endTime = endTime;
          roomNewData.endTime = endTime;
        }

        // 根据当前时间与传入的会议时间对比，设置会议的状态信息
        let state = null;
        const now = Date.now();
        if (now > infoNewData.endTime) {
          // 传入的时间为过去的时间
          res.send({ code: 5, msg: "请输入正确的会议时间" });
        } else if (now >= infoNewData.startTime && now <= infoNewData.endTime) {
          // 当前时间在传入的时间段内
          state = 1;
        } else {
          // 传入时间在当前时间的未来
          state = 0;
        }

        infoNewData.state = state;
        roomNewData.state = 0;

        // 修改会议信息
        meetinginfo.updateOne({ iId }, infoNewData, err => {
          meetingroom.updateOne({ rId }, roomNewData, err => {
            res.send({ code: 1, msg: "会议信息修改成功" });
          });
        });
      });
    }
  });
};