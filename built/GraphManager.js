import { COLORS, ROLES } from "./Constants.js";
import { calcStats } from "./stats.js";
const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
const PROGRESS_ENTRY_LENGTH = 20;
function setChartColorScheme(evt) {
    Chart.defaults.global.defaultFontColor = getComputedStyle(document.body).getPropertyValue('--color');
    if (GamesChart) {
        GamesChart.update();
    }
    if (WinRateChart) {
        WinRateChart.update();
    }
    if (ProgressChart) {
        ProgressChart.update();
    }
    return false;
}
colorSchemeQueryList.addEventListener("change", setChartColorScheme);
var GamesChart = null;
var WinRateChart = null;
var ProgressChart = null;
/**
 * To be called initially to create charts and references
 */
export function initCharts() {
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
    WinRateChart = new Chart(document.getElementById("ctxWinRate"), {
        type: 'bar',
        data: data,
        options: {
            scales: {
                yAxes: [{
                        ticks: {
                            max: 50,
                            min: -50,
                            callback: function (value, index, values) {
                                const val = typeof value == "string" ? 0 : value;
                                return `${val + 50}%`;
                            }
                        }
                    }]
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
                        if (label) {
                            label += ': ';
                        }
                        const val = typeof tooltipItem.yLabel == "string" ? 0 : tooltipItem.yLabel;
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
    GamesChart = new Chart(document.getElementById("ctxGames"), {
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
    ProgressChart = new Chart(document.getElementById("ctxProgress"), {
        type: 'line',
        data: data,
        options: {}
    });
}
/**
 * Updates both charts with new data inplace
 */
export function updateCharts() {
    const season = document.querySelector("select.season").value;
    const stats = ROLES.reduce((acc, role) => {
        acc[role] = calcStats(role, season);
        return acc;
    }, {});
    let datasets = WinRateChart.data.datasets;
    ROLES.forEach((role, index) => {
        const set = datasets[index];
        const roleStats = stats[role];
        set.data[0] = roleStats.gamesPlayed ? roleStats.winRate * 100 - 50 : 0;
        set.data[1] = roleStats.gamesPlayedGroup[1] ? roleStats.winRateGroup[1] * 100 - 50 : 0;
        set.data[2] = roleStats.gamesPlayedGroup[2] ? roleStats.winRateGroup[2] * 100 - 50 : 0;
        set.data[3] = roleStats.gamesPlayedGroup[3] ? roleStats.winRateGroup[3] * 100 - 50 : 0;
        set.data[4] = roleStats.gamesPlayedGroup[4] ? roleStats.winRateGroup[4] * 100 - 50 : 0;
        set.data[5] = roleStats.gamesPlayedGroup[5] ? roleStats.winRateGroup[5] * 100 - 50 : 0;
        set.data[6] = roleStats.gamesPlayedGroup[6] ? roleStats.winRateGroup[6] * 100 - 50 : 0;
    });
    WinRateChart.update();
    datasets = GamesChart.data.datasets;
    ROLES.forEach((role, index) => {
        const set = datasets[index];
        const roleStats = stats[role];
        set.data[0] = roleStats.gamesPlayed;
        set.data[1] = roleStats.gamesPlayedGroup[1];
        set.data[2] = roleStats.gamesPlayedGroup[2];
        set.data[3] = roleStats.gamesPlayedGroup[3];
        set.data[4] = roleStats.gamesPlayedGroup[4];
        set.data[5] = roleStats.gamesPlayedGroup[5];
        set.data[6] = roleStats.gamesPlayedGroup[6];
    });
    GamesChart.update();
    datasets = ProgressChart.data.datasets;
    ROLES.forEach((role, index) => {
        const set = datasets[index];
        const roleStats = stats[role];
        const entries = roleStats.enhancedEntries
            .filter(item => {
            return item.sr > 0;
        })
            .reduce((acc, item) => {
            if (acc.maxLength === 0) {
                return acc;
            }
            acc.items.push(item.sr);
            return acc;
        }, { items: [], maxLength: PROGRESS_ENTRY_LENGTH }).items;
        for (let i = 0; i < PROGRESS_ENTRY_LENGTH; i++) {
            set.data[i] = entries[i] || null;
        }
    });
    ProgressChart.update();
}
