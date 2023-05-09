const team=require("../sql/team");
const jwt=require("jsonwebtoken");

module.exports=(req,res)=>{
    const {token,tId,tName,tLeader}=req.body;
    jwt.verify(token,"有志者事竟成", (tokenErr, tokenData)=>{
        if(tokenErr){
            res.send({
                code:0,
                msg:"登录失效"
            })
        }else if(tokenData.power===0){
            
            const newData = {};
            if(tName) newData.tName = tName;
            if(tLeader) newData.tLeader = tLeader;

            team.updateOne({tId}, newData, err=>{
                res.send({
                    code:1,
                    msg:"修改成功"
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