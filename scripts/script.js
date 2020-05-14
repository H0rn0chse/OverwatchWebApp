var items;
window.onload = () => {
	items = JSON.parse(localStorage.getItem("items"));
	if (!items) {
		items = [];
		addRow();
	} else {
		items.forEach(item => {
			addRow(item);
		});
	}
	
	updateStats();
}

function saveItems () {
	localStorage.setItem("items", JSON.stringify(items));
	updateStats();
}

function updateStats () {
	updateSeasonSelect();
	drawGroupedBarChart();
	updateTable();
	updateSeason();
	updateSession();
	//drawPieChart();
}

function updateSeasonStats () {
	drawGroupedBarChart();
}

function updateSeasonSelect () {
	const container = document.querySelector("select.season");
	container.innerHTML = "";

	const entries = getEnhancedEntries();
	let seasons = entries.map(e => e.season);
	seasons = [...new Set(seasons)]
	seasons.splice(0, 0, "All");

	seasons.forEach(s => {
		const option = document.createElement("option");
		container.appendChild(option);
		option.innerText = s == "All" ? s : "S" + s;
		option.setAttribute("value", s);
	});

	container.value = seasons[seasons.length - 1];
}

function updateSeason () {
	const container = document.getElementById("lastSeason");
	container.innerHTML = "";

	const stats = getSeasonStats();

	let elem;
	let avg;

	elem = document.createElement("h2");
	container.appendChild(elem);
	elem.innerText = "Season " + getCurrentSeason();

	elem = document.createElement("p");
	container.appendChild(elem);
	avg = avgArray(stats.srGain, 2);
	elem.innerHTML = `<b>Average SrGain:</b> T:${stats.srGain[0]}&nbsp;&nbsp;D:${stats.srGain[1]}&nbsp;&nbsp;S:${stats.srGain[2]}&nbsp;&nbsp;(${avg})`;

	elem = document.createElement("p");
	container.appendChild(elem);
	avg = avgArray(stats.srLoss, 2);
	elem.innerHTML = `<b>SrGain per Loss:</b> T:${stats.srLoss[0]}&nbsp;&nbsp;D:${stats.srLoss[1]}&nbsp;&nbsp;S:${stats.srLoss[2]}&nbsp;&nbsp;(${avg})`;

	elem = document.createElement("p");
	container.appendChild(elem);
	avg = avgArray(stats.srWin, 2);
	elem.innerHTML = `<b>SrGain per Win:</b> T:${stats.srWin[0]}&nbsp;&nbsp;D:${stats.srWin[1]}&nbsp;&nbsp;S:${stats.srWin[2]}&nbsp;&nbsp;(${avg})`;
}

function updateSession () {
	const container = document.getElementById("lastSession");
	container.innerHTML = "";

	const stats = getSessionStats();

	let elem;
	let avg;

	elem = document.createElement("h2");
	container.appendChild(elem);
	elem.innerText = "aktuelle Session";

	elem = document.createElement("p");
	container.appendChild(elem);
	avg = avgArray(stats.start);
	elem.innerHTML = `<b>Start:</b> T:${stats.start[0]}&nbsp;&nbsp;D:${stats.start[1]}&nbsp;&nbsp;S:${stats.start[2]}&nbsp;&nbsp;(${avg})`;

	elem = document.createElement("p");
	container.appendChild(elem);
	avg = avgArray(stats.current);
	elem.innerHTML = `<b>Aktuell:</b> T:${stats.current[0]}&nbsp;&nbsp;D:${stats.current[1]}&nbsp;&nbsp;S:${stats.current[2]}&nbsp;&nbsp;(${avg})`;

	elem = document.createElement("p");
	container.appendChild(elem);
	elem.innerHTML = `<b>Ergebnis:</b> ${stats.wld[0]}W / ${stats.wld[1]}L / ${stats.wld[2]}D`;
}

function updateTable () {
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
	document.getElementById("winRate").innerHTML = "";
	const season = document.querySelector("select.season").value;

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
		let stats = calcStats(role, season);
		data[0][role] = stats.gamesPlayed ? stats.winRate * 100 : null;
		data[1][role] = stats.gamesPlayedGroup[1] ? stats.winRateGroup[1] * 100 : null;
		data[2][role] = stats.gamesPlayedGroup[2] ? stats.winRateGroup[2] * 100 : null;
		data[3][role] = stats.gamesPlayedGroup[3] ? stats.winRateGroup[3] * 100 : null;
		data[4][role] = stats.gamesPlayedGroup[4] ? stats.winRateGroup[4] * 100 : null;
		data[5][role] = stats.gamesPlayedGroup[5] ? stats.winRateGroup[5] * 100 : null;
		data[6][role] = stats.gamesPlayedGroup[6] ? stats.winRateGroup[6] * 100 : null;
	});
	data.range = [0, 100];

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
		let stats = calcStats(role, season);
		data[0][role] = stats.gamesPlayed;
		data[1][role] = stats.gamesPlayedGroup[1];
		data[2][role] = stats.gamesPlayedGroup[2];
		data[3][role] = stats.gamesPlayedGroup[3];
		data[4][role] = stats.gamesPlayedGroup[4];
		data[5][role] = stats.gamesPlayedGroup[5];
		data[6][role] = stats.gamesPlayedGroup[6];
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
