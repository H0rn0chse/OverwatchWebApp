import { COLORS } from "./Constants.js";
import { getEnhancedEntries, getCurrentSeason, getSeasonStats, getSessionStats } from "./stats.js";
export function updateSeasonSelect() {
    const container = document.querySelector("select.season");
    const oldValue = container.value;
    container.innerHTML = "";
    const entries = getEnhancedEntries();
    let seasons = entries.map(e => e.season);
    seasons = [...new Set(seasons)];
    seasons.splice(0, 0, "All");
    seasons.forEach(s => {
        const option = document.createElement("option");
        container.appendChild(option);
        option.innerText = s == "All" ? s : "S" + s;
        option.setAttribute("value", s);
    });
    container.value = oldValue || seasons[seasons.length - 1];
    if (container.selectedIndex === -1) {
        container.value = seasons[seasons.length - 1];
    }
}
export function updateSeason() {
    const container = document.getElementById("lastSeason");
    const stats = getSeasonStats();
    const header = document.getElementById("seasonHeader");
    header.innerText = "Season " + getCurrentSeason();
    const ROWS = ["srWin", "srLoss"];
    const table = container.querySelector("tbody");
    const rows = table.querySelectorAll("tr");
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        cells.forEach((cell, cellIndex) => {
            cell.innerText = stats[ROWS[rowIndex]][cellIndex];
        });
    });
}
export function updateSession() {
    const container = document.getElementById("lastSession");
    container.innerHTML = "";
    const stats = getSessionStats();
    let elem;
    elem = document.createElement("h2");
    container.appendChild(elem);
    elem.innerText = "aktuelle Session";
    elem = document.createElement("p");
    container.appendChild(elem);
    elem.innerHTML = `<b>SR:</b> T:${stats.gain[0]}&nbsp;&nbsp;D:${stats.gain[1]}&nbsp;&nbsp;S:${stats.gain[2]}&nbsp;&nbsp;(${stats.sum})`;
    elem = document.createElement("p");
    container.appendChild(elem);
    elem.innerHTML = `<b>Ergebnis:</b> ${stats.wld[0]}W / ${stats.wld[1]}L / ${stats.wld[2]}D`;
}
export function updateInfo() {
    const container = document.getElementById("stats");
    const table = container.querySelector("div.table");
    table.innerHTML = "";
    const role = container.querySelector("select.role").value;
    const entries = getEnhancedEntries()
        .filter(item => {
        if (role == "All") {
            return true;
        }
        return item.role == role;
    });
    const count = entries.length < 10 ? entries.length : 10;
    const lastEntries = entries.splice(entries.length - count, count);
    lastEntries.forEach(entry => {
        let row = document.createElement("p");
        table.appendChild(row);
        const dSpan = document.createElement("span");
        row.appendChild(dSpan);
        dSpan.innerText = entry.diff.toFixed(0);
        dSpan.style.width = "30px";
        dSpan.style.display = "inline-block";
        dSpan.style.textAlign = "right";
        const rSpan = document.createElement("span");
        row.appendChild(rSpan);
        rSpan.innerText = entry.role;
        rSpan.style.width = "70px";
        rSpan.style.display = "inline-block";
        rSpan.style.marginLeft = "5px";
        const cSpan = document.createElement("span");
        row.appendChild(cSpan);
        cSpan.style.width = "20px";
        cSpan.style.height = "20px";
        cSpan.style.display = "inline-block";
        cSpan.style.backgroundColor = "rgb(70, 130, 180)";
        cSpan.style.marginLeft = "5px";
        cSpan.style.position = "relative";
        cSpan.style.top = "5px";
        cSpan.style.backgroundColor = COLORS[entry.role];
    });
}
