var dirty: boolean = false;
var ignore: boolean = null;
var ignoreCheckbox: HTMLInputElement = null;

export function initIgnoreDirtyState (elem: HTMLInputElement) {
    ignoreCheckbox = elem;
    ignore = !!JSON.parse(localStorage.getItem("ignoreDirtyState"));
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