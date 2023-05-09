//张瑜 ，这个接口是提供所有会议室信息或者提供单个会议室的信息,可以分页查询,可以查大中小会议室
const roomdata = require("../sql/meetingroom")
const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
    let {rId, token, page, limit, size} = req.body;

    page = page===undefined || page === "" ? false : page-0;
    limit = limit===undefined || limit === "" ? false : limit-0;

    // 解析token，登录验证
    jwt.verify(token, "有志者事竟成", async (tokenErr, tokenData)=>{
        if(tokenErr){
            res.send({
                code:0,
                msg:"登录失效"
            });
        }else if(rId){
            // 发了rId时
            roomdata.find({rId}, {_id:0, __v:0}, (err,data)=>{
                res.send({
                    code:3,
                    msg:"获取单条会议室信息成功",
                    data
                })
            })
        }else if(tokenData.power === 0 || tokenData.power === 1){
            const result = {};
            let sizeWhere = {};
            // 设置查询条件：会议室大小 => s：0~10，m：11~50，b：51~
            if(size){
                const obj = {
                    s: {number: {$lte:10, $gte:0}},
                    m: {number: {$lte:50, $gte:11}},
                    b: {number: {$gte:51}}
                }
                sizeWhere = obj[size];
            }

            // 创建查询对象
            let selectObj = roomdata.find(sizeWhere, {_id:0, __v:0}).sort({number:1});
            
            // 设置分页信息
            if(page !== false && limit !== false){

                const count = await Object.create(selectObj);

                selectObj = selectObj.skip(page*limit).limit(limit);

                result.page = page;
                result.limit = limit;

                selectObj.then(data=>{
                    result.code = 1;
                    result.msg = "获取会议室信息成功";
                    result.allpages = Math.ceil(count.length / limit);
                    result.total = count.length;
                    result.data = data;
    
                    res.send(result);
                })
                return;
            }

            // 解析查询结果
            selectObj.then(data=>{
                result.code = 1;
                result.msg = "获取会议室信息成功";
                result.data = data;

                res.send(result)
            })
        }else if(tokenData.power === 2){
            //没有权限时
            res.send({
                code:2,
                msg:"权限不够"
            })
        }
    })
}