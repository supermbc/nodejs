const uuid = require("uuid");
const md5 = require("md5");
const user = require("../sql/user");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
    let {uName, tel, tId, power, token } = req.body;
    
    power -= 0;

    jwt.verify(token, "有志者事竟成", (tokenErr, tokenData)=>{
        if(tokenErr){
            res.send(JSON.stringify({
                code:0,
                msg:"登录失效"
            }))
        }else if(tokenData.power === 0){
            user.find({ tel }, (err, data)=>{
                if(data.length < 1){
                    const userMsg = {
                        uId: "user-" + uuid.v1(),
                        tId,
                        uName,
                        username: tel,
                        password: md5(tel.slice(-6)),
                        power,
                        tel,
                        avatar: "",
                        joinTime: Date.now()
                    };
                    user.insertMany(userMsg, (err)=>{
                        res.send(JSON.stringify({
                            code:2,
                            msg:"员工信息添加成功"
                        }));
                    })
                }else{
                    res.send(JSON.stringify({
                        code:3,
                        msg:"该员工手机号已存在"
                    }));
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
