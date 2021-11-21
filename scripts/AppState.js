import { COLORS, ROLES, SESSION_TIMEOUT } from "./Constants.js";
import { getItems, getLastUpdate, loadFromLocalStorage, saveItems, setItems } from "./ItemManager.js";
import { calcStats, getCareerStats, getCurrentSeason, getEnhancedEntries, getSeasonList, getSeasonStats, getSessionStats } from "./stats.js";
import { indexByProperty } from "./utils.js";
import { getIgnoreDirtyState, setDirtyState, setIgnoreDirtyState } from "./DirtyState.js";

const { Vuex, _ } = globalThis;
const { ThemeHandler } = globalThis.darkModeToggle;

loadFromLocalStorage();

export const appState = new Vuex.Store({
    state: {
        entries: getItems(),
        career: {},
        season: {},
        session: {},
        lastGames: [],
        colors: COLORS,
        roles: ROLES,
        seasons: [],
        selectedSeason: "All",
        stats: {},
        selectedChartOption: "all",
        ignoreDirtyState: getIgnoreDirtyState(),
        theme: "",
        lastCount: getOption("lastCount") ?? 0,
    },
    mutations: {
        updateAll (state) {
            state.entries = getItems();
            state.career = getCareerStats();
            state.season = getSeasonStats();
            state.seasons = getSeasonList();
            state.season.current = getCurrentSeason();
            state.session = getSessionStats();
            const lastGames = getEnhancedEntries();
            state.lastGames = lastGames.slice(Math.max(lastGames.length - 10, 0))

            const stats = state.roles.reduce((acc, role) => {
                acc[role] = calcStats(role, state.selectedSeason);
                return acc;
            }, {});
            state.stats = stats;
        },
        addRow (state) {
            const lastEntry = _.last(state.entries) || {};
            let session = lastEntry.session || "1"

            const lastUpdate = getLastUpdate().getTime();
            const current = Date.now();
            const diff = SESSION_TIMEOUT;
            if (current - lastUpdate > diff) {
                session = parseInt(session , 10) + 1;
            }

            const newEntry = {
                id: lastEntry.id + 1 || 1,
                session: session.toString(),
                sr: lastEntry.sr || "2000",
                role: lastEntry.role || "Support",
                size: lastEntry.size || "2",
                season: lastEntry.season || "20",
                wld: lastEntry.wld || "default",
            }
            state.entries.push(newEntry);
            setDirtyState(true);
        },
        deleteRow (state, param) {
            const index = indexByProperty(state.entries, "id", param.id);
            if (index > -1) {
                state.entries.splice(index, 1);
                setDirtyState(true);
            }
        },
        updateRow (state, param) {
            const index = indexByProperty(state.entries, "id", param.id);
            if (index > -1) {
                state.entries[index][param.property] = param.value;
                setDirtyState(true);
            }
        },
        saveItems (state) {
            setItems(_.cloneDeep(state.entries));
            saveItems();
        },
        selectSeason (state, param) {
            state.selectedSeason = param.id;
        },
        selectChartOption (state, param) {
            state.selectedChartOption = param.id;
        },
        setIgnoreDirtyState (state, param) {
            state.ignoreDirtyState = param.value;
            setIgnoreDirtyState(param.value);
        },
        setTheme (state, param) {
            Chart.defaults.global.defaultFontColor = getComputedStyle(document.body).getPropertyValue('--chart-color');
            state.theme = param.theme;
        },
        setLastCount (state, param) {
            state.lastCount = param.value;
            setOption("lastCount", state.lastCount);
        }
    },
    actions: {
        updateAll (context) {
            context.commit('updateAll');
        },
        addRow (context) {
            context.commit('addRow');
            context.commit('saveItems');
            context.commit('updateAll');
        },
        deleteRow (context, id) {
            context.commit('deleteRow', { id });
            context.commit('saveItems');
            context.commit('updateAll');
        },
        updateRow (context, param) {
            context.commit('updateRow', param);
            context.commit('saveItems');
            context.commit('updateAll');
        },
        selectSeason (context, id) {
            context.commit('selectSeason', { id });
            context.commit('updateAll');
        },
        selectChartOption (context, id) {
            context.commit('selectChartOption', { id });
        },
        setIgnoreDirtyState (context, value) {
            context.commit('setIgnoreDirtyState', { value });
        },
        setLastCount (context, value) {
            context.commit('setLastCount', { value });
            context.commit('updateAll');
        },
    },
});
globalThis.AppState = appState;

// update appState
appState.commit('updateAll');
appState.commit("setTheme", { theme: ThemeHandler.getTheme() });

ThemeHandler.on("themeLoaded", (evt) => {
    appState.commit("setTheme", { theme: evt.theme });
});
