import { setDirtyState } from "./DirtyState.js";

var items: LocalStorageEntry[] = [];

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
    items = JSON.parse(localStorage.getItem("items"));
}

export function getItems (): LocalStorageEntry[] {
    return items;
}

export function setItems (newItems :LocalStorageEntry[]){
    items = newItems;
}

export function saveItems () {
    setDirtyState(true);
	localStorage.setItem("items", JSON.stringify(items));
	window.dispatchEvent(new Event("updateAll"));
}