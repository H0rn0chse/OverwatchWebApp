var dirty: boolean = false;
var ignore: boolean = null;
var ignoreCheckbox: HTMLInputElement = null;

export function initIgnoreDirtyState (elem: HTMLInputElement) {
    ignoreCheckbox = elem;
    ignore = JSON.parse(localStorage.getItem("ignoreDirtyState")) ?? true;
    ignoreCheckbox.checked = ignore;

    ignoreCheckbox.addEventListener("change", onIgnoreDirtyStateChange)
}

function onIgnoreDirtyStateChange () {
    ignore = ignoreCheckbox.checked;
    localStorage.setItem("ignoreDirtyState", ignore.toString());
}

export function getDirtyState (): boolean {
    return !ignore && dirty;
}

export function setDirtyState (value: boolean) {
    dirty = value;
}

export function getIgnoreDirtyState() {
    if (ignore === null) {
        ignore = JSON.parse(localStorage.getItem("ignoreDirtyState")) ?? true;
    }
    return ignore;
}
export function setIgnoreDirtyState(value) {
    ignore = !!value;
    localStorage.setItem("ignoreDirtyState", ignore.toString());
}