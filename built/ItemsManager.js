import { deepClone } from "./utils";
var items = [];
;
export function loadFromLocalStorage() {
    items = JSON.parse(localStorage.getItem("items"));
}
export function getItems() {
    return deepClone(items);
}
