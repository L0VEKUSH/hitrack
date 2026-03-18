const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const otpGenerator = require("otp-generator")
const Match = require("./models/Match")
const Admin = require("./models/admin")
const Tournament = require("./models/tournament")

const app = express()
const PORT = 3000

console.log("Starting server...")

// =========================
// Middleware
// =========================

app.use(cors())
app.use(express.json())

app.use(express.static(
path.join(__dirname,"../frontend/public")
))

app.get("/points-table", async (req,res)=>{

const tournament = await Tournament.findOne()

if(!tournament) return res.json([])

res.json(tournament.teams)

})

// =========================
// MongoDB
// =========================

mongoose.connect("mongodb://127.0.0.1:27017/hitrack")

.then(()=>{
console.log("MongoDB Connected")
})
.catch(err=>console.log(err))

// =========================
// Homepage
// =========================

app.get("/",(req,res)=>{
res.sendFile(
path.join(__dirname,"../frontend/public/index.html")
)
})
//=====signup data save ========
// app.post("/signup", async (req,res)=>{

// try{

// const { email, password } = req.body

// if(!email || !password){
//   return res.json({
//     success:false,
//     message:"Missing fields"
//   })
// }

// // check if email already exists
// const existing = await User.findOne({ email })

// if(existing){
//   return res.json({
//     success:false,
//     message:"Email already registered"
//   })
// }

// // encrypt password
// const hash = await bcrypt.hash(password,10)

// // save user
// const user = new User({
//   email,
//   password:hash
// })

// await user.save()

// res.json({
//   success:true,
//   message:"Signup successful"
// })

// }catch(err){

// console.log(err)

// res.json({
//   success:false,
//   message:"Server error"
// })

// }

// })

// =========================
// Admin Login (bcrypt)
// =========================

app.post("/admin/login", async (req,res)=>{

try{

const { email, password } = req.body

const username = email

if(!username || !password){

return res.json({
success:false,
message:"Missing login fields"
})

}

const admin = await Admin.findOne({username})

if(!admin){

return res.status(401).json({
success:false,
message:"Invalid username"
})

}

const match = await bcrypt.compare(password, admin.password)

if(!match){

return res.status(401).json({
success:false,
message:"Wrong password"
})

}

// detect role
let role = "admin"

res.json({
success:true,
username:username,
role:role
})

}catch(err){

console.log(err)

res.json({
success:false
})

}

})

// =========================
// Create Match
// =========================

app.post("/create-match", isAdmin, async(req,res)=>{
try{

const {team1,team2,overs,target} = req.body

if(!team1 || !team2 || !overs){

return res.json({
success:false,
message:"Missing fields"
})

}

const match = new Match({

team1,
team2,
overs,
target,


runs:0,
wickets:0,
balls:0,

batsmen:[],
bowlers:[],

striker:0,
nonStriker:1,
currentBowler:0,

history:[],
status:"Live"

})

await match.save()

res.json({

success:true,
matchId:match._id

})

}catch(error){

console.log(error)

res.json({
success:false
})

}

})

// =========================
// Add Batsman
// =========================

app.post("/add-batsman", async (req,res)=>{

try{

const {matchId,name} = req.body

if(!name || name.trim()===""){

return res.json({
success:false,
message:"Batsman name required"
})

}

const match = await Match.findById(matchId)

if(!match) return res.json({success:false})

match.batsmen.push({

name:name.trim(),
runs:0,
balls:0,
fours:0,
sixes:0,
status:"Not Out"

})

await match.save()

res.json({success:true})

}catch(err){

console.log(err)
res.json({success:false})

}

})

// =========================
// Add Bowler
// =========================

app.post("/add-bowler", async (req,res)=>{

try{

const {matchId,name} = req.body

if(!name || name.trim()===""){

return res.json({
success:false,
message:"Bowler name required"
})

}

const match = await Match.findById(matchId)

if(!match) return res.json({success:false})

match.bowlers.push({

name:name.trim(),
balls:0,
runs:0,
wickets:0

})

await match.save()

res.json({success:true})

}catch(err){

console.log(err)
res.json({success:false})

}

})

// =========================
// Change Bowler
// =========================

app.post("/change-bowler", async (req,res)=>{

try{

const {matchId,bowlerIndex} = req.body

const match = await Match.findById(matchId)

if(!match) return res.json({success:false})

match.currentBowler = bowlerIndex

await match.save()

res.json({success:true})

}catch(err){

console.log(err)
res.json({success:false})

}

})

// =========================
// Update Score
// =========================

app.post("/update-score",async(req,res)=>{

try{

const {matchId,event} = req.body

const match = await Match.findById(matchId)

if(!match) return res.json({success:false})

// stop scoring if finished
if(match.status==="Finished"){

return res.json({
success:false,
message:"Match finished"
})

}

const striker = match.batsmen[match.striker]
const bowler = match.bowlers[match.currentBowler]

// increase ball
match.balls++

if(striker) striker.balls++
if(bowler) bowler.balls++

// =========================
// WICKET
// =========================

if(event==="W"){

match.wickets++

if(striker) striker.status="Out"

if(bowler) bowler.wickets++

}

// =========================
// RUNS
// =========================

else{

let runs = parseInt(event)

if(!isNaN(runs)){

match.runs += runs

if(striker){

striker.runs += runs
striker.matchRuns = (striker.matchRuns || 0) + runs
striker.tournamentRuns = (striker.tournamentRuns || 0) + runs

if(runs===4) striker.fours++
if(runs===6) striker.sixes++

}

if(bowler){

bowler.runs += runs

}

// rotate strike
if(runs%2===1){

let temp = match.striker
match.striker = match.nonStriker
match.nonStriker = temp

}

}

}

// =========================
// Over Complete
// =========================

if(match.balls%6===0){

let temp = match.striker
match.striker = match.nonStriker
match.nonStriker = temp

}

// =========================
// Ball History
// =========================

match.history.push({

ball:match.balls,
event:event

})

// =========================
// Match Finish
// =========================

if(match.wickets>=10 || match.balls>=match.overs*6){

match.status="Finished"

// ========================
// Update Tournament Points
// ========================

const tournament = await Tournament.findOne()

if(tournament){

let team1 = tournament.teams.find(t=>t.name === match.team1)
let team2 = tournament.teams.find(t=>t.name === match.team2)

if(team1 && team2){

team1.matches++
team2.matches++

// simple winner logic
if(match.runs > match.target){

team1.wins++
team1.points += 2
team2.loss++

}else if(match.runs < match.target){

team2.wins++
team2.points += 2
team1.loss++

}else{

// tie case
team1.points += 1
team2.points += 1

}

await tournament.save()

}

}

}

await match.save()

res.json({

success:true,
match

})

}catch(error){

console.log(error)

res.json({
success:false
})

}

})
const Player = require("./models/Player")

// Route to get all player info
app.get("/api/players-info", async (req, res) => {
  try {
    const players = await Player.find()
    res.json(players)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch player data" })
  }
})

// =========================
// Get All Matches
// =========================

app.get("/matches",async(req,res)=>{

try{

const matches = await Match
.find()
.sort({createdAt:-1})

res.json(matches)

}catch(err){

res.json([])

}

})
// ==========================
// Championship Page Route
// ==========================

app.get("/championship", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/championship.html"))
})

// =========================
// Get Single Match
// =========================

app.get("/match/:id",async(req,res)=>{

try{

const match = await Match.findById(req.params.id)

res.json(match)

}catch(error){

res.json({})

}

})

// =========================
// Delete Match
// =========================

app.delete("/match/:id",async(req,res)=>{

try{

await Match.findByIdAndDelete(req.params.id)

res.json({
success:true
})

}catch(err){

res.json({
success:false
})

}

})

// =========================
// Start Server
// =========================

app.listen(PORT,()=>{

console.log(`HiTrack PRO running http://localhost:${PORT}`)

})
// =========================
// Orange Cap
// =========================

app.get("/orange-cap", async (req,res)=>{

try{

const matches = await Match.find()

let players = []

matches.forEach(m=>{

m.batsmen.forEach(b=>{

let existing = players.find(p=>p.name === b.name)

if(existing){

existing.runs += b.runs

}else{

players.push({
name:b.name,
runs:b.runs
})

}

})

})

players.sort((a,b)=>b.runs-a.runs)

res.json(players)

}catch(err){

console.log(err)
res.json([])

}

})
// =========================
// Purple Cap
// =========================

app.get("/purple-cap", async (req,res)=>{

try{

const matches = await Match.find()

let bowlers = []

matches.forEach(m=>{

m.bowlers.forEach(b=>{

let existing = bowlers.find(p=>p.name === b.name)

if(existing){

existing.wkts += b.wickets

}else{

bowlers.push({
name: b.name,
wkts: b.wickets
})

}

})

})

bowlers.sort((a,b)=>b.wkts-a.wkts)

res.json(bowlers)

}catch(err){

console.log(err)
res.json([])

}

})
app.get("/api/player/:id", async (req,res)=>{

const player = await Player.findById(req.params.id)

res.json(player)

})

// ✅ User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
})

const User = mongoose.model("User", userSchema)

// ✅ OTP Store
let otpStore = {}

// ✅ Email Setup (IMPORTANT)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",       // 🔴 change this
    pass: "your_app_password"          // 🔴 use app password
  }
})

// =====================
// ✅ SEND OTP
// =====================
app.post("/send-otp", async (req, res) => {

  const { email } = req.body

  if(!email){
    return res.json({ success:false, message:"Email required" })
  }

  // ✅ FIXED: moved here
  if(!email.includes("@") || !email.includes(".")){
    return res.json({
      success:false,
      message:"Invalid email"
    })
  }

  if(otpStore[email] && otpStore[email].lastSent > Date.now() - 60000){
    return res.json({
      success:false,
      message:"Wait 1 minute before retry"
    })
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false
  })

  otpStore[email] = {
    otp,
    lastSent: Date.now()
  }

  try{
    await transporter.sendMail({
      from: "yourgmail@gmail.com",
      to: email,
      subject: "HiTrack OTP Verification",
      text: `Your OTP is ${otp}`
    })

    res.json({ success:true })

  }catch(err){
    console.log(err)
    res.json({ success:false, message:"Email failed" })
  }

})


// =====================
// ✅ VERIFY OTP + SIGNUP
// =====================
app.post("/verify-otp", async (req, res) => {

  const { email, password, otp } = req.body

  const record = otpStore[email]

if(!record || record.otp !== otp){
  return res.json({
    success:false,
    message:"Invalid OTP"
  })
}

  const existingUser = await User.findOne({ email })

  if(existingUser){
    return res.json({ success:false, message:"Email already registered" })
  }
const hashedPassword = await bcrypt.hash(password, 10)

const newUser = new User({ 
  email, 
  password: hashedPassword 
})
  await newUser.save()

  delete otpStore[email]

  res.json({ success:true })

})
// =====================
// ✅ USER LOGIN
// =====================
app.post("/user/login", async (req, res) => {

  try{

    const { email, password } = req.body

    if(!email || !password){
      return res.json({
        success:false,
        message:"Missing fields"
      })
    }

    const user = await User.findOne({ email })

    if(!user){
      return res.json({
        success:false,
        message:"User not found"
      })
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
      return res.json({
        success:false,
        message:"Wrong password"
      })
    }

    res.json({
      success:true,
      role:"user",
      email:user.email
    })

  }catch(err){

    console.log(err)

    res.json({
      success:false
    })

  }

})
function isAdmin(req,res,next){

  const role = req.headers.role

  if(role !== "admin"){
    return res.status(403).json({
      success:false,
      message:"Unauthorized"
    })
  }

  next()

}