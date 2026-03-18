const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Admin = require("./models/Admin")

mongoose.connect("mongodb://127.0.0.1:27017/hitrack")

async function createAdmin(){

const hash = await bcrypt.hash("admin123",10)

const admin = new Admin({
username:"admin",
password:hash
})

await admin.save()

console.log("✅ Admin created successfully")

process.exit()

}

createAdmin()