import { mergeChartJsData, sort } from "../utils.js";
const { Vue, Vuex, VueChartJs, _ } = globalThis;
const { mapState } = Vuex;
const PROGRESS_ENTRY_LENGTH = 20;
export const ChartSrProgress = Vue.component("chart-sr-progress", {
    extends: VueChartJs.Line,
    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    position: "left",
                    display: true,
                    text: "Skill Rating",
                },
            }
        };
    },
    computed: Object.assign(Object.assign({}, mapState([
        "roles",
        "colors",
        "stats",
        "theme",
    ])), { datasetData() {
            return this.roles.map((role, index) => {
                const setData = new Array(PROGRESS_ENTRY_LENGTH).fill(0);
                const roleStats = this.stats[role];
                const entries = roleStats.enhancedEntries
                    .filter(item => {
                    return item.sr > 0;
                })
                    .sort(sort("DESC", "sortId"))
                    .reduce((acc, item) => {
                    if (acc.maxLength === 0) {
                        return acc;
                    }
                    acc.items.push(item);
                    acc.maxLength -= 1;
                    return acc;
                }, { items: [], maxLength: PROGRESS_ENTRY_LENGTH }).items
                    .sort(sort("ASC", "sortId"));
                for (let i = 0; i < PROGRESS_ENTRY_LENGTH; i++) {
                    setData[i] = entries[i] && entries[i].sr || null;
                }
                return setData;
            });
        },
        chartData() {
            return {
                labels: new Array(PROGRESS_ENTRY_LENGTH).fill(""),
                datasets: this.roles.map((role, index) => {
                    return {
                        label: role,
                        borderColor: this.colors[role],
                        fill: false,
                        data: this.datasetData[index],
                    };
                })
            };
        } }),
    watch: {
        stats: function (newStats, oldStats) {
            mergeChartJsData(this.$data._chart.data, this.chartData);
            this.$data._chart.update();
        },
        theme: function (newTheme, oldTheme) {
            this.$data._chart.update();
        },
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});
