import { COLORS, ROLES } from "./Constants.js";
import { calcStats } from "./stats.js";

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
colorSchemeQueryList.addEventListener("change", setChartColorScheme);

var GamesChart = null;
var WinRateChart = null;

/**
 * To be called initially to create charts and references
 */
export function initCharts () {

    setChartColorScheme(colorSchemeQueryList);

	let data = {
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
}


/**
 * Updates both charts with new data inplace
 */
export function drawGroupedBarChart () {
	const season = document.querySelector<HTMLInputElement>("select.season").value;

	let datasets = WinRateChart.data.datasets;
	ROLES.forEach((role, index) => {
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
	ROLES.forEach((role, index) => {
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