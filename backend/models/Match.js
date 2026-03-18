const mongoose = require("mongoose")

// ======================
// Ball History Schema
// ======================

const ballSchema = new mongoose.Schema({

ball:{
type:Number
},

event:{
type:String
},

runs:{
type:Number,
default:0
},

batsman:{
type:String
},

bowler:{
type:String
},

timestamp:{
type:Date,
default:Date.now
}

})

// ======================
// Batsman Schema
// ======================

const batsmanSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

runs:{
type:Number,
default:0
},

balls:{
type:Number,
default:0
},

fours:{
type:Number,
default:0
},

sixes:{
type:Number,
default:0
},

strikeRate:{
type:Number,
default:0
},

status:{
type:String,
enum:["Not Out","Out"],
default:"Not Out"
}

})

// ======================
// Bowler Schema
// ======================

const bowlerSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

balls:{
type:Number,
default:0
},

runs:{
type:Number,
default:0
},

wickets:{
type:Number,
default:0
},

economy:{
type:Number,
default:0
}

})

// ======================
// Partnership Schema
// ======================

const partnershipSchema = new mongoose.Schema({

runs:{
type:Number,
default:0
},

balls:{
type:Number,
default:0
},

batsmen:{
type:[String],
default:[]
}

})

// ======================
// Match Schema
// ======================

const MatchSchema = new mongoose.Schema({

team1:{
type:String,
required:true
},

team2:{
type:String,
required:true
},

overs:{
type:Number,
required:true
},

runs:{
type:Number,
default:0
},

wickets:{
type:Number,
default:0,
max:10
},

balls:{
type:Number,
default:0
},

runRate:{
type:Number,
default:0
},

status:{
type:String,
enum:["Upcoming","Live","Finished"],
default:"Live"
},

innings:{
type:Number,
default:1
},

// ======================
// Players
// ======================

batsmen:{
type:[batsmanSchema],
default:[]
},

bowlers:{
type:[bowlerSchema],
default:[]
},

// ======================
// Current Player Index
// ======================

striker:{
    
type:Number,
default:0
},

nonStriker:{
type:Number,
default:1
},

currentBowler:{
type:Number,
default:0
},

// ======================
// Partnership
// ======================

partnership:{
type:partnershipSchema,
default: () => ({})
},
// ======================
// Ball History
// ======================

history:{
type:[ballSchema],
default:[]
},

createdAt:{
type:Date,
default:Date.now
}

})


// ======================
// Virtual Overs Format
// ======================

MatchSchema.virtual("oversFormatted").get(function(){

return Math.floor(this.balls/6)+"."+(this.balls%6)

})


// ======================
// Enable Virtuals in API
// ======================

MatchSchema.set("toJSON",{virtuals:true})
MatchSchema.set("toObject",{virtuals:true})


// ======================
// Indexes
// ======================

MatchSchema.index({createdAt:-1})
MatchSchema.index({status:1})


// ======================
// Export Model
// ======================

module.exports = mongoose.model("Match",MatchSchema)