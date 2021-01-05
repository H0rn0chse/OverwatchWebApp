import { loadFromLocalStorage } from "./ItemManager.js";
import { getDirtyState, initIgnoreDirtyState, setDirtyState } from "./DirtyState.js";
import { initCharts, updateCharts } from "./GraphManager.js";
import { updateInfo, updateSeason, updateSeasonSelect, updateSession } from "./InfoManager.js";
import { addRow, rebuildTable } from "./TableManager.js";
import { importEntries } from "./importData.js";
import { exportEntries } from "./exportData.js";
export function init() {
    window.addEventListener("load", () => {
        initIgnoreDirtyState(document.querySelector("#cbxDirtyState"));
        loadFromLocalStorage();
        initCharts();
        rebuildTable();
        setDirtyState(false);
        window.dispatchEvent(new Event("updateAll"));
    });
    window.addEventListener("beforeunload", (event) => {
        if (getDirtyState()) {
            var message = 'You may export the latest changes';
            event.returnValue = message;
            return message;
        }
    });
    window.addEventListener("updateAll", () => {
        updateSeasonSelect();
        updateCharts();
        updateInfo();
        updateSeason();
        updateSession();
    });
    window.updateInfo = updateInfo;
    window.updateSeasonStats = () => {
        updateCharts();
    };
    window.addRow = addRow;
    window.exportEntries = exportEntries;
    window.importEntries = importEntries;
    window.setProgressChart = (event) => {
        // Reset Charts
        const progressCharts = ["ctxProgress1", "ctxProgress2"];
        progressCharts.forEach(value => {
            const element = document.getElementById(value);
            element.style.display = "none";
        });
        // Show correct chart
        const select = document.getElementById("progressSelect");
        const value = select.value;
        const element = document.getElementById(value);
        element.style.display = "";
    };
}
