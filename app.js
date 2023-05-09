const express = require("express");

const login = require("./modules/login")
const addUser = require("./modules/adduser")
const getUser = require("./modules/getuser");
const setUser = require("./modules/setuser");
const password = require("./modules/password");
const avatar = require("./modules/avatar");
const delUser = require("./modules/deluser");

const addTeam = require("./modules/addteam");
const getTeam = require("./modules/getteam");
const setTeam = require("./modules/setteam");

const addMeeting = require("./modules/addmeetinginfo")
const getMeeting = require('./modules/getmeetinginfo')
const setMeeting = require("./modules/setmeetinginfo")

const addRoom = require("./modules/addroom")
const getAllRoom = require("./modules/getallroom")
const setRoomConfig = require("./modules/setroomconfig")

const multer = require("multer");
const upload = multer( {dest: "./upload"} );

const app = express();

// 生成超管信息
const addAdmin = require("./sql/addAdmin");
addAdmin();

// 注册中间件，解析前端发送的 数据类型为 application/json 的请求体
app.use( express.json() )

app.use( express.static("./static") );
app.use( express.static("./upload") );
app.use( express.urlencoded({ extended: false }) );
app.use( upload.any() );

// cors配置
app.all("*",(req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","get,post");
    res.header("Access-Control-Allow-Headers",'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, token');
    next();
})

// 用户登录
app.get( "/login", login );
// 管理员添加用户信息
app.post( "/adduser", addUser );
// 获取所有用户信息 & 获取指定用户信息
app.get( "/getuser", getUser );
// 管理员修改指定用户基本信息
app.post( "/setuser", setUser );
// 管理员&用户修改密码信息
app.post( "/password", password );
// 管理员&用户修改头像信息
app.post( "/avatar", avatar );
// 管理员删除用户信息
app.post( "/deluser", delUser );

// 会议室操作：张瑜
// 新增会议室
app.post("/addroom", addRoom)
// 获取所有会议室
app.post("/getallroom", getAllRoom)
// 修改会议室配置
app.post("/setroomconfig", setRoomConfig)

// 会议操作：方祖全
// 部门经理添加会议：修改指定会议室的状态
// 修改会议：基本信息，会议状态，会议室状态
app.post( "/addmeeting", addMeeting );
app.post( "/getmeeting", getMeeting );
app.post( "/setmeeting", setMeeting );

// 部门操作：张硕
// 添加部门：部门的各种字段
// 获取部门：全部，单个
// 修改部门：修改经理
app.post( "/getteam", getTeam );
app.post( "/setteam", setTeam );
app.post( "/addteam", addTeam );

app.listen(3000, ()=>{
    console.log("会议室管理系统baseURL：http://localhost:3000")
})