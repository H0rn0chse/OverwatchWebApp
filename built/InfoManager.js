import { COLORS } from "./Constants.js";
import { getEnhancedEntries, getCurrentSeason, getSeasonStats, getSessionStats, getCareerStats } from "./stats.js";
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
export function updateInfo() {
    const stats = getCareerStats();
    const season = getSeasonStats();
    const session = getSessionStats();
    const header = document.getElementById("seasonHeader");
    header.innerText = "Season " + getCurrentSeason();
    const rowValues = [stats.high, stats.low, null, season.srWin, season.srLoss, null, session.gain];
    const rows = document.querySelectorAll("#infoTable tbody tr");
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        cells.forEach((cell, cellIndex) => {
            if (rowValues[rowIndex]) {
                cell.innerText = rowValues[rowIndex][cellIndex];
            }
        });
    });
    const sessionResult = document.getElementById("sessionResult");
    sessionResult.innerHTML = `<b>aktuelle Session:</b>&nbsp;&nbsp;${session.wld[0]}W / ${session.wld[1]}L / ${session.wld[2]}D&nbsp;&nbsp;&nbsp;&nbsp;(${session.sum})`;
}
export function updateStats() {
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
