//张瑜，此接口是修改会议室设备的接口
const roomdata = require("../sql/meetingroom")
const jwt = require("jsonwebtoken")
//只有权限为0的人可以修改设备
module.exports = (req,res)=>{
    let {rId,config,token} = req.body;
    if(typeof config !== "object"){
        config = config ? JSON.parse(config) : [];
    }
    jwt.verify(token,"有志者事竟成",(tokenErr,tokenData)=>{
        if(tokenErr){
            res.send({
                code:0,
                msg:"登录失效"
            })
        }else if(tokenData.power === 0){
            roomdata.updateOne({
                rId
            },{
                config
            },err=>{
                res.send({
                    code: 1,
                    msg: "修改成功"
                })
            })
        }else{
            res.send({
                code:2,
                msg:"权限不够"
            })
        }
    })
}