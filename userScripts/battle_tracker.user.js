// ==UserScript==
// @name Pendoria Battle Tracker
// @namespace https://github.com/trigunshin/pendoria
// @description Output battle stats to JS console. Manually show drops by typing "drops" in console.
// @homepage https://trigunshin.github.com/pendoria
// @version 2
// @downloadURL https://trigunshin.github.io/pendoria/userScripts/battle_tracker.user.js
// @updateURL https://trigunshin.github.io/pendoria/userScripts/battle_tracker.user.js
// @include https://pendoria.net/game
// ==/UserScript==

// moment, $ are already on the page

// https://stackoverflow.com/questions/12636613/how-to-calculate-moving-average-without-keeping-the-count-and-data-total
// New average = old average * (n-1)/n + new value /n

const battleStats = {
    statDrops: 0,
    powerDrops: 0,
    agiDrops: 0,
    dexDrops: 0,
    conDrops: 0,

    averageLifePercent: 0,
    wins: 0,
    trackedBattles: 0,

    drops: 0,
    spDrops: 0,
    spDropAvg: 0,
    rhodiumDrops: 0,

};

const dropAmountRegex = / (\d+) /;

function handleDrops(dropString, stats) {
    stats.drops += 1; // track before anything else
    console.info(moment().toISOString(), dropString);

    const matchResult = dropString.match(dropAmountRegex);
    if(matchResult === null) return;

    const amount = matchResult[1];
    if(dropString.indexOf("spare parts") >= 0) {
        stats.spDrops += 1;
        stats.spDropAvg = stats.spDropAvg * (stats.spDrops-1)/stats.spDrops + amount/stats.spDrops;
    } else if(dropString.indexOf("rhodium") >= 0) {
        stats.rhodiumDrops += 1;
    }
}

function printResults({trackedBattles, drops, averageLifePercent, wins, statDrops, conDrops, powerDrops, agiDrops, dexDrops, spDrops, spDropAvg, rhodiumDrops}, playerLifePercent) {
    console.info(`battles: ${trackedBattles} avgLife%: ${(averageLifePercent*100).toFixed(2)} life%: ${(playerLifePercent*100).toFixed(2)} win%: ${((wins/trackedBattles) *100).toFixed(2)}
drop%: ${(drops/trackedBattles*100).toFixed(2)} drops: ${drops} spDrops: ${spDrops} spDropAvg: ${spDropAvg} rhoDrops: ${rhodiumDrops} 
statDrop%: ${((statDrops/trackedBattles) *100).toFixed(2)} conDrop%: ${((conDrops/trackedBattles) *100).toFixed(2)} powDrop%: ${((powerDrops/trackedBattles) *100).toFixed(2)} agiDrop%: ${((agiDrops/trackedBattles) *100).toFixed(2)} dexDrop%: ${((dexDrops/trackedBattles) *100).toFixed(2)}`);
}

function battleTracker(data) {
    battleStats.trackedBattles += 1;
    if(data.gaineddrops && data.gaineddrops !== "") handleDrops(data.gaineddrops, battleStats);

    if(data.gainedAgility) {
        battleStats.statDrops += 1;
        battleStats.agiDrops += 1;
    }
    if(data.gainedConstitution) {
        battleStats.statDrops += 1;
        battleStats.conDrops += 1;
    }
    if(data.gainedPower) {
        battleStats.statDrops += 1;
        battleStats.powerDrops += 1;
    }
    if(data.gainedDexterity) {
        battleStats.statDrops += 1;
        battleStats.dexDrops += 1;
    }

    if(data.victory) battleStats.wins += 1;

    const playerLifePercent = (data.playerLife/data.playerMaxLife);
    battleStats.averageLifePercent = battleStats.averageLifePercent * (battleStats.trackedBattles-1)/battleStats.trackedBattles + playerLifePercent/battleStats.trackedBattles;

    printResults(battleStats, playerLifePercent);
}

let battleTrackerFn = battleTracker;
socket.on('battle data', battleTrackerFn);