function checkStrength(){

let pass=document.getElementById("pass").value
let strength=document.getElementById("strength")

if(pass.length<6){

strength.innerText="Weak password"
strength.style.color="#ef4444"

}
else if(pass.length<10){

strength.innerText="Medium password"
strength.style.color="#facc15"

}
else{

strength.innerText="Strong password"
strength.style.color="#22c55e"

}

}
async function sendOTP(){

let email = document.getElementById("email").value
let msg = document.getElementById("msg")

if(!email){
  msg.innerText="Enter email first"
  msg.className="error"
  return
}

msg.innerText="Sending OTP..."

try{

const res = await fetch("/send-otp",{
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({ email })
})

const data = await res.json()

if(data.success){
msg.innerText="OTP sent to email"
msg.className="success"
}else{
msg.innerText=data.message
msg.className="error"
}

}catch{
msg.innerText="Server error"
msg.className="error"
}

}
async function verifyOTP(){

let email = document.getElementById("email").value
let password = document.getElementById("pass").value
let otp = document.getElementById("otp").value
let msg = document.getElementById("msg")

if(!email || !password || !otp){
  msg.innerText="Fill all fields"
  msg.className="error"
  return
}

msg.innerText="Verifying..."

try{

const res = await fetch("/verify-otp",{
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({ email, password, otp })
})

const data = await res.json()

if(data.success){

msg.innerText="Signup successful!"
msg.className="success"

setTimeout(()=>{
window.location="login.html"
},1200)

}else{

msg.innerText=data.message
msg.className="error"

}

}catch{
msg.innerText="Server error"
msg.className="error"
}

}


async function signup(){

let email=document.getElementById("email").value
let password=document.getElementById("pass").value
let msg=document.getElementById("msg")

msg.className=""
msg.innerText="Checking..."

if(!email || !password){
  msg.innerText="Enter email and password"
  msg.className="error"
  return
}
if(!email.includes("@") || !email.includes(".")){
  msg.innerText="Enter valid email"
  msg.className="error"
  return
}
try{

const res = await fetch("/signup",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
  email,
  password
})

})

const data = await res.json()

if(data.success){

msg.innerText="Signup successful! Redirecting..."
msg.className="success"

setTimeout(()=>{

window.location="login.html"

},1200)

}else{

msg.innerText=data.message || "Signup failed"
msg.className="error"

}

}catch(err){

msg.innerText="Server error"
msg.className="error"

}

}