// ==UserScript==
// @name Pendoria Battle Tracker
// @namespace https://github.com/trigunshin/pendoria
// @description Output battle stats to JS console. Manually show drops by typing "drops" in console.
// @homepage https://trigunshin.github.com/pendoria
// @version 1
// @downloadURL https://trigunshin.github.io/pendoria/userScripts/battle_tracker.user.js
// @updateURL https://trigunshin.github.io/pendoria/userScripts/battle_tracker.user.js
// @include https://pendoria.net/game
// ==/UserScript==

const drops = [];
let trackedBattles = 0;
let wins = 0;
let averageLifePercent = 0;

let statDrops = 0;
let powerDrops = 0;
let conDrops = 0;
let agiDrops = 0;
let dexDrops = 0
// https://stackoverflow.com/questions/12636613/how-to-calculate-moving-average-without-keeping-the-count-and-data-total
// New average = old average * (n-1)/n + new value /n

function battleTracker(data) {
    trackedBattles += 1;
    if(data.gaineddrops && data.gaineddrops !== "") {
        drops.push(data.gaineddrops);
        console.info(moment().toISOString(), data.gaineddrops);
    }

    if(data.gainedAgility) {
        statDrops += 1;
        agiDrops += 1;
    }
    if(data.gainedConstitution) {
        statDrops += 1;
        conDrops += 1;
    }
    if(data.gainedPower) {
        statDrops += 1;
        powerDrops += 1;
    }
    if(data.gainedDexterity) {
        statDrops += 1;
        dexDrops += 1;
    }

    if(data.victory) wins += 1;

    const playerLifePercent = (data.playerLife/data.playerMaxLife);
    averageLifePercent = averageLifePercent * (trackedBattles-1)/trackedBattles + playerLifePercent/trackedBattles;

    console.info(`battles: ${trackedBattles} drops: ${drops.length} avgLife%: ${(averageLifePercent*100).toFixed(2)} life%: ${(playerLifePercent*100).toFixed(2)} win%: ${((wins/trackedBattles) *100).toFixed(2)} 
statDrop%: ${((statDrops/trackedBattles) *100).toFixed(2)} conDrop%: ${((conDrops/trackedBattles) *100).toFixed(2)} powDrop%: ${((powerDrops/trackedBattles) *100).toFixed(2)} agiDrop%: ${((agiDrops/trackedBattles) *100).toFixed(2)} dexDrop%: ${((dexDrops/trackedBattles) *100).toFixed(2)}
    `);


}

let battleTrackerFn = battleTracker;
socket.on('battle data', battleTrackerFn);