function calcStats (role, season = "All") {
	let entries = getEntries(role);
	if (season != "All") {
		entries = entries.filter(e => {
			return e.season == season
		});
	}
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
	const stats = {
		enhancedEntries: entries,
		gamesPlayed: entries.length,
		gamesPlayedGroup: entries.reduce((acc, val) => {
			acc[val.size] += 1;
			return acc;
		}, [null, 0, 0, 0, 0, 0, 0]),
		placementSR: entries.reduce((acc, val) => {
			if (acc) {
				return acc;
			}
			if (val.sr > 0) {
				return val.sr;
			}
		}, null),
		seasonHigh: entries.reduce((acc, val) => {
			return val.sr > acc ? val.sr : acc;
		}, 0),
		seasonLow: entries.reduce((acc, val) => {
			return val.sr < acc && val.sr > 0 ? val.sr : acc;
		}, 5000),
		win: entries.reduce((acc, val) => {
			if (val.wld == "Win") {
				acc += 1;
			}
			return acc;
		}, 0),
		winGroup: entries.reduce((acc, val) => {
			if (val.wld == "Win") {
				acc[val.size] += 1;
			}
			return acc;
		}, [null, 0, 0, 0, 0, 0, 0]),
		loss: entries.reduce((acc, val) => {
			if (val.wld == "Loss") {
				acc += 1;
			}
			return acc;
		}, 0),
		lossGroup: entries.reduce((acc, val) => {
			if (val.wld == "Loss") {
				acc[val.size - 1] += 1;
			}
			return acc;
		}, [0, 0, 0, 0, 0, 0]),
		draw: entries.reduce((acc, val) => {
			if (val.wld == "Draw") {
				acc += 1;
			}
			return acc;
		}, 0),
		drawGroup: entries.reduce((acc, val) => {
			if (val.wld == "Draw") {
				acc[val.size - 1] += 1;
			}
			return acc;
		}, [0, 0, 0, 0, 0, 0]),
		winStreak: entries.reduce((acc, val) => {
			if (val.wld == "Win") {
				acc[0] += 1
			} else {
				acc[0] = 0;
			}
			if (acc[0] > acc[1]) {
				acc[1] = acc[0];
			}
			return acc;
		}, [0, 0])[1],
		lossStreak: entries.reduce((acc, val) => {
			if (val.wld == "Loss") {
				acc[0] += 1
			} else {
				acc[0] = 0;
			}
			if (acc[0] > acc[1]) {
				acc[1] = acc[0];
			}
			return acc;
		}, [0, 0])[1],
		sessionStart: (() => {
			currentSession = getCurrentSession() - 1;
			return entries.reduce((acc, val) => {
				if (val.session <= currentSession) {
					return val.sr;
				}
				return acc;
			}, null);
		})(),
		sessionCurrent: (() => {
			currentSession = getCurrentSession();
			return entries.reduce((acc, val) => {
				if (val.session == currentSession) {
					return val.sr;
				}
				return acc;
			}, null);
		})(),
		sessionWld: (() => {
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
		})()
	}
	const lastEntry = entries[entries.length - 1] || {};
	stats.currentSr = lastEntry.sr || 0;
	stats.srGain = stats.currentSr - stats.placementSR;
	stats.winRate = stats.win / stats.gamesPlayed;
	stats.winRateGroup = {
		1: stats.winGroup[1] / (stats.gamesPlayedGroup[1] - stats.drawGroup[1]) || 0,
		2: stats.winGroup[2] / (stats.gamesPlayedGroup[2] - stats.drawGroup[2]) || 0,
		3: stats.winGroup[3] / (stats.gamesPlayedGroup[3] - stats.drawGroup[3]) || 0,
		4: stats.winGroup[4] / (stats.gamesPlayedGroup[4] - stats.drawGroup[4]) || 0,
		5: stats.winGroup[5] / (stats.gamesPlayedGroup[5] - stats.drawGroup[5]) || 0,
		6: stats.winGroup[6] / (stats.gamesPlayedGroup[6] - stats.drawGroup[6]) || 0,
	}
	stats.lossSr = entries.reduce((acc, val) => {
		if (val.wld == "Loss" && val.diff != 0) {
			acc[0] += val.diff;
			acc[1] += 1;
		}
		return acc;
	}, [0, 0])
	stats.lossSr = stats.lossSr[0] / stats.lossSr[1];
	stats.winSr = entries.reduce((acc, val) => {
		if (val.wld == "Win" && val.diff != 0) {
			acc[0] += val.diff;
			acc[1] += 1;
		}
		return acc;
	}, [0, 0]);
	stats.winSr = stats.winSr[0] / stats.winSr[1];
	stats.avgSr = entries.reduce((acc, val) => {
		if (val.wasDefault) {
			acc[0] += val.diff;
			acc[1] += 1;
		}
		return acc;
	}, [0, 0]);
	stats.avgSr = stats.avgSr[0] / stats.avgSr[1];

	if (stats.sessionCurrent == null) {
		stats.sessionStart = stats.currentSr;
		stats.sessionCurrent = stats.currentSr;
	}
	if (stats.sessionStart == null) {
		stats.sessionStart = 0;
	}

	return stats;
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

function getSessionStats () {
	const roles = ["Tank", "DPS", "Support"];
	const sessionStats = {
		start: [0, 0, 0],
		current: [0, 0, 0],
		wld: [0, 0, 0]
	}
	roles.forEach((role, index) => {
		roleStats = calcStats(role);

		sessionStats.start[index] = roleStats.sessionStart;
		sessionStats.current[index] = roleStats.sessionCurrent;
		sessionStats.wld[0] += roleStats.sessionWld[0];
		sessionStats.wld[1] += roleStats.sessionWld[1];
		sessionStats.wld[2] += roleStats.sessionWld[2];
	})
	
	return sessionStats;
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