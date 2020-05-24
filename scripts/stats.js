function calcStats (role, season = "All") {
	const stats = {};
	let entries = getEntries(role);
	if (season != "All") {
		entries = entries.filter(e => {
			return e.season == season
		});
	}

	addWld(entries);

	stats.enhancedEntries = entries;
	stats.gamesPlayed = entries.length;
	stats.startSr = entries.reduce((acc, val) => {
		if (acc) {
			return acc;
		}
		if (val.sr > 0) {
			return val.sr;
		}
	}, null);
	stats.seasonHigh = entries.reduce((acc, val) => {
		return val.sr > acc ? val.sr : acc;
	}, 0);
	stats.seasonLow = entries.reduce((acc, val) => {
		return val.sr < acc && val.sr > 0 ? val.sr : acc;
	}, 5000);
	stats.win = entries.reduce((acc, val) => {
		if (val.wld == "Win") {
			acc += 1;
		}
		return acc;
	}, 0);
	stats.loss = entries.reduce((acc, val) => {
		if (val.wld == "Loss") {
			acc += 1;
		}
		return acc;
	}, 0);
	stats.draw = entries.reduce((acc, val) => {
		if (val.wld == "Draw") {
			acc += 1;
		}
		return acc;
	}, 0);
	stats.winStreak = entries.reduce((acc, val) => {
		if (val.wld == "Win") {
			acc[0] += 1
		} else {
			acc[0] = 0;
		}
		if (acc[0] > acc[1]) {
			acc[1] = acc[0];
		}
		return acc;
	}, [0, 0])[1];
	stats.lossStreak = entries.reduce((acc, val) => {
		if (val.wld == "Loss") {
			acc[0] += 1
		} else {
			acc[0] = 0;
		}
		if (acc[0] > acc[1]) {
			acc[1] = acc[0];
		}
		return acc;
	}, [0, 0])[1];

	const lastEntry = entries[entries.length - 1] || {};
	stats.currentSr = lastEntry.sr || 0;
	stats.srGain = stats.currentSr - stats.startSr;
	stats.winRate = stats.win / (stats.gamesPlayed - stats.draw);
	// [sum, count]
	stats.srLoss = entries.reduce((acc, val) => {
		if (val.wld == "Loss" && val.diff != 0) {
			acc[0] += val.diff;
			acc[1] += 1;
		}
		return acc;
	}, [0, 0])
	stats.srLoss = stats.srLoss[0] / stats.srLoss[1];
	// [sum, count]
	stats.srWin = entries.reduce((acc, val) => {
		if (val.wld == "Win" && val.diff != 0) {
			acc[0] += val.diff;
			acc[1] += 1;
		}
		return acc;
	}, [0, 0]);
	stats.srWin = stats.srWin[0] / stats.srWin[1];
	// [sum, count]
	stats.srAvg = entries.reduce((acc, val) => {
		if (val.wasDefault) {
			acc[0] += val.diff;
			acc[1] += 1;
		}
		return acc;
	}, [0, 0]);
	stats.srAvg = stats.srAvg[0] / stats.srAvg[1];

	addGroupStats(stats);
	addSessionStats(stats);

	return stats;
}

function addGroupStats (stats) {
	const entries = stats.enhancedEntries;
	stats.gamesPlayedGroup = entries.reduce((acc, val) => {
		acc[val.size] += 1;
		return acc;
	}, [null, 0, 0, 0, 0, 0, 0]);
	stats.winGroup = entries.reduce((acc, val) => {
		if (val.wld == "Win") {
			acc[val.size] += 1;
		}
		return acc;
	}, [null, 0, 0, 0, 0, 0, 0]),
	stats.lossGroup = entries.reduce((acc, val) => {
		if (val.wld == "Loss") {
			acc[val.size - 1] += 1;
		}
		return acc;
	}, [0, 0, 0, 0, 0, 0]);
	stats.drawGroup = entries.reduce((acc, val) => {
		if (val.wld == "Draw") {
			acc[val.size - 1] += 1;
		}
		return acc;
	}, [0, 0, 0, 0, 0, 0]);
	stats.winRateGroup = [
		null,
		stats.winGroup[1] / (stats.gamesPlayedGroup[1] - stats.drawGroup[1]) || 0,
		stats.winGroup[2] / (stats.gamesPlayedGroup[2] - stats.drawGroup[2]) || 0,
		stats.winGroup[3] / (stats.gamesPlayedGroup[3] - stats.drawGroup[3]) || 0,
		stats.winGroup[4] / (stats.gamesPlayedGroup[4] - stats.drawGroup[4]) || 0,
		stats.winGroup[5] / (stats.gamesPlayedGroup[5] - stats.drawGroup[5]) || 0,
		stats.winGroup[6] / (stats.gamesPlayedGroup[6] - stats.drawGroup[6]) || 0,
	];

}

function addSessionStats (stats) {
	const entries = stats.enhancedEntries;

	stats.sessionStart = (() => {
		currentSession = getCurrentSession() - 1;
		return entries.reduce((acc, val) => {
			if (val.session <= currentSession) {
				return val.sr;
			}
			return acc;
		}, null);
	})();
	stats.sessionCurrent = (() => {
		currentSession = getCurrentSession();
		return entries.reduce((acc, val) => {
			if (val.session == currentSession) {
				return val.sr;
			}
			return acc;
		}, null);
	})();
	stats.sessionWld = (() => {
		currentSession = getCurrentSession();
		return entries.reduce((acc, val) => {
			if (val.session == currentSession) {
				switch (val.wld) {
					case "Win":
						acc[0] += 1;
						break;
					case "Loss":
						acc[1] += 1;
						break;
					case "Draw":
						acc[2] += 1;
						break;
				}
			}
			return acc;
		}, [0, 0, 0]);
	})();

	if (stats.sessionCurrent == null) {
		stats.sessionStart = stats.currentSr;
		stats.sessionCurrent = stats.currentSr;
	}
	if (stats.sessionStart == null) {
		stats.sessionStart = 0;
	}
}

function addWld (entries) {
	entries.forEach((entry, i) => {
		const lastEntry = entries[i-1] || {}
		if (entry.wld == "default") {
			entry.wasDefault = true;
			if (entry.sr > (lastEntry.sr || 0) ) {
				entry.wld = "Win"
			}
			else if(entry.sr < lastEntry.sr ) {
				entry.wld = "Loss"
			} else {
				entry.wld = "Draw"
			}
			entry.diff = entry.sr - lastEntry.sr;
		} else {
			entry.diff = 0;
		}
	});
}

function getEnhancedEntries () {
	const roles = ["Tank", "DPS", "Support"];
	const entries = roles
		.reduce((acc, role) => {
			return [...acc, ...calcStats(role).enhancedEntries];
		}, [])
		.sort((a, b) => {
			if (a.sortId > b.sortId) return 1;
			if (b.sortId > a.sortId) return -1;
			return 0;
		});
	return entries;
}

function getCurrentSession () {
	return JSON.parse(JSON.stringify(items)).reduce((acc, val) => {
		return acc > parseInt(val.session, 10) ? acc : val.session;
	}, 0);
}

function getCurrentSeason () {
	return JSON.parse(JSON.stringify(items)).reduce((acc, val) => {
		return acc > parseInt(val.season, 10) ? acc : val.season;
	}, 0);
}

function getSessionStats () {
	const roles = ["Tank", "DPS", "Support"];
	const sessionStats = {
		start: [0, 0, 0],
		current: [0, 0, 0],
		gain: [0, 0, 0],
		wld: [0, 0, 0],
		sum: 0
	}
	roles.forEach((role, index) => {
		roleStats = calcStats(role);

		sessionStats.start[index] = roleStats.sessionStart;
		sessionStats.current[index] = roleStats.sessionCurrent;
		sessionStats.gain[index] = roleStats.sessionCurrent - roleStats.sessionStart;
		sessionStats.sum += parseFloat(sessionStats.gain[index]);
		sessionStats.wld[0] += roleStats.sessionWld[0];
		sessionStats.wld[1] += roleStats.sessionWld[1];
		sessionStats.wld[2] += roleStats.sessionWld[2];
	})
	
	return sessionStats;
}


function getSeasonStats () {
	const roles = ["Tank", "DPS", "Support"];
	const season = getCurrentSeason();
	const seasonStats = {
		srGain: [0, 0, 0],
		srLoss: [0, 0, 0],
		srWin: [0, 0, 0]
	}
	roles.forEach((role, index) => {
		roleStats = calcStats(role, season);

		seasonStats.srGain[index] = roleStats.srAvg || 0
		seasonStats.srGain[index] = seasonStats.srGain[index].toFixed(2);
		seasonStats.srLoss[index] = roleStats.srLoss || 0;
		seasonStats.srLoss[index] = seasonStats.srLoss[index].toFixed(2);
		seasonStats.srWin[index] = roleStats.srWin || 0;
		seasonStats.srWin[index] = seasonStats.srWin[index].toFixed(2);
	});
	
	return seasonStats;
}

function getEntries (role) {
	return JSON.parse(JSON.stringify(items))
		.map((item, index) => {
			item.sortId = index;
			return item;
		})
		.filter(item => {
			return item.role == role;
		});
}