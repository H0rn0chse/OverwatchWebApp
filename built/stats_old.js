function getSessionStats() {
    const roles = ["Tank", "DPS", "Support"];
    const sessionStats = {
        start: [0, 0, 0],
        current: [0, 0, 0],
        gain: [0, 0, 0],
        wld: [0, 0, 0],
        sum: 0
    };
    roles.forEach((role, index) => {
        roleStats = calcStats(role);
        sessionStats.start[index] = roleStats.sessionStart;
        sessionStats.current[index] = roleStats.sessionCurrent;
        sessionStats.gain[index] = roleStats.sessionCurrent - roleStats.sessionStart;
        sessionStats.sum += parseFloat(sessionStats.gain[index]);
        sessionStats.wld[0] += roleStats.sessionWld[0];
        sessionStats.wld[1] += roleStats.sessionWld[1];
        sessionStats.wld[2] += roleStats.sessionWld[2];
    });
    return sessionStats;
}
function getSeasonStats() {
    const roles = ["Tank", "DPS", "Support"];
    const season = getCurrentSeason();
    const seasonStats = {
        srGain: [0, 0, 0],
        srLoss: [0, 0, 0],
        srWin: [0, 0, 0]
    };
    roles.forEach((role, index) => {
        roleStats = calcStats(role, season);
        seasonStats.srGain[index] = roleStats.srAvg || 0;
        seasonStats.srGain[index] = seasonStats.srGain[index].toFixed(2);
        seasonStats.srLoss[index] = roleStats.srLoss || 0;
        seasonStats.srLoss[index] = seasonStats.srLoss[index].toFixed(2);
        seasonStats.srWin[index] = roleStats.srWin || 0;
        seasonStats.srWin[index] = seasonStats.srWin[index].toFixed(2);
    });
    return seasonStats;
}
