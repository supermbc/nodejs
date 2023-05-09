const meetinginfo = require("../sql/meetinginfo");
const user = require("../sql/user");
const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
  let { token, iId, tId, rId, state } = req.body;

  // 验证 token
  jwt.verify(token, "有志者事竟成", async (tokenErr, tokenData) => {
    if (tokenErr) return res.send({ code: 0, msg: "登陆失效" });

    if((tokenData.power === 0 || tokenData.power === 1) && !iId){
      const whereObj = {};
      // 根据rId（会议室）查多个
      if(rId){
        whereObj.rId = rId;
      }
      // 根据state（状态）查多个
      if(state){
        whereObj.state = state;
      }
      // 根据tId（部门）查多个
      if(tId){
        whereObj.tId = tId;
      }else if(tokenData.power === 1){
        // 经理：查部门
        const data = await user.find({uId: tokenData.uId});
        whereObj.tId = data[0].tId;
      }
      meetinginfo.find(whereObj, {_id:0, __v:0}).sort({startTime: -1}).then(data => {
        res.send({
          code:1,
          msg:"查询会议信息成功",
          data
        })
      });
    }else if(iId){
      // 根据iId（当前）查指定
      meetinginfo.find({ iId }, {_id:0, __v:0}).sort({startTime: -1}).then(data => {
        res.send({
          code:1,
          msg:"查询指定会议信息成功",
          data
        })
      });
    }else{
      // 根据uId（个人）查多个：tokenData.uId
      meetinginfo.find({}, {_id:0, __v:0}).sort({startTime: -1}).then(data=>{
        res.send({
          code: 2,
          msg: "查询个人参与会议成功",
          data: data.filter(val=>val.iPeople.includes(tokenData.uId))
        })
      })
    }
  });
};