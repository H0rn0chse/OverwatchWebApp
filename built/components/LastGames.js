const { Vue, Vuex } = globalThis;
const { mapState } = Vuex;
export const LastGames = Vue.component("last-games", {
    template: `
        <div class="last-games">
            <h3>letzten 10 Spiele</h3>
            <b-table
                v-bind:bordered="false"
                v-bind:colors="colors"
                :items="items"
                :fields="fields"
            >
                <template  #head(diff)="data">
                    <span></span>
                </template>
                <template  #head(role)="data">
                    <span></span>
                </template>
                <template  #head(color)="data">
                    <span></span>
                </template>

                <template v-slot:cell(diff)="row">
                    <strong>{{ row.item.diff }}</strong>
                </template>
                <template v-slot:cell(role)="row">
                    <strong>{{ row.item.role }}</strong>
                </template>
                <template v-slot:cell(color)="row">
                    <b-icon
                        icon="square-fill"
                        v-bind:style="{ color: colors[row.item.role] }"
                    />
                </template>
            </b-table>
            <span>
                Aktuelle Season: <strong>{{ season.current }}</strong>
            </span>
            <br>
            <span>
                Aktuelle Session:  <strong>{{ session.wld[0] }}W / {{ session.wld[1] }}L / {{ session.wld[2] }}D</strong>&nbsp;&nbsp;&nbsp;({{ session.sum }})
            </span>
        </div>
    `,
    props: [],
    computed: mapState({
        items: "lastGames",
        colors: "colors",
        season: "season",
        session: "session",
    }),
    data() {
        return {
            fields: [
                "diff",
                "role",
                "color",
            ],
        };
    }
});
