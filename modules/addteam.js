const jwt = require("jsonwebtoken");
const uuid=require("uuid");
const team = require("../sql/team");

module.exports = (req, res, next)=>{
    const {tLeader, tName, token} = req.body;

    jwt.verify(token, "有志者事竟成", (tokenErr, tokenData)=>{
        if(tokenErr){
            res.send(JSON.stringify({
                code:0,
                msg:"登录失效"
            }))
        }else if(tokenData.power === 0){
            team.find({tName}, (err, data)=>{
                if(data.length < 1){
                    const teamMsg = {
                        tId:"team-"+uuid.v1(),
                        tName,
                        tLeader,
                    };
                    team.insertMany(teamMsg, (err)=>{
                        res.send({
                            code:2,
                            msg:"部门信息添加成功"
                        });
                    })
                }else{
                    res.send({
                        code:3,
                        msg:"该部门已存在"
                    });
                }
            })
        }else{
            res.send(JSON.stringify({
                code:1,
                msg:"权限不够，请联系管理员"
            }))
        }
    })
}
