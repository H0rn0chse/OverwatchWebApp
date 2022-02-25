const { Vue, Vuex } = globalThis;
const { mapState, mapActions } = Vuex;
export const ChartOptions = Vue.component("chart-options", {
    template: `
        <div class="d-flex flex-column">
            <div class="d-flex flex-row align-items-center">
                <div class="pr-3">
                    Season:
                </div>
                <b-form-select
                    v-model="selectedSeasonLocal"
                    :options="seasons"
                />
                <div  class="px-3">
                    SR&nbsp;Progress:
                </div>
                <b-form-select
                    v-model="selectedChartOptionLocal"
                    :options="options"
                    style="min-width: 9em;"
                />
                <dark-mode-toggle
                    height="38"
                />
            </div>
            <div class="d-flex flex-row align-items-center">
                <div class="pr-3">
                    Last Items <small><i>(0=All)</i></small>:
                </div>
                <b-form-input
                    min=0
                    type=number
                    v-model="lastCountLocal"
                    style="max-width: 5em;"
                    lazy
                />
            </div>
        </div>
    `,
    props: [],
    computed: Object.assign(Object.assign({}, mapState([
        "selectedSeason",
        "seasons",
        "selectedChartOption",
        "lastCount"
    ])), { selectedSeasonLocal: {
            get() {
                return this.selectedSeason;
            },
            set(newSeason) {
                this.selectSeason(newSeason);
            }
        }, selectedChartOptionLocal: {
            get() {
                return this.selectedChartOption;
            },
            set(newOption) {
                this.selectChartOption(newOption);
            }
        }, lastCountLocal: {
            get() {
                return this.lastCount;
            },
            set(newCount) {
                this.setLastCount(newCount);
            }
        } }),
    data() {
        return {
            options: [
                { text: "All", value: "all" },
                { text: "Last 20 Games", value: "lastGames" },
            ]
        };
    },
    methods: Object.assign({}, mapActions([
        "selectSeason",
        "selectChartOption",
        "setLastCount"
    ]))
});
