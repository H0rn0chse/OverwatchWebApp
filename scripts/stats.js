function updateStats () {
	drawGroupedBarChart();
	updateTable();
	updateSession();
	//drawPieChart();
}

function updateSession () {
	const container = document.getElementById("session");
	container.innerHTML = "";

	const stats = getSessionStats();

	const heading = document.createElement("h2");
	container.appendChild(heading);
	heading.innerText = "aktuelle Session";

	const startRow = document.createElement("p");
	container.appendChild(startRow);
	const startAverage = Math.round(stats.start.reduce((acc, val) => { return acc += parseInt(val, 10)}, 0) / stats.start.length);
	startRow.innerHTML = `<b>Start:</b> T:${stats.start[0]}&nbsp;&nbsp;D:${stats.start[1]}&nbsp;&nbsp;S:${stats.start[2]}&nbsp;&nbsp;(${startAverage})`;

	const currentRow = document.createElement("p");
	container.appendChild(currentRow);
	const currentAverage = Math.round(stats.current.reduce((acc, val) => { return acc += parseInt(val, 10)}, 0) / stats.current.length);
	currentRow.innerHTML = `<b>Aktuell:</b> T:${stats.current[0]}&nbsp;&nbsp;D:${stats.current[1]}&nbsp;&nbsp;S:${stats.current[2]}&nbsp;&nbsp;(${currentAverage})`;

	const standingsRow = document.createElement("p");
	container.appendChild(standingsRow);
	standingsRow.innerHTML = `<b>Ergebnis:</b> ${stats.wld[0]}W / ${stats.wld[1]}L / ${stats.wld[2]}D`;
}

function updateTable() {
	colors = {
		"Tank": "#4682B4",
		"DPS": "#FF7F50",
		"Support": "#ADFF2F",
	}
	const container = document.getElementById("stats");
	const table = container.querySelector("div.table");
	table.innerHTML = "";
	role = container.querySelector("select.role").value;

	const entries = getEnhancedEntries()
		.filter(item => {
			if (role == "All") {
				return true;
			}
			return item.role == role;
		});
	const count = entries.length < 10 ? entries.length : 10;

	const lastEntries = entries.splice(entries.length-count, count);
	lastEntries.forEach(entry => {
		let row = document.createElement("p");
		table.appendChild(row);
		const dSpan = document.createElement("span");
		row.appendChild(dSpan);
		dSpan.innerText = entry.diff;
		dSpan.style.width = "30px";
		dSpan.style.display = "inline-block";
		dSpan.style.textAlign = "right";
		const rSpan = document.createElement("span");
		row.appendChild(rSpan);
		rSpan.innerText = entry.role;
		rSpan.style.width = "70px";
		rSpan.style.display = "inline-block";
		rSpan.style.marginLeft = "5px";
		const cSpan = document.createElement("span");
		row.appendChild(cSpan);
		cSpan.style.width = "20px";
		cSpan.style.height = "20px";
		cSpan.style.display = "inline-block";
		cSpan.style.backgroundColor = "rgb(70, 130, 180)";
		cSpan.style.marginLeft = "5px";
		cSpan.style.position = "relative";
		cSpan.style.top = "5px";
		cSpan.style.backgroundColor = colors[entry.role];
	});
}

function drawGroupedBarChart () {
	document.querySelector("#winRate").innerHTML = "";
	const roles = ["Tank", "DPS", "Support"];
	let data = [
		{"groupSize": "Overall", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "1", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "2", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "3", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "4", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "5", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "6", "Tank": 0, "DPS": 0, "Support": 0}
	]
	data.columns = ["groupSize", "Tank", "DPS", "Support"];
	data.colors = {
		"Tank": "#4682B4",
		"DPS": "#FF7F50",
		"Support": "#ADFF2F",
	};
	data.y = "Winrate"
	roles.forEach(role => {
		let stats = calcStats(role);
		data[0][role] = stats.winRate * 100 || 0;
		data[1][role] = stats.winRateGroup[1] * 100 || 0;
		data[2][role] = stats.winRateGroup[2] * 100 || 0;
		data[3][role] = stats.winRateGroup[3] * 100 || 0;
		data[4][role] = stats.winRateGroup[4] * 100 || 0;
		data[5][role] = stats.winRateGroup[5] * 100 || 0;
		data[6][role] = stats.winRateGroup[6] * 100 || 0;
	});

	let node = GroupedBarChart(data, 50, 500, 200);
	node.style.width = "500px";
	node.style.height = "200px";
	document.querySelector("#winRate").appendChild(node);

	data = [
		{"groupSize": "Overall", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "1", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "2", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "3", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "4", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "5", "Tank": 0, "DPS": 0, "Support": 0},
		{"groupSize": "6", "Tank": 0, "DPS": 0, "Support": 0}
	]
	data.columns = ["groupSize", "Tank", "DPS", "Support"];
	data.colors = {
		"Tank": "#4682B4",
		"DPS": "#FF7F50",
		"Support": "#ADFF2F",
	};
	data.y = "gamesPlayed"
	roles.forEach(role => {
		let stats = calcStats(role);
		data[0][role] = stats.gamesPlayed;
		data[1][role] = stats.gamesPlayedGroup[0];
		data[2][role] = stats.gamesPlayedGroup[1];
		data[3][role] = stats.gamesPlayedGroup[2];
		data[4][role] = stats.gamesPlayedGroup[3];
		data[5][role] = stats.gamesPlayedGroup[4];
		data[6][role] = stats.gamesPlayedGroup[5];
	});
	node = GroupedBarChart(data, 0, 500, 200);
	node.style.width = "500px";
	node.style.height = "200px";
	document.querySelector("#winRate").appendChild(node);
}

function drawPieChart () {
	const roles = ["Tank", "DPS", "Support"];
	roles.forEach(role => {
		const row = document.createElement("p");
		document.querySelector("#winRate").appendChild(row);
		let caption = document.createElement("span");
		row.appendChild(caption)
		caption.style.width = "100px";
		caption.style.display = "inline-block";
		caption.innerText = role;

		const stats = calcStats(role);

		for (let i = 0; i < 6; i++) {
			let data = [
				{
					name: "win",
					value: stats.winGroup[i],
					color: "#006400"
				},
				{
					name: "loss",
					value: stats.lossGroup[i],
					color: "#FF0000"
				},
				{
					name: "draw",
					value: stats.drawGroup[i],
					color: "#FFDAB9"
				}
			];
			data = data.filter(item => {return item.value != 0;})
			var node = PieChart(data, 100);
			node.style.width = "100px";
			caption = document.createElement("span");
			row.appendChild(caption)
			caption.innerText = i + 1;
			row.appendChild(node);
		}
	});
}

function calcStats (role) {
	const entries = getEntries(role);
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
			acc[val.size - 1] += 1;
			return acc;
		}, [0, 0, 0, 0, 0, 0]),
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
				acc[val.size - 1] += 1;
			}
			return acc;
		}, [0, 0, 0, 0, 0, 0]),
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
		1: stats.winGroup[0] / stats.gamesPlayedGroup[0] || 0,
		2: stats.winGroup[1] / stats.gamesPlayedGroup[1] || 0,
		3: stats.winGroup[2] / stats.gamesPlayedGroup[2] || 0,
		4: stats.winGroup[3] / stats.gamesPlayedGroup[3] || 0,
		5: stats.winGroup[4] / stats.gamesPlayedGroup[4] || 0,
		6: stats.winGroup[5] / stats.gamesPlayedGroup[5] || 0
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