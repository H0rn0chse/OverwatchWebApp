var dirty = false;
export function getDirtyState() {
    return !getIgnoreDirtyState() && dirty;
}
export function setDirtyState(value) {
    dirty = value;
}
function getIgnoreDirtyState() {
    const elem = document.querySelector("#cbxDirtyState");
    return elem.checked;
}
