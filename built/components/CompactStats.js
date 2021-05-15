const { Vue, Vuex } = globalThis;
const { mapState } = Vuex;
export const CompactStats = Vue.component("compact-stats", {
    template: `
        <div class="compact-stats">
            <h3>Zusammenfassung</h3>
            <b-table
                :fields="fields"
                :items="items"
            >
                <template v-slot:cell(header)="row">
                    <strong>{{ row.item.header }}</strong>
                </template>
            </b-table>
        </div>
    `,
    props: [],
    computed: Object.assign({ items(...args) {
            let items = new Array(5).fill(0);
            return items.map((value, index) => {
                const row = this.rows[index];
                return {
                    header: row.header,
                    tank: this[row.prop][row.path][0],
                    dps: this[row.prop][row.path][1],
                    support: this[row.prop][row.path][2],
                };
            });
        } }, mapState([
        "career",
        "season",
        "session",
    ])),
    data() {
        return {
            fields: [
                { label: "", key: "header" },
                { label: "Tank", key: "tank" },
                { label: "DPS", key: "dps" },
                { label: "Support", key: "support" },
            ],
            rows: [
                {
                    header: "Career High",
                    prop: "career",
                    path: "high",
                },
                {
                    header: "Career Low",
                    prop: "career",
                    path: "low",
                },
                {
                    header: "SR / Win",
                    prop: "season",
                    path: "srWin",
                },
                {
                    header: "SR / Loss",
                    prop: "season",
                    path: "srLoss",
                },
                {
                    header: "Session Gain",
                    prop: "session",
                    path: "gain",
                },
            ],
        };
    },
});
