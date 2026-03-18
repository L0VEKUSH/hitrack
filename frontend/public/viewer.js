async function loadMatches(){

const liveContainer = document.getElementById("liveMatches")
const historyContainer = document.getElementById("historyMatches")

liveContainer.innerHTML=""
historyContainer.innerHTML=""

try{

const res = await fetch("/matches")
const matches = await res.json()

matches.forEach(match=>{

const div = document.createElement("div")
div.className="match-card"

const overs = Math.floor(match.balls/6)+"."+(match.balls%6)

const rr = match.balls>0
? (match.runs/(match.balls/6)).toFixed(2)
: "0.00"

// current batsmen
let striker = match.batsmen[match.striker]
let nonStriker = match.batsmen[match.nonStriker]

// current bowler
let bowler = match.bowlers[match.currentBowler]

// ball history
let ballsHTML=""

match.history.slice(-12).forEach(b=>{
ballsHTML+=`<span class="ball">${b.event}</span>`
})

div.innerHTML=`

<h3>${match.team1} vs ${match.team2}
${match.status==="Live" ? '<span class="live">LIVE</span>' : ''}
</h3>

<div class="score">
${match.runs}/${match.wickets} (${overs})
</div>

<p>Run Rate: ${rr}</p>

<div class="player">
🏏 Striker: ${striker ? striker.name : "-"} (${striker ? striker.runs : 0})
</div>

<div class="player">
🏏 Non-Striker: ${nonStriker ? nonStriker.name : "-"} (${nonStriker ? nonStriker.runs : 0})
</div>

<div class="player">
🎯 Bowler: ${bowler ? bowler.name : "-"} (${bowler ? bowler.wickets : 0} wk)
</div>

<div>
<b>Last Balls:</b>
${ballsHTML}
</div>

<a href="match.html?id=${match._id}">
<button>Full Scorecard</button>
</a>

`

if(match.status==="Live"){

liveContainer.appendChild(div)

}else{

historyContainer.appendChild(div)

}

})

}catch(err){

console.log(err)

}

}

setInterval(loadMatches,2000)
loadMatches()