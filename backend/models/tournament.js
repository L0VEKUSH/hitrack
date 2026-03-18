const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({

name:String,
matches:{type:Number,default:0},
wins:{type:Number,default:0},
loss:{type:Number,default:0},
points:{type:Number,default:0}

})

const tournamentSchema = new mongoose.Schema({

name:String,
teams:[teamSchema]

})

module.exports = mongoose.model("Tournament",tournamentSchema)