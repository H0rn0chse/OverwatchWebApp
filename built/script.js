var items;
window.addEventListener("load", () => {
    items = JSON.parse(localStorage.getItem("items"));
    drawCharts();
    setChartColorScheme(colorSchemeQueryList);
    rebuildTable();
    updateStats();
    window.dirtyState = false;
});
window.addEventListener("beforeunload", (event) => {
    if (!getIgnoreDirtyState() && window.dirtyState) {
        var message = 'You may export the latest changes';
        event.returnValue = message;
        return message;
    }
});
function updateItems(importedItems) {
    items = importedItems;
    saveItems();
    rebuildTable();
}
function saveItems() {
    window.dirtyState = true;
    localStorage.setItem("items", JSON.stringify(items));
    window.dispatchEvent(new Event("updateAll"));
}
function updateStats() {
    updateSeasonSelect();
    drawGroupedBarChart();
    updateTable();
    updateSeason();
    updateSession();
}
function updateSeasonStats() {
    drawGroupedBarChart();
}
