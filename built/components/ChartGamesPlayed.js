import { mergeChartJsData } from "../utils.js";
const { Vue, Vuex, VueChartJs, _ } = globalThis;
const { mapState } = Vuex;
export const ChartGamesPlayed = Vue.component("chart-games-played", {
    extends: VueChartJs.Bar,
    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                setData[0] = roleStats.gamesPlayed;
                setData[1] = roleStats.gamesPlayedGroup[1];
                setData[2] = roleStats.gamesPlayedGroup[2];
                setData[3] = roleStats.gamesPlayedGroup[3];
                setData[4] = roleStats.gamesPlayedGroup[4];
                setData[5] = roleStats.gamesPlayedGroup[5];
                setData[6] = roleStats.gamesPlayedGroup[6];
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
                        data: this.datasetData[index]
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
