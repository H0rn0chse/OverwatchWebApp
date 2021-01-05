import { COLORS, ROLES } from "./Constants.js";
import { getItems } from "./ItemManager.js";
import { calcStats } from "./stats.js";
import { Stats } from "./types.js";
import { sort } from "./utils.js";

const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
const PROGRESS_ENTRY_LENGTH = 20;

function setChartColorScheme (evt) {
	Chart.defaults.global.defaultFontColor = getComputedStyle(document.body).getPropertyValue('--color');

	if (GamesChart) {
		GamesChart.update();
	}
	if (WinRateChart) {
		WinRateChart.update();
	}
	if (ProgressChart1) {
		ProgressChart1.update();
	}
	if (ProgressChart2) {
		ProgressChart2.update();
	}
	return false;
}
colorSchemeQueryList.addEventListener("change", setChartColorScheme);

var GamesChart = null;
var WinRateChart = null;
var ProgressChart1 = null;
var ProgressChart2 = null;

/**
 * To be called initially to create charts and references
 */
export function initCharts () {

    setChartColorScheme(colorSchemeQueryList);

	let data: any = {
		labels: ["Avg", "1", "2", "3", "4", "5", "6"],
		datasets: ROLES.map(group => {
			return {
				label: group,
				backgroundColor: COLORS[group],
				data: [0, 0, 0, 0, 0, 0, 0]
			};
		})
	};

	WinRateChart = new Chart(<HTMLCanvasElement>document.getElementById("ctxWinRate"), {
		type: 'bar',
		data: data,
		options: {
			scales: {
				yAxes: [{
					ticks: {
						max: 50,
						min: -50,
						callback: function(value, index, values) {
							const val: number = typeof value == "string" ? 0 : value;
							return `${val + 50}%`;
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
						const val: number = typeof tooltipItem.yLabel == "string" ? 0 : tooltipItem.yLabel;
						label += (val + 50).toFixed(2);
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
		datasets: ROLES.map(group => {
			return {
				label: group,
				backgroundColor: COLORS[group],
				data: [0, 0, 0, 0, 0, 0, 0]
			};
		})
	};

	GamesChart = new Chart(<HTMLCanvasElement>document.getElementById("ctxGames"), {
		type: 'bar',
		data: data,
		options: {
			scales: {
				yAxes: [{
					ticks: {
						min: 0
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

	data = {
		labels: new Array(PROGRESS_ENTRY_LENGTH).fill(""),
		datasets: ROLES.map(group => {
			return {
				label: group,
				borderColor: COLORS[group],
				fill: false,
				data: new Array(PROGRESS_ENTRY_LENGTH).fill(0)
			};
		})
	};

	ProgressChart1 = new Chart(<HTMLCanvasElement>document.getElementById("ctxProgress1"), {
		type: 'line',
		data: data,
		options: {
			title: {
				position: "left",
				display: true,
				text: `Skill Rating`
			}
		}
	});

	data = {
		labels: new Array(100).fill(""),
		datasets: ROLES.map(group => {
			return {
				label: group,
				borderColor: COLORS[group],
				fill: false,
				data: new Array(100).fill(0)
			};
		})
	};

	ProgressChart2 = new Chart(<HTMLCanvasElement>document.getElementById("ctxProgress2"), {
		type: 'line',
		data: data,
		options: {
			title: {
				position: "left",
				display: true,
				text: `Skill Rating`
			},
			elements: {
				point : {
					radius: 0
				}
			},
			scales: {
				xAxes: [{
					gridLines: {
						display: false
					}
				}]
			}
		}
	});
}

/**
 * Updates both charts with new data inplace
 */
export function updateCharts () {
	const season = document.querySelector<HTMLInputElement>("select.season").value;

	const stats = ROLES.reduce((acc, role) => {
		acc[role] = calcStats(role, season);
		return acc;
	}, {});

	let datasets = WinRateChart.data.datasets;
	ROLES.forEach((role, index) => {
		const set = datasets[index];
		const roleStats: Stats = stats[role];
		set.data[0] = roleStats.gamesPlayed ? roleStats.winRate * 100 - 50 : 0;
		set.data[1] = roleStats.gamesPlayedGroup[1] ? roleStats.winRateGroup[1] * 100 - 50 : 0;
		set.data[2] = roleStats.gamesPlayedGroup[2] ? roleStats.winRateGroup[2] * 100 - 50 : 0;
		set.data[3] = roleStats.gamesPlayedGroup[3] ? roleStats.winRateGroup[3] * 100 - 50 : 0;
		set.data[4] = roleStats.gamesPlayedGroup[4] ? roleStats.winRateGroup[4] * 100 - 50 : 0;
		set.data[5] = roleStats.gamesPlayedGroup[5] ? roleStats.winRateGroup[5] * 100 - 50 : 0;
		set.data[6] = roleStats.gamesPlayedGroup[6] ? roleStats.winRateGroup[6] * 100 - 50 : 0;
	});
	WinRateChart.update()

	datasets = GamesChart.data.datasets;
	ROLES.forEach((role, index) => {
		const set = datasets[index];
		const roleStats: Stats = stats[role];
		set.data[0] = roleStats.gamesPlayed;
		set.data[1] = roleStats.gamesPlayedGroup[1];
		set.data[2] = roleStats.gamesPlayedGroup[2];
		set.data[3] = roleStats.gamesPlayedGroup[3];
		set.data[4] = roleStats.gamesPlayedGroup[4];
		set.data[5] = roleStats.gamesPlayedGroup[5];
		set.data[6] = roleStats.gamesPlayedGroup[6];
	});
	GamesChart.update();

	datasets = ProgressChart1.data.datasets;
	ROLES.forEach((role, index) => {
		const set = datasets[index];
		const roleStats: Stats = stats[role];
		const entries = roleStats.enhancedEntries
			.filter(item => {
				return item.sr > 0;
			})
			.sort(sort("DESC", "sortId"))
			.reduce((acc, item) =>{
				if (acc.maxLength === 0) {
					return acc;
				}
				acc.items.push(item);
				acc.maxLength -= 1
				return acc;
			}, {items: [], maxLength: PROGRESS_ENTRY_LENGTH}).items
			.sort(sort("ASC", "sortId"));

		for (let i = 0; i < PROGRESS_ENTRY_LENGTH; i++) {
			set.data[i] = entries[i] && entries[i].sr || null;
		}
	});
	ProgressChart1.update();

	datasets = ProgressChart2.data.datasets;
	ROLES.forEach((role, index) => {
		let buckets = new Array(100).fill(0);

		const roleStats: Stats = stats[role];
		const entries = roleStats.enhancedEntries
			.filter(item => {
				return item.sr > 0;
			})
			.map(item => {
				return item.sr;
			});

		let bucketSize = entries.length / buckets.length;
		if (bucketSize > 1) {
			const bucketCount = Math.round(bucketSize);
			buckets = buckets.map((value, index) => {
				let sum = 0;
				for (let i = 0; i < bucketCount; i++) {
					const entryIndex = Math.round(index * bucketSize + i);
					sum += entries[entryIndex];
				}
				return Math.round(sum / bucketCount);
			});
		} else if (bucketSize < 1) {
			buckets = buckets.map((value, index) => {
				const entryIndex = Math.floor(index * bucketSize);
				return entries[entryIndex];
			});
		}

		const set = datasets[index];
		for (let i = 0; i < 100; i++) {
			set.data[i] = buckets[i] || null;
		}
	});
	ProgressChart2.update();
}