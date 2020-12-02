var items;
window.addEventListener("load", () => {
	items = JSON.parse(localStorage.getItem("items"));
	drawCharts();
	setChartColorScheme(colorSchemeQueryList);
	rebuildTable()
	updateStats();
	window.dirtyState = false;
});

window.addEventListener("beforeunload", (event) => {
	if (!getIgnoreDirtyState() && window.dirtyState) {
		var message = 'You may export the latest changes';
		event.returnValue = message;
		return message;
	}
});

const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');

function setChartColorScheme (evt) {
	Chart.defaults.global.defaultFontColor = getComputedStyle(document.body).getPropertyValue('--color');

	if (GamesChart) {
		GamesChart.update();
	}
	if (WinRateChart) {
		WinRateChart.update();
	}
	return false;
}
colorSchemeQueryList.addListener(setChartColorScheme);

var GamesChart = null;
var WinRateChart = null;

function rebuildTable () {
	// clear table
	document.querySelector("#entries tbody").innerHTML = "";

	if (!items) {
		items = [];
		addRow();
	} else {
		items.forEach(item => {
			addRow(item);
		});
	}
}

function updateItems (importedItems) {
	items = importedItems;
	saveItems();
	rebuildTable()
}

function saveItems () {
	window.dirtyState = true;
	localStorage.setItem("items", JSON.stringify(items));
	updateStats();
}

function updateStats () {
	updateSeasonSelect();
	drawGroupedBarChart();
	updateTable();
	updateSeason();
	updateSession();
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

	elem = document.createElement("h2");
	container.appendChild(elem);
	elem.innerText = "aktuelle Session";

	elem = document.createElement("p");
	container.appendChild(elem);
	elem.innerHTML = `<b>SR:</b> T:${stats.gain[0]}&nbsp;&nbsp;D:${stats.gain[1]}&nbsp;&nbsp;S:${stats.gain[2]}&nbsp;&nbsp;(${stats.sum})`;

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

/**
 * To be called initially to create charts and references
 */
function drawCharts () {
	const colors = {
		Tank: "#4682B4",
		DPS: "#FF7F50",
		Support: "#ADFF2F",
	};

	let data = {
		labels: ["Avg", "1", "2", "3", "4", "5", "6"],
		datasets: ["Tank", "DPS", "Support"].map(group => {
			return {
				label: group,
				backgroundColor: colors[group],
				data: [0, 0, 0, 0, 0, 0, 0]
			};
		})
	};

	WinRateChart = new Chart(document.getElementById("ctxWinRate"), {
		type: 'bar',
		data: data,
		options: {
			barValueSpacing: 20,
			scales: {
				yAxes: [{
					ticks: {
						max: 50,
						min: -50,
						callback: function(value, index, values) {
							return `${value + 50}%`;
						}
					}
				}]
			},
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						var label = data.datasets[tooltipItem.datasetIndex].label || '';

						if (label) {
							label += ': ';
						}
						label += (tooltipItem.yLabel + 50).toFixed(2);
						return label;
					}
				}
			},
			title: {
				position: "left",
				display: true,
				text: 'Winrate'
			}
		}
	});

	data = {
		labels: ["Avg", "1", "2", "3", "4", "5", "6"],
		datasets: ["Tank", "DPS", "Support"].map(group => {
			return {
				label: group,
				backgroundColor: colors[group],
				data: [0, 0, 0, 0, 0, 0, 0]
			};
		})
	};

	GamesChart = new Chart(document.getElementById("ctxGames"), {
		type: 'bar',
		data: data,
		options: {
			barValueSpacing: 20,
			scales: {
				yAxes: [{
					ticks: {
						min: 0,
						stepSize: 1
					}
				}]
			},
			title: {
				position: "left",
				display: true,
				text: 'Games played'
			}
		}
	});
}


/**
 * Updates both charts with new data inplace
 */
function drawGroupedBarChart () {
	const season = document.querySelector("select.season").value;
	const roles = ["Tank", "DPS", "Support"];

	let datasets = WinRateChart.data.datasets;
	roles.forEach((role, index) => {
		const set = datasets[index];
		const stats = calcStats(role, season);
		set.data[0] = stats.gamesPlayed ? stats.winRate * 100 - 50 : 0;
		set.data[1] = stats.gamesPlayedGroup[1] ? stats.winRateGroup[1] * 100 - 50 : 0;
		set.data[2] = stats.gamesPlayedGroup[2] ? stats.winRateGroup[2] * 100 - 50 : 0;
		set.data[3] = stats.gamesPlayedGroup[3] ? stats.winRateGroup[3] * 100 - 50 : 0;
		set.data[4] = stats.gamesPlayedGroup[4] ? stats.winRateGroup[4] * 100 - 50 : 0;
		set.data[5] = stats.gamesPlayedGroup[5] ? stats.winRateGroup[5] * 100 - 50 : 0;
		set.data[6] = stats.gamesPlayedGroup[6] ? stats.winRateGroup[6] * 100 - 50 : 0;
	});

	WinRateChart.update()

	datasets = GamesChart.data.datasets;
	roles.forEach((role, index) => {
		const set = datasets[index];
		const stats = calcStats(role, season);
		set.data[0] = stats.gamesPlayed;
		set.data[1] = stats.gamesPlayedGroup[1];
		set.data[2] = stats.gamesPlayedGroup[2];
		set.data[3] = stats.gamesPlayedGroup[3];
		set.data[4] = stats.gamesPlayedGroup[4];
		set.data[5] = stats.gamesPlayedGroup[5];
		set.data[6] = stats.gamesPlayedGroup[6];
	});

	GamesChart.update();
}
