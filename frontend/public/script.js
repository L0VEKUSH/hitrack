const matchId = new URLSearchParams(window.location.search).get("id")

async function loadMatch(){

const res = await fetch("/match/"+matchId)

const match = await res.json()

render(match)

}

function render(match){

document.getElementById("teams").innerText =
match.team1 + " vs " + match.team2

document.getElementById("score").innerText =
match.runs + "/" + match.wickets

const overs =
Math.floor(match.balls/6) + "." + (match.balls%6)

document.getElementById("overs").innerText =
"Overs: " + overs

}

async function scoreBall(event){

await fetch("/update-score",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
matchId,
event
})

})

loadMatch()

}

setInterval(loadMatch,2000)

loadMatch()