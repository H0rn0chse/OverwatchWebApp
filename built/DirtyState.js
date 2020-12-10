var dirty = false;
var ignore = null;
var ignoreCheckbox = null;
export function initIgnoreDirtyState(elem) {
    ignoreCheckbox = elem;
    ignore = !!JSON.parse(localStorage.getItem("ignoreDirtyState"));
    ignoreCheckbox.checked = ignore;
    ignoreCheckbox.addEventListener("change", onIgnoreDirtyStateChange);
}
function onIgnoreDirtyStateChange() {
    ignore = ignoreCheckbox.checked;
    localStorage.setItem("ignoreDirtyState", ignore.toString());
}
export function getDirtyState() {
    return !ignore && dirty;
}
export function setDirtyState(value) {
    dirty = value;
}
