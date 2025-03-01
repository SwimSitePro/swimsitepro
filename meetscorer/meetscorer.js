const SCORING_SYSTEMS = {
    "4-lane": { 1: 5, 2: 3, 3: 1, 4: 0 },
    "6-lane": { 1: 6, 2: 4, 3: 3, 4: 2, 5: 1, 6: 0 },
    "8-lane": { 1: 9, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1 },
    "blue-hen": { 1: 20, 2: 18, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11, 9: 10, 10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1 },
    "disc": { 1: 16, 2: 13, 3: 12, 4: 11, 5: 10, 6: 9, 7: 7, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 },
    "diaa-state": { 1: 20, 2: 17, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11, 9: 9, 10: 7, 11: 6, 12: 5, 13: 4, 14: 3, 15: 2, 16: 1 },
    "caa-men": { 1: 20, 2: 17, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11, 9: 9, 10: 7, 11: 6, 12: 5, 13: 4, 14: 3, 15: 2, 16: 1 },
    "caa-women": { 1: 32, 2: 28, 3: 27, 4: 26, 5: 25, 6: 24, 7: 23, 8: 22, 9: 20, 10: 17, 11: 16, 12: 15, 13: 14, 14: 13, 15: 12, 16: 11, 17: 9, 18: 7, 19: 6, 20: 5, 21: 4, 22: 3, 23: 2, 24: 1 },
};

const TEAMS = {
    "4-lane": ["-----", "Home", "Away"],
    "6-lane": ["-----", "Home", "Away"],
    "8-lane": ["-----", "Home", "Away"],
    "blue-hen": ["-----", "Appoquinimink", "Brandywine", "Christiana", "Concord", "Glasgow", "John Dickinson", "McKean", "Middletown", "Mt Pleasant", "Newark", "Odessa", "William Penn"],
    "disc": ["-----", "Wilmington Friends", "Sanford", "St Andrew's", "Tower Hill", "Tatnall"],
    "diaa-state": ["-----", "Brandywine", "Christiana", "Concord", "John Dickinson", "Middletown", "Mt Pleasant", "Newark", "Odessa", "William Penn", "Appoquinimink", "Archmere", "Caesar Rodney", "Cape Henlopen", "Caravel", "Conrad", "Delaware Military", "Delmarva Christian", "Dover", "Indian River", "Lake Forest", "Milford", "MOT Charter", "Mt Sophia", "Newark Charter", "Padua", "Polytech", "Salesianum", "Sanford", "Seaford", "St Andrew's", "St Elizabeth", "St Marks", "Sussex Academy", "Sussex Central", "Sussex Technical", "Tatnall", "Tower Hill", "Ursuline", "Wilmington Charter", "Wilmington Friends"],
    "caa-men": ["-----", "Delaware", "UNC Wilmington", "Drexel", "Towson", "William & Mary", "Monmouth"],
    "caa-women": ["-----", "Delaware", "UNC Wilmington", "Drexel", "Towson", "William & Mary", "Monmouth", "Northeastern", "Campbell", "Stony Brook"],
};

const INDIVIDUAL_EVENTS = [
    "Event 1", "Event 2", "Event 3", "Event 4", "Event 5", "Event 6", "Event 7", "Event 8"
];

const RELAY_EVENTS = ["Relay 1", "Relay 2", "Relay 3"];

const scoringSystemSelect = document.getElementById("scoring-system");
const individualTable = document.querySelector("#individual-events tbody");
const relayTable = document.querySelector("#relay-events tbody");
const resultsTable = document.querySelector("#results tbody");

function getOrdinalSuffix(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return (v >= 11 && v <= 13) ? "th" : s[v % 10] || "th";
}

function updateTableHeaders(tableId, numPlaces) {
    const theadTr = document.querySelector(`#${tableId} thead tr`);
    theadTr.innerHTML = '<th>Event</th>' + 
        Array(numPlaces).fill().map((_, i) => `<th>${i + 1}${getOrdinalSuffix(i + 1)}</th>`).join("");
}

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

    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    resultsTable.innerHTML = sortedScores
        .map(([team, points]) => `<tr><td>${team}</td><td>${points}</td></tr>`)
        .join("");
}

function updateTeams() {
    const selectedScoringSystem = scoringSystemSelect.value;
    const teams = TEAMS[selectedScoringSystem];
    const numPlaces = Object.keys(SCORING_SYSTEMS[selectedScoringSystem]).length;

    createEventRows(INDIVIDUAL_EVENTS, individualTable, teams, numPlaces);
    createEventRows(RELAY_EVENTS, relayTable, teams, numPlaces);
    updateTableHeaders("individual-events", numPlaces);
    updateTableHeaders("relay-events", numPlaces);
}

scoringSystemSelect.addEventListener("change", () => {
    updateTeams();
    calculateScores();
});

document.addEventListener("change", calculateScores);

updateTeams();