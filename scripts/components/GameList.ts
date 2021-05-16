const { Vue, Vuex, _ } = (globalThis as any);

const { mapState, mapActions } = Vuex;

export const GameList = Vue.component("game-list", {
    template: `
        <div
            class="game-list h-100 d-flex flex-column justify-content-end"
        >
            <b-table
                striped
                hover
                small
                sticky-header="calc(100vh - 500px)"
                responsive
                :items="entries"
                :fields="fields"
                class="flex-grow-1"
                :per-page="perPage"
                :current-page="currentPage"
            >
                <template v-slot:cell(session)="row">
                    <b-form-input
                        type="number"
                        v-model="row.item.session"
                        v-on:change="updateRow({id: row.item.id, property: 'session', value: row.item.session})"
                    />
                </template>
                <template v-slot:cell(sr)="row">
                    <b-form-input
                        type="number"
                        v-model="row.item.sr"
                        v-on:change="updateRow({id: row.item.id, property: 'sr', value: row.item.sr})"
                    />
                </template>
                <template v-slot:cell(role)="row">
                    <b-form-select
                        v-model="row.item.role"
                        :options="roles"
                        v-on:change="updateRow({id: row.item.id, property: 'role', value: row.item.role})"
                        style="min-width:7em"
                    />
                </template>
                <template v-slot:cell(size)="row">
                    <b-form-input
                        type="number"
                        v-model="row.item.size"
                        v-on:change="updateRow({id: row.item.id, property: 'size', value: row.item.size})"
                    />
                </template>
                <template v-slot:cell(wld)="row">
                    <b-form-select
                        v-model="row.item.wld"
                        :options="wld"
                        v-on:change="updateRow({id: row.item.id, property: 'wld', value: row.item.wld})"
                        style="min-width:7em"
                    />
                </template>
                <template v-slot:cell(season)="row">
                    <b-form-input
                        type="number"
                        v-model="row.item.season"
                        v-on:change="updateRow({id: row.item.id, property: 'season', value: row.item.season})"
                    />
                </template>
                <template v-slot:cell(actions)="row">
                    <b-button
                        size="sm"
                        v-on:click="deleteRow(row.item.id)"
                        variant="danger"
                    >
                        <b-icon icon="trash" />
                    </b-button>
                </template>
            </b-table>

            <div class="text-center pb-3 d-flex flex-row justify-content-center align-items-center">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    class="m-0 mr-3"
                />

                <b-button
                    size="sm"
                    v-on:click="addRow"
                >
                    Neuer Eintrag
                </b-button>
            </div>
        </div>
    `,
    props: [],
    computed: {
        ...mapState([
            "entries",
            "roles"
        ]),
        rows () {
            return this.entries.length
        }
    },
    data () {
        return {
            perPage: 50,
            currentPage: 1,
            fields: [
                { label: "Session", key: "session" },
                { label: "SR", key: "sr" },
                { label: "Rolle", key: "role" },
                { label: "Teamgröße", key: "size" },
                { label: "W/L/D", key: "wld" },
                { label: "Season", key: "season" },
                { label: "", key: "actions" },
            ],
            wld: [
                { value: "default", text: "Default" },
                { value: "Win", text: "Win" },
                { value: "Loss", text: "Loss" },
                { value: "Draw", text: "Draw" },
                { value: "noCount", text: "noCount" },
            ],
        }
    },
    watch: {
        rows (newRows, oldRows) {
            const lastPage = Math.ceil(this.rows / this.perPage);
            if (this.currentPage !== lastPage) {
                this.focusLastRow(true);
            } else  if (newRows > oldRows) {
                this.focusLastRow(false, true);
            }
        }
    },
    methods: {
        ...mapActions([
            "updateRow",
            "deleteRow",
            "addRow"
        ]),
        async focusLastRow (shouldFocusLastPage, shouldFocusLastRow) {
            await this.$nextTick(function () {
                if (shouldFocusLastPage) {
                    const lastPage = Math.ceil(this.rows / this.perPage);
                    this.currentPage = lastPage;
                    shouldFocusLastRow = true;
                }
            });
            await this.$nextTick(() => {
                if (shouldFocusLastRow) {
                    const rows = this.$el.children[0].children[0].children[1].children;
                    const item = _.last(rows);
                    item.scrollIntoView();
                }
            });
        },
    },
    mounted () {
        this.focusLastRow(true);
    },

})
