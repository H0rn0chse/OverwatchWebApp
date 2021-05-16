import { appState } from "../AppState.js";
import { setDirtyState } from "../DirtyState.js";
import { exportEntries } from "../exportData.js";
import { setItems } from "../ItemManager.js";
const { Vue, Vuex } = globalThis;
const { mapActions, mapState } = Vuex;
const _fileHandler = document.createElement("input");
_fileHandler.setAttribute('id', "FileHandler");
_fileHandler.setAttribute('type', 'file');
_fileHandler.setAttribute('accept', '.txt');
_fileHandler.setAttribute('multiple', "false");
_fileHandler.onchange = _handleFileSelect.bind(this);
function _handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const fileName = file.name;
        const reader = new FileReader();
        reader.onload = function () {
            try {
                const importedItems = JSON.parse(reader.result);
                setItems(importedItems);
                appState.commit("updateAll");
                appState.commit('saveItems');
                setDirtyState(false);
            }
            catch (error) {
                console.log(error);
            }
        };
        reader.readAsText(file);
    }
}
export const ImportExportCard = Vue.component("import-export-card", {
    template: `
        <b-card
            style="min-width:13.75em;"
            title="Import & Export"
            class="mb-5"
        >
            <b-form-checkbox
                v-model="ignoreDirtyStateLocal"
                class="mb-2"
            >
                Enable Reminder
            </b-form-checkbox>
            <b-button v-on:click="importEntries">
                Import
            </b-button>
            <b-button v-on:click="exportEntries">
                Export
            </b-button>
        </b-card>
    `,
    props: [],
    computed: Object.assign(Object.assign({}, mapState([
        "ignoreDirtyState",
    ])), { ignoreDirtyStateLocal: {
            get() {
                return !this.ignoreDirtyState;
            },
            set(newChecked) {
                this.setIgnoreDirtyState(newChecked);
            }
        } }),
    data() {
        return {};
    },
    methods: Object.assign(Object.assign({}, mapActions([
        "setIgnoreDirtyState"
    ])), { exportEntries() {
            exportEntries();
        },
        importEntries() {
            _fileHandler.value = "";
            _fileHandler.click();
        } })
});
