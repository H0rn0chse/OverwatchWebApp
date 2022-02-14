import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.join(__dirname, "../");

const dependencies = [[
    "/node_modules/chart.js/dist/", "/libs/chart.js"
], [
    "/node_modules/lodash/", "/libs/lodash"
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
]];

// copy dependencies to gh-pages
dependencies.forEach((dep) => {
    const pathFrom = path.join(projectDir, dep[0]);
    const pathTo = path.join(projectDir, "gh-pages", dep[1]);
    copyRecursiveSync(pathFrom, pathTo);
});

// Copy client to gh-pages
const pathFrom = path.join(projectDir, "client");
const pathTo = path.join(projectDir, "gh-pages");
copyRecursiveSync(pathFrom, pathTo);

// https://stackoverflow.com/a/22185855/14887710
function copyRecursiveSync (src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}
