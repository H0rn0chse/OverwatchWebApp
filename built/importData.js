import { setDirtyState } from "./DirtyState.js";
import { setItems } from "./ItemManager.js";
import { rebuildTable } from "./TableManager.js";
let _fileHandler;
window.addEventListener("load", () => {
    _fileHandler = _addLoadFile();
});
export function importEntries() {
    _fileHandler.value = "";
    _fileHandler.click();
}
function _addLoadFile() {
    const _fileHandler = document.createElement("input");
    _fileHandler.setAttribute('id', "FileHandler");
    _fileHandler.setAttribute('type', 'file');
    _fileHandler.setAttribute('accept', '.txt');
    _fileHandler.setAttribute('multiple', "false");
    document.getElementById("hidden").appendChild(_fileHandler);
    _fileHandler.onchange = _handleFileSelect.bind(this);
    return _fileHandler;
}
function _handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const fileName = file.name;
        const reader = new FileReader();
        reader.onload = function () {
            try {
                const importedItems = JSON.parse(reader.result);
                setItems(importedItems);
                rebuildTable();
                setDirtyState(false);
            }
            catch (error) {
                console.log(error);
                // err handling
            }
        };
        reader.readAsText(file);
    }
}
