const SCORING_SYSTEMS = {
    "4-lane": { 1: 5, 2: 3, 3: 1, 4: 0 },
    "6-lane": { 1: 6, 2: 4, 3: 3, 4: 2, 5: 1, 6: 0 },
    "8-lane": { 1: 9, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1 },
    "blue-hen": { 1: 20, 2: 18, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11, 9: 10, 10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1 },
    "disc": { 1: 16, 2: 13, 3: 12, 4: 11, 5: 10, 6: 9, 7: 7, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1},
    "diaa-state": { 1: 20, 2: 17, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11, 9: 9, 10: 7, 11: 6, 12: 5, 13: 4, 14: 3, 15: 2, 16: 1 }
};

const TEAMS = {
    "4-lane": ["-----", "Home", "Away"],
    "6-lane": ["-----", "Home", "Away"],
    "8-lane": ["-----", "Home", "Away"],
    "blue-hen": ["-----", "Appoquinimink", "Brandywine", "Christiana", "Concord", "Glasgow", "John Dickinson", "McKean", "Middletown", "Mt Pleasant", "Newark", "Odessa", "William Penn"],
    "disc": ["-----","Wilmington Friends", "Sanford", "St Andrew's", "Tower Hill", "Tatnall"],
    "diaa-state": ["-----", "Brandywine", "Christiana", "Concord", "John Dickinson", "Middletown", "Mt Pleasant", "Newark", "Odessa", "William Penn", "Appoquinimink", "Archmere", "Caesar Rodney", "Cape Henlopen", "Caravel", "Conrad", "Delaware Military", "Delmarva Christian", "Dover", "Indian River", "Lake Forest", "Milford", "MOT Charter", "Mt Sophia", "Newark Charter", "Padua", "Polytech", "Salesianum", "Sanford", "Seaford", "St Andrew's", "St Elizabeth", "St Marks", "Sussex Academy", "Sussex Central", "Sussex Technical", "Tatnall", "Tower Hill", "Ursuline", "Wilmington Charter", "Wilmington Friends"]
};

const INDIVIDUAL_EVENTS = [
    "200 Free", "200 IM", "50 Free", "100 Fly", "100 Free", "500 Free", "100 Back", "100 Breast"
];

const RELAY_EVENTS = ["200 Medley Relay", "200 Free Relay", "400 Free Relay"];

const scoringSystemSelect = document.getElementById("scoring-system");
const individualTable = document.querySelector("#individual-events tbody");
const relayTable = document.querySelector("#relay-events tbody");
const resultsTable = document.querySelector("#results tbody");

function createEventRows(events, table, teams, numPlaces) {
    table.innerHTML = "";
    events.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${event}</td>` +
            Array(numPlaces).fill().map(() => `<td><select>${teams.map(team => `<option>${team}</option>`).join("")}</select></td>`).join("");
        table.appendChild(row);
    });
}

function calculateScores() {
    const scores = {};
    const scoringSystem = scoringSystemSelect.value;
    const scoring = SCORING_SYSTEMS[scoringSystem];

    const calculateEventScores = (rows, isRelay) => {
        rows.forEach(row => {
            row.querySelectorAll("select").forEach((select, place) => {
                const team = select.value;
                if (team !== "-----") {
                    const points = (scoring[place + 1] || 0) * (isRelay ? 2 : 1);
                    scores[team] = (scores[team] || 0) + points;
                }
            });
        });
    };

    calculateEventScores([...individualTable.querySelectorAll("tr")], false);
    calculateEventScores([...relayTable.querySelectorAll("tr")], true);

    resultsTable.innerHTML = Object.entries(scores)
        .map(([team, points]) => `<tr><td>${team}</td><td>${points}</td></tr>`)
        .join("");
}

function updateTeams() {
    const selectedScoringSystem = scoringSystemSelect.value;
    const teams = TEAMS[selectedScoringSystem];
    const numPlaces = Object.keys(SCORING_SYSTEMS[selectedScoringSystem]).length;

    createEventRows(INDIVIDUAL_EVENTS, individualTable, teams, numPlaces);
    createEventRows(RELAY_EVENTS, relayTable, teams, numPlaces);
}

scoringSystemSelect.addEventListener("change", () => {
    updateTeams();
    calculateScores();
});

document.addEventListener("change", calculateScores);

// Initialize the tables with the default scoring system
updateTeams();