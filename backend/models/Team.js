const mongoose = require("mongoose")

const TeamSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

played:{
type:Number,
default:0
},

wins:{
type:Number,
default:0
},

losses:{
type:Number,
default:0
},

points:{
type:Number,
default:0
},

runsScored:{
type:Number,
default:0
},

oversPlayed:{
type:Number,
default:0
},

runsConceded:{
type:Number,
default:0
},

oversBowled:{
type:Number,
default:0
}

})

module.exports = mongoose.model("Team",TeamSchema)