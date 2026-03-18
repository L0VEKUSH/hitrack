// frontend/public/scorecard.js

const API = "/matches";
const params = new URLSearchParams(window.location.search);
const matchId = params.get("id");

let matchData = {};

if (!matchId) {
    alert("No match selected");
}

// ================= LOAD MATCH =================

async function loadScorecard() {

    try {

        const res = await fetch(API + "/" + matchId);
        matchData = await res.json();

        matchData.batsmen = matchData.batsmen || [];
        matchData.bowlers = matchData.bowlers || [];

        document.getElementById("matchInfo").innerHTML =
            `<h2>${matchData.team1} vs ${matchData.team2}</h2>`;

        renderBatsmen();
        renderBowlers();

    } catch (err) {

        console.error("Error loading scorecard", err);

    }

}

// ================= BATSMEN =================

function renderBatsmen() {

    const table = document.getElementById("batsmenTable");

    table.innerHTML = `
    <tr>
        <th>Name</th>
        <th>Runs</th>
        <th>Balls</th>
        <th>4s</th>
        <th>6s</th>
        <th>SR</th>
        <th>Actions</th>
    </tr>`;

    matchData.batsmen.forEach((b, i) => {

        const sr = b.balls > 0
            ? ((b.runs / b.balls) * 100).toFixed(2)
            : "0.00";

        const row = table.insertRow();

        row.innerHTML = `
            <td>
                <input value="${b.name}"
                onchange="updateBatsman(${i}, 'name', this.value)">
            </td>

            <td>
                <input type="number"
                value="${b.runs}"
                onchange="updateBatsman(${i}, 'runs', +this.value)">
            </td>

            <td>
                <input type="number"
                value="${b.balls}"
                onchange="updateBatsman(${i}, 'balls', +this.value)">
            </td>

            <td>
                <input type="number"
                value="${b.fours}"
                onchange="updateBatsman(${i}, 'fours', +this.value)">
            </td>

            <td>
                <input type="number"
                value="${b.sixes}"
                onchange="updateBatsman(${i}, 'sixes', +this.value)">
            </td>

            <td>${sr}</td>

            <td>
                <button onclick="removeBatsman(${i})">
                Remove
                </button>
            </td>
        `;

    });

}

function updateBatsman(index, field, value) {

    matchData.batsmen[index][field] = value;

    renderBatsmen();

}

function addBatsman() {

    matchData.batsmen.push({
        name: "",
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0
    });

    renderBatsmen();

}

function removeBatsman(index) {

    matchData.batsmen.splice(index, 1);

    renderBatsmen();

}

// ================= BOWLERS =================

function renderBowlers() {

    const table = document.getElementById("bowlersTable");

    table.innerHTML = `
    <tr>
        <th>Name</th>
        <th>Overs</th>
        <th>Runs</th>
        <th>Wickets</th>
        <th>Econ</th>
        <th>Actions</th>
    </tr>`;

    matchData.bowlers.forEach((b, i) => {

        const econ = b.overs > 0
            ? (b.runs / b.overs).toFixed(2)
            : "0.00";

        const row = table.insertRow();

        row.innerHTML = `
            <td>
                <input value="${b.name}"
                onchange="updateBowler(${i}, 'name', this.value)">
            </td>

            <td>
                <input type="number"
                value="${b.overs}"
                onchange="updateBowler(${i}, 'overs', +this.value)">
            </td>

            <td>
                <input type="number"
                value="${b.runs}"
                onchange="updateBowler(${i}, 'runs', +this.value)">
            </td>

            <td>
                <input type="number"
                value="${b.wickets}"
                onchange="updateBowler(${i}, 'wickets', +this.value)">
            </td>

            <td>${econ}</td>

            <td>
                <button onclick="removeBowler(${i})">
                Remove
                </button>
            </td>
        `;

    });

}

function updateBowler(index, field, value) {

    matchData.bowlers[index][field] = value;

    renderBowlers();

}

function addBowler() {

    matchData.bowlers.push({
        name: "",
        overs: 0,
        runs: 0,
        wickets: 0
    });

    renderBowlers();

}

function removeBowler(index) {

    matchData.bowlers.splice(index, 1);

    renderBowlers();

}

// ================= SAVE =================

async function saveScorecard() {

    try {

        // total runs from batsmen
        matchData.runs = matchData.batsmen.reduce(
            (total, b) => total + Number(b.runs),
            0
        );

        // total wickets
        matchData.wickets = matchData.bowlers.reduce(
            (total, b) => total + Number(b.wickets),
            0
        );

        // overs -> balls
        const totalOvers = matchData.bowlers.reduce(
            (total, b) => total + Number(b.overs),
            0
        );

        matchData.balls = Math.floor(totalOvers * 6);

        const res = await fetch(API + "/" + matchId, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(matchData)

        });

        if (res.ok) {

            alert("Scorecard Saved Successfully!");

        }

    } catch (err) {

        console.error("Error saving scorecard", err);

    }

}

// ================= INIT =================

loadScorecard();