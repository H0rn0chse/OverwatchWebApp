import { startServer } from "@h0rn0chse/socket-server";

startServer({
    publicPaths: [[
        "/client", "/"
    ], [
        "/node_modules/chart.js/dist/", "/libs/chart.js"
    ], [
        "/node_modules/bootstrap/dist/", "/libs/bootstrap"
    ], [
        "/node_modules/bootstrap-vue/dist/", "/libs/bootstrap-vue"
    ], [
        "/node_modules/vue/dist/", "/libs/vue"
    ], [
        "/node_modules/vuex/dist/", "/libs/vuex"
    ], [
        "/node_modules/vue-chartjs/dist/", "/libs/vue-chartjs"
    ], [
        "/node_modules/lottie-web/build/", "/libs/lottie-web"
    ], [
        "/node_modules/@h0rn0chse/dark-mode-toggle/dist/", "/libs/dark-mode-toggle"
    ], [
        "/node_modules/wc-github-corners/dist", "/libs/wc-github-corners"
    ]]
});
