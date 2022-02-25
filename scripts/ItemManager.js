import { setDirtyState } from "./DirtyState.js";
var items = [];
var options;
const optionsKey = "options_overwatchapp";
;
export function loadFromLocalStorage() {
    items = JSON.parse(localStorage.getItem("items")) || [];
}
export function getItems() {
    return items;
}
export function setItems(newItems) {
    items = newItems;
}
export function saveItems() {
    setLastUpdate();
    setDirtyState(true);
    localStorage.setItem("items", JSON.stringify(items));
    window.dispatchEvent(new Event("updateAll"));
}
export function getLastUpdate() {
    return new Date(parseInt(localStorage.getItem("lastUpdate"), 0) || 0);
}
export function setLastUpdate() {
    localStorage.setItem("lastUpdate", new Date().getTime().toString());
}
export function getOption(optionName) {
    var _a;
    if (!options) {
        options = JSON.parse(localStorage.getItem(optionsKey)) || {};
    }
    return (_a = options[optionName]) !== null && _a !== void 0 ? _a : null;
}
export function setOption(optionName, value) {
    if (!options) {
        options = JSON.parse(localStorage.getItem(optionsKey)) || {};
    }
    options[optionName] = value;
    localStorage.setItem(optionsKey, JSON.stringify(options));
}
globalThis._resetOptions = function () {
    localStorage.setItem(optionsKey, "{}");
};
