function getEntries(role, season) {
    const filteredEntries = JSON.parse(JSON.stringify(items))
        .map((item, index) => {
        item.sortId = index;
        item.session = parseInt(item.session, 10);
        item.sr = parseInt(item.sr, 10);
        item.size = parseInt(item.size, 10);
        item.season = parseInt(item.season, 10);
        return item;
    })
        .filter(item => {
        return item.role == role;
    })
        .filter(item => {
        return season === "All" ? true : item.season == season;
    });
    filteredEntries.forEach((entry, i) => {
        const lastEntry = filteredEntries[i - 1] || {};
        if (entry.wld == "default") {
            entry.wasDefault = true;
            if (entry.sr > (lastEntry.sr || 0)) {
                entry.wld = "Win";
            }
            else if (entry.sr < lastEntry.sr) {
                entry.wld = "Loss";
            }
            else {
                entry.wld = "Draw";
            }
            entry.diff = entry.sr - lastEntry.sr;
        }
        else {
            entry.diff = 0;
        }
    });
    return filteredEntries;
}
export {};
