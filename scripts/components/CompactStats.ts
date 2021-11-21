import { getRank } from "../utils.js";

const { Vue, Vuex } = (globalThis as any);

const { mapState } = Vuex;

export const CompactStats = Vue.component("compact-stats", {
    template: `
        <div class="compact-stats">
            <h3>Zusammenfassung</h3>
            <b-table
                :fields="fields"
                :items="items"
                class="smallTable"
                :tbody-tr-class="formatRow"
            >
                <template v-slot:cell(header)="row">
                    <strong>
                        {{ row.item.header }}
                    </strong>
                </template>

                <template v-slot:cell(tank)="row">
                    <span>
                        {{ row.item.tank }}
                    </span>
                    <b-img
                        v-if="row.item.tankIcon !== ''"
                        :src="row.item.tankIcon"
                        style="height:2em;"
                    />
                </template>
                <template v-slot:cell(dps)="row">
                    <span>
                        {{ row.item.dps }}
                    </span>
                    <b-img
                        v-if="row.item.dpsIcon !== ''"
                        :src="row.item.dpsIcon"
                        style="height:2em;"
                    />
                </template>
                <template v-slot:cell(support)="row">
                    <span>
                        {{ row.item.support }}
                    </span>
                    <b-img
                        v-if="row.item.supportIcon !== ''"
                        :src="row.item.supportIcon"
                        style="height:2em;"
                    />
                </template>
            </b-table>
        </div>
    `,
    props: [ ],
    computed: {
        items (...args) {
            let items = new Array(this.rows.length).fill(0);
            return items.map((value, index) => {
                const row = this.rows[index];
                const rowValues = this[row.prop][row.path];
                return {
                    header: row.header,
                    highlight: row.highlight,
                    tank: rowValues[0],
                    tankIcon: this.rows[index].showIcon && rowValues[0] > 0 ? getRank(rowValues[0]).path : "",
                    dps: rowValues[1],
                    dpsIcon: this.rows[index].showIcon && rowValues[1] > 0 ? getRank(rowValues[1]).path : "",
                    support: rowValues[2],
                    supportIcon: this.rows[index].showIcon && rowValues[2] > 0 ? getRank(rowValues[2]).path : "",
                };
            });
        },
        ...mapState([
            "career",
            "season",
            "session",
        ]),
    },
    data () {
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
                    showIcon: true,
                    highlight: false,
                },
                {
                    header: "Season High",
                    prop: "season",
                    path: "high",
                    showIcon: true,
                    highlight: false,
                },
                {
                    header: "Season Current",
                    prop: "season",
                    path: "currentSr",
                    showIcon: true,
                    highlight: true,
                },
                {
                    header: "Season Low",
                    prop: "season",
                    path: "low",
                    showIcon: true,
                    highlight: false,
                },
                {
                    header: "Career Low",
                    prop: "career",
                    path: "low",
                    showIcon: true,
                    highlight: false,
                },
                {
                    header: "SR / Win",
                    prop: "season",
                    path: "srWin",
                    showIcon: false,
                    highlight: true,
                },
                {
                    header: "SR / Loss",
                    prop: "season",
                    path: "srLoss",
                    showIcon: false,
                    highlight: true,
                },
                {
                    header: "Session Gain",
                    prop: "session",
                    path: "gain",
                    showIcon: false,
                    highlight: false,
                },
            ],
        }
    },
    methods: {
        formatRow (item, type) {
            if (!item || type !== "row") {
                return;
            }
            if (item.highlight) {
                return "table-highlight";
            }
        }
    }
});
