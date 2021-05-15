import { mergeChartJsData } from "../utils.js";
const { Vue, Vuex, VueChartJs, _ } = globalThis;
const { mapState } = Vuex;
const PROGRESS_ENTRY_LENGTH = 100;
export const ChartSrProgressAll = Vue.component("chart-sr-progress-all", {
    extends: VueChartJs.Line,
    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    position: "left",
                    display: true,
                    text: `Skill Rating`
                },
                elements: {
                    point: {
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
        };
    },
    computed: Object.assign(Object.assign({}, mapState([
        "roles",
        "colors",
        "stats",
    ])), { datasetData() {
            return this.roles.map((role, index) => {
                let buckets = new Array(100).fill(0);
                const roleStats = this.stats[role];
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
                }
                else if (bucketSize < 1) {
                    buckets = buckets.map((value, index) => {
                        const entryIndex = Math.floor(index * bucketSize);
                        return entries[entryIndex];
                    });
                }
                return buckets;
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
        }
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});
