import { setDirtyState } from "./DirtyState.js";
var items = [];
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
