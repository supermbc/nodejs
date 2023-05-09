const team=require("../sql/team")
const jwt = require("jsonwebtoken");

module.exports=(req,res,next)=>{
    const {tId, token} = req.body;
    jwt.verify(token,"有志者事竟成",(tokenErr,tokenData)=>{
        if(tokenErr){
            res.send({
                code:0,
                msg:"登录失效"
            })
        }else if(tokenData.power === 0){
            team.find((err,data)=>{
                res.send({
                    code:1,
                    msg:"获取所有部门信息成功",
                    data
                })
            })
        }else if(tokenData.power!==0 && tId){
            team.find({tId},(err,data)=>{
                res.send({
                    code:3,
                    msg:"获取本部门信息成功",
                    data
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