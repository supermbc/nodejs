const mongoose = require("./db");

const teamSchema = new mongoose.Schema({
    tId: {type:String},
    tName: {type:String},
    tLeader: {type:String}
})

module.exports = mongoose.model("team", teamSchema);