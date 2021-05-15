var dirty = false;
var ignore = null;
var ignoreCheckbox = null;
export function initIgnoreDirtyState(elem) {
    var _a;
    ignoreCheckbox = elem;
    ignore = (_a = JSON.parse(localStorage.getItem("ignoreDirtyState"))) !== null && _a !== void 0 ? _a : true;
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
export function getIgnoreDirtyState() {
    var _a;
    if (ignore === null) {
        ignore = (_a = JSON.parse(localStorage.getItem("ignoreDirtyState"))) !== null && _a !== void 0 ? _a : true;
    }
    return ignore;
}
export function setIgnoreDirtyState(value) {
    ignore = !!value;
    localStorage.setItem("ignoreDirtyState", ignore.toString());
}
