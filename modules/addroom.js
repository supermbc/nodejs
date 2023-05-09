//张瑜，此接口功能为增加新会议室
const roomdata = require("../sql/meetingroom")
const jwt = require("jsonwebtoken")

module.exports = (req,res)=>{
    // 前端需要给我token，会议室的容量（num），会议室里的配置（数组）
    let { token, number, config} = req.body;
    number -= 0;
    if(typeof config !== "object"){
        config = config ? JSON.parse(config) : [];
    }
    //验证token
    jwt.verify(token, "有志者事竟成", (tokenErr, tokenData)=>{
        if(tokenErr){
            res.send({
                code:0,
                msg:"登录失效"
            });
        }else{
            // 需要权限
            if(tokenData.power === 0){
                // 生成会议室编号
                let rId = ''
                if(number<=10){
                    rId =`rs${Date.now()}`
                }else if(number>10&&number<=50){
                    rId =`rm${Date.now()}`
                }else{
                    rId =`rb${Date.now()}`
                }
                //插入数据库
                roomdata.insertMany([{
                    rId,    //会议室编号
                    number, //会议室容量
                    config,  //会议室配置
                    uId:"",   //会议室申请人
                    tId:"",   //会议室申请部门
                    iNumber:0,  //会议人数
                    iId: "",    //会议编号
                    iTime:[],   //使用时间
                    state: "2",  //状态 0申请中，1使用中，2空闲
                }], (err)=>{
                    console.log(err);
                    roomdata.countDocuments((err, num)=>{
                        res.send({
                            code:1,
                            msg:`添加会议室成功，您现有${num}个会议室`
                        })
                    })
                })
            }else{
                res.send({
                    code:2,
                    msg:"没有添加会议室的权限"
                })
            }
        }
    })
}