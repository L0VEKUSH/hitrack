const mongoose = require("mongoose")

const BallSchema = new mongoose.Schema({

matchId:String,
over:Number,
ball:Number,
event:String,
runs:Number

})

module.exports = mongoose.model("Ball",BallSchema)