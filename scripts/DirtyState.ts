var dirty: boolean = false;

export function getDirtyState (): boolean {
    return !getIgnoreDirtyState() && dirty;
}

export function setDirtyState (value: boolean) {
    dirty = value;
}

function getIgnoreDirtyState () {
	const elem: HTMLInputElement = document.querySelector("#cbxDirtyState");
	return elem.checked;
}