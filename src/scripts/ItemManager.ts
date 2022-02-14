import { setDirtyState } from "./DirtyState.js";

var items: LocalStorageEntry[] = [];
var options;
const optionsKey = "options_overwatchapp";

export interface LocalStorageEntry {
    id: number,
    session: string,
    sr: string,
    role: string,
    size: string,
    season: string,
    wld: string
};

export function loadFromLocalStorage () {
    items = JSON.parse(localStorage.getItem("items")) || [];
}

export function getItems (): LocalStorageEntry[] {
    return items;
}

export function setItems (newItems :LocalStorageEntry[]){
    items = newItems;
}

export function saveItems () {
    setLastUpdate();
    setDirtyState(true);
	localStorage.setItem("items", JSON.stringify(items));
	window.dispatchEvent(new Event("updateAll"));
}

export function getLastUpdate () {
    return new Date(parseInt(localStorage.getItem("lastUpdate"), 0) || 0);
}

export function setLastUpdate () {
    localStorage.setItem("lastUpdate", new Date().getTime().toString())
}

export function getOption (optionName) {
    if (!options) {
        options = JSON.parse(localStorage.getItem(optionsKey)) || {};
    }
    return options[optionName] ?? null;
}

export function setOption (optionName, value) {
    if (!options) {
        options = JSON.parse(localStorage.getItem(optionsKey)) || {};
    }
    options[optionName] = value;
    localStorage.setItem(optionsKey, JSON.stringify(options));
}

globalThis._resetOptions = function () {
    localStorage.setItem(optionsKey, "{}");
}