import { mergeChartJsData } from "../utils.js";
const { Vue, Vuex, VueChartJs, _ } = globalThis;
const { mapState } = Vuex;
export const ChartWinRate = Vue.component("chart-win-rate", {
    extends: VueChartJs.Bar,
    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                            ticks: {
                                max: 50,
                                min: -50,
                                callback: function (value, index, values) {
                                    const val = typeof value == "string" ? 0 : value;
                                    return `${val + 50}%`;
                                },
                            },
                        }],
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
                        },
                    },
                },
                title: {
                    position: "left",
                    display: true,
                    text: "Winrate",
                },
            }
        };
    },
    computed: Object.assign(Object.assign({}, mapState([
        "roles",
        "colors",
        "stats",
    ])), { datasetData() {
            return this.roles.map((role, index) => {
                const setData = [0, 0, 0, 0, 0, 0, 0];
                const roleStats = this.stats[role];
                setData[0] = roleStats.gamesPlayed ? roleStats.winRate * 100 - 50 : 0;
                setData[1] = roleStats.gamesPlayedGroup[1] ? roleStats.winRateGroup[1] * 100 - 50 : 0;
                setData[2] = roleStats.gamesPlayedGroup[2] ? roleStats.winRateGroup[2] * 100 - 50 : 0;
                setData[3] = roleStats.gamesPlayedGroup[3] ? roleStats.winRateGroup[3] * 100 - 50 : 0;
                setData[4] = roleStats.gamesPlayedGroup[4] ? roleStats.winRateGroup[4] * 100 - 50 : 0;
                setData[5] = roleStats.gamesPlayedGroup[5] ? roleStats.winRateGroup[5] * 100 - 50 : 0;
                setData[6] = roleStats.gamesPlayedGroup[6] ? roleStats.winRateGroup[6] * 100 - 50 : 0;
                return setData;
            });
        },
        chartData() {
            return {
                labels: ["Avg", "1", "2", "3", "4", "5", "6"],
                datasets: this.roles.map((role, index) => {
                    return {
                        label: role,
                        backgroundColor: this.colors[role],
                        data: this.datasetData[index],
                    };
                })
            };
        } }),
    watch: {
        stats: function (newStats, oldStats) {
            mergeChartJsData(this.$data._chart.data, this.chartData);
            this.$data._chart.update();
        }
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});
