import { appState } from "../AppState.js";
const { Vue, Vuex } = globalThis;
const { Button, ThemeHandler } = globalThis.darkModeToggle;
const { mapState, mapActions } = Vuex;
export const ChartOptions = Vue.component("chart-options", {
    template: `
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
            <div class="ml-1" ref="toggleButton">
            </div>
        </div>
    `,
    props: [],
    computed: Object.assign(Object.assign({}, mapState([
        "selectedSeason",
        "seasons",
        "selectedChartOption",
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
        } }),
    data() {
        return {
            options: [
                { text: "All", value: "all" },
                { text: "Last 20 Games", value: "lastGames" },
            ]
        };
    },
    mounted() {
        appState.commit("setTheme", { theme: ThemeHandler.getTheme() });
        const button = new Button(this.$refs.toggleButton, { height: 38 });
        ThemeHandler.on("themeLoaded", (evt) => {
            appState.commit("setTheme", { theme: evt.theme });
        });
    },
    methods: Object.assign({}, mapActions([
        "selectSeason",
        "selectChartOption"
    ]))
});
