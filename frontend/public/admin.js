let runs=0
let wickets=0
let overs=0
let balls=0

function updateUI(){

document.getElementById("score").innerText=
runs+"/"+wickets

document.getElementById("overs").innerText=
"Overs: "+overs+"."+balls

}

function scoreRun(r){

runs+=r

balls++

if(balls===6){

overs++
balls=0

}

updateUI()

}

function wicket(){

wickets++

balls++

if(balls===6){

overs++
balls=0

}

updateUI()

}

function nextOver(){

overs++
balls=0

updateUI()

}
function createTournament(){

let name=document.getElementById("tournamentName").value

if(!name) return alert("Enter tournament name")

let tournaments=JSON.parse(localStorage.getItem("tournaments")||"[]")

let t={
id:Date.now(),
name:name,
matches:[]
}

tournaments.push(t)

localStorage.setItem("tournaments",JSON.stringify(tournaments))

alert("Tournament Created")

loadTournaments()

}function createTournament(){

let name=document.getElementById("tournamentName").value

if(!name) return alert("Enter tournament name")

let tournaments=JSON.parse(localStorage.getItem("tournaments")||"[]")

let t={
id:Date.now(),
name:name,
matches:[]
}

tournaments.push(t)

localStorage.setItem("tournaments",JSON.stringify(tournaments))

alert("Tournament Created")

loadTournaments()

}
function loadTournaments(){

let list=document.getElementById("tournamentList")

let tournaments=JSON.parse(localStorage.getItem("tournaments")||"[]")

list.innerHTML=""

tournaments.forEach(t=>{

list.innerHTML+=`
<li>
${t.name}
<button onclick="openTournament(${t.id})">Open</button>
</li>
`

})

}
let tournaments = JSON.parse(localStorage.getItem("tournaments") || "[]")

function createTournament(){

let name = document.getElementById("tournamentName").value

if(!name) return alert("Enter tournament name")

let t = {
id: Date.now(),
name: name,
matches: []
}

tournaments.push(t)

localStorage.setItem("tournaments", JSON.stringify(tournaments))

document.getElementById("tournamentName").value=""

loadTournamentDropdown()

alert("Tournament Created")

}


function loadTournamentDropdown(){

let select = document.getElementById("tournamentSelect")

select.innerHTML=""

tournaments.forEach((t,i)=>{

let opt = document.createElement("option")
opt.value = i
opt.text = t.name

select.appendChild(opt)

})

}


function createMatch(){

let teamA = document.getElementById("teamA").value
let teamB = document.getElementById("teamB").value

let index = document.getElementById("tournamentSelect").value

if(!teamA || !teamB) return alert("Enter teams")

let match = {
id: Date.now(),
teamA: teamA,
teamB: teamB,
scorecard: null
}

tournaments[index].matches.push(match)

localStorage.setItem("tournaments", JSON.stringify(tournaments))

alert("Match Created")

document.getElementById("teamA").value=""
document.getElementById("teamB").value=""

}


window.onload = loadTournamentDropdown
.dot{
background:#334155;
font-size:20px;
font-weight:bold;
}