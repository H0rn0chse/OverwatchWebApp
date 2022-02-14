import { setDirtyState } from "./DirtyState.js";
import { getItems } from "./ItemManager.js";

export function exportEntries () {
	const text = JSON.stringify(getItems());
    download(text, 'OverwatchWebApp.json', 'text/plain');
    setDirtyState(false)
}

function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
