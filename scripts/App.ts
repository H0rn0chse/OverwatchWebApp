import { GameList } from "./components/GameList.js";
import { CompactStats } from "./components/CompactStats.js";
import { LastGames } from "./components/LastGames.js";
import { appState } from "./AppState.js";
import { ChartGamesPlayed } from "./components/ChartGamesPlayed.js";
import { ChartSrProgress } from "./components/ChartSrProgress.js";
import { ChartSrProgressAll } from "./components/ChartSrProgressAll.js";
import { ChartWinRate } from "./components/ChartWinRate.js";
import { ChartOptions } from "./components/ChartOptions.js";
import { ImportExportCard } from "./components/ImportExportCard.js";
import { getDirtyState } from "./DirtyState.js";

const { Vue, Vuex } = (globalThis as any);

const { mapState } = Vuex;

const componentList = [
    GameList,
    CompactStats,
    LastGames,
    ChartGamesPlayed,
    ChartSrProgress,
    ChartSrProgressAll,
    ChartWinRate,
    ChartOptions,
    ImportExportCard,
];

window.addEventListener("beforeunload", (event) => {
    if (getDirtyState()) {
        var message = 'You may export the latest changes';
        event.returnValue = message;
        return message;
    }
});

const app = new Vue({
    el: "#app",
    template: `
        <b-container
            id="app"
            fluid
            class="w-100 h-100"
        >
            <b-row
                align-v="stretch"
                class="h-100 p-3"
            >
                <b-col class="d-flex flex-column">
                    <b-row align-v="stretch">
                        <b-col>
                            <compact-stats/>
                        </b-col>
                    </b-row>
                    <b-row align-v="stretch" class="flex-grow-1">
                        <b-col class="d-flex flex-column justify-content-end">
                            <game-list class="pr-3"/>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col
                    cols="2"
                    class="d-flex flex-column justify-content-between"
                >
                    <last-games/>
                    <import-export-card/>
                </b-col>
                <b-col
                    class="h-100 d-flex flex-column"
                    style="overflow:hidden;"
                >
                    <b-row class="w-100 justify-content-center">
                        <chart-options/>
                    </b-row>
                    <b-row>
                        <b-col class="p-3">
                            <chart-win-rate
                                class="position-relative m-auto"
                                style="height:calc((100vh - 170px) / 3); width:80%"
                            />
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="p-3">
                            <chart-games-played
                                class="position-relative m-auto"
                                style="height:calc((100vh - 170px) / 3); width:80%"
                            />
                        </b-col>
                    </b-row>
                    <b-row v-if="selectedChartOption === 'lastGames'">
                        <b-col class="p-3">
                            <chart-sr-progress
                                class="position-relative m-auto"
                                style="height:calc((100vh - 170px) / 3); width:80%"
                            />
                        </b-col>
                    </b-row>
                    <b-row v-if="selectedChartOption === 'all'">
                        <b-col class="p-3">
                            <chart-sr-progress-all
                                class="position-relative m-auto"
                                style="height:calc((100vh - 170px) / 3); width:80%"
                            />
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    `,
    store: appState,
    computed: {
        ...mapState([
            "selectedChartOption"
        ]),
    }
});


