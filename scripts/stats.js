function updateStats () {
	drawGroupedBarChart();
	//drawPieChart();
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
		data[0][role] = stats.winRate * 100;
		data[1][role] = stats.winRateGroup[1] * 100;
		data[2][role] = stats.winRateGroup[2] * 100;
		data[3][role] = stats.winRateGroup[3] * 100;
		data[4][role] = stats.winRateGroup[4] * 100;
		data[5][role] = stats.winRateGroup[5] * 100;
		data[6][role] = stats.winRateGroup[6] * 100;
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
			if (val.sr > acc) {
				return val.sr;
			}
			return acc;
		}, 0),
		seasonLow: entries.reduce((acc, val) => {
			if (val.sr < acc && val.sr > 0) {
				return val.sr;
			}
			return acc;
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
		}, [0, 0])[1]
	}
	stats.currentSr = entries[entries.length - 1].sr;
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

	return stats;
}

function getEntries (role) {
	return JSON.parse(JSON.stringify(items)).filter(item => {
		return item.role == role;
	});
}