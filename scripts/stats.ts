import { ROLES } from "./Constants.js";
import { getItems } from "./ItemManager.js";
import { Role, Entry, Stats } from "./types.js";
import { deepClone } from "./utils.js";

/**
 * Returns the numeric maximum value of a list
 * @param list list of objects
 * @param property the name of the value property
 * @param min the minimum value
 */
function maxInList (list: object[], property: string, min: number): number {
    return list.reduce((acc, val) => {
		return val[property] > acc ? val[property] : acc;
	}, min);
}

/**
 * Returns the numeric minimum value of a list
 * @param list list of objects
 * @param property the name of the value property
 * @param max the maximum value
 */
function minInList (list: object[], property: string, max: number): number {
    return list.reduce((acc, val) => {
		return val[property] < acc && val[property] > 0 ? val[property] : acc;
	}, max);
}

function findInList (list: object[], property: string, identifier: string, identifierValue) {
    const elementIndex = list.findIndex(entry => {
        return entry[identifier] === identifierValue;
    });
    if (elementIndex > -1) {
        return list[elementIndex][property];
    }
}

/**
 * Returns the first numeric value of value that is greater than a threshold
 * @param list list of objects
 * @param property the name of the value property
 * @param min the minimum threshold
 */
function firstGreaterThan (list: object[], property: string, min: number): number {
    return list.reduce((acc, val) => {
		if (acc > min) {
			return acc;
		}
        return val[property];
    }, 0) || min;
}

/**
 * Returns the last numeric value of value that is greater than a threshold
 * @param list list of objects
 * @param property the name of the value property
 * @param min the minimum threshold
 */
function lastGreaterThan (list: object[], property: string, min: number): number {
    return list.reduce((acc, val) => {
		if (val[property] > min) {
			return val[property];
		}
        return acc;
    }, 0) || min;
}

/**
 * Evaluates a list of if conditions based on a item. The list gets AND concatenated.
 * @param item the object under test
 * @param ifConditions
 * a list of 3-Tuples containing the propertyName, positive value and negative value.
 * In case the negative value is set the positive value gets ignored.
 */
function evaluateIfConditions (item: object, ifConditions: any[][]): boolean {
    return ifConditions.reduce((acc, [ifProperty, ifValue, ifNotValue]) => {
        if (!acc) {
            return acc;
        }
        if (ifValue === null) {
            return item[ifProperty] != ifNotValue;
        }
        return item[ifProperty] == ifValue;
    }, true);
}

/**
 * Filters a list based on a list of conditions
 * @param list list of objects
 * @param ifConditions
 * a list of 3-Tuples containing the propertyName, positive value and negative value.
 * For more details @see evaluateIfConditions.
 */
function filterIf (list: object[], ifConditions: any[][]): object[]{
    return list.reduce<object[]>((acc, val) => {
		if (evaluateIfConditions(val, ifConditions)) {
			acc.push(val);
		}
		return acc;
	}, []);
}

/**
 * Counts the number of items which meet the conditions.
 * @param list list of objects
 * @param ifConditions
 * a list of 3-Tuples containing the propertyName, positive value and negative value.
 * For more details @see evaluateIfConditions.
 */
function countIf (list: object[], ifConditions: any[][]): number {
    return list.reduce((acc, val) => {
		if (evaluateIfConditions(val, ifConditions)) {
			acc += 1;
		}
		return acc;
	}, 0);
}

interface sumIfResult {
    sum: number,
    count: number
}
/**
 * Sums and counts the number of items which meet the conditions.
 * @param list list of objects
 * @param sumProperty the name of the value property
 * @param ifConditions
 * a list of 3-Tuples containing the propertyName, positive value and negative value.
 * For more details @see evaluateIfConditions.
 */
function sumIf (list: object[], sumProperty: string, ifConditions: any[][]): sumIfResult {
    const result = {
        sum:0,
        count:0
    };
	return list.reduce<sumIfResult>((acc: sumIfResult, val) => {
        if (evaluateIfConditions(val, ifConditions)) {
			acc.sum += val[sumProperty];
			acc.count += 1;
		}
		return acc;
    }, result);
}

/**
 * Returns the average of the sum of items which meet the conditions.
 * @param list list of objects
 * @param sumProperty the name of the value property
 * @param ifConditions
 * a list of 3-Tuples containing the propertyName, positive value and negative value.
 * For more details @see evaluateIfConditions.
 */
function sumIfAverage (list: object[], sumProperty: string, ifConditions: any[][]): number {
    const result = sumIf(list, sumProperty, ifConditions);
    return result.sum / result.count;
}

/**
 * Returns the size of the largest group meeting the property/value condition
 * @param list list of objects
 * @param property the name of the value property
 * @param value the value to search for
 */
function largestGroup(list: object[], property: string, value: any): number {
    return list.reduce((acc, val) => {
		if (val[property] == value) {
			acc[0] += 1
		} else {
			acc[0] = 0;
		}
		if (acc[0] > acc[1]) {
			acc[1] = acc[0];
		}
		return acc;
	}, [0, 0])[1] || 0;
}

function getEntries (role: Role, season: string | number = "All") : Entry[] {
    const filteredEntries = getItems()
		.map((item, index) => {
            const result = deepClone(item);
            result.sortId = index;
            result.session = parseInt(item.session, 10);
            result.sr = parseInt(item.sr, 10);
            result.size = parseInt(item.size, 10);
            result.season = parseInt(item.season, 10);
			return result;
		})
		.filter(item => {
            if (role === null) {
                return true;
            }
			return item.role == role;
        })
        .filter(item => {
            return season === "All" ? true : item.season == season;
        })

    filteredEntries.forEach((entry, i) => {
        const lastEntry = filteredEntries[i-1];
        const lastEntrySr = lastEntry && lastEntry.sr || 0;
        if (entry.wld == "default") {
            entry.wasDefault = true;
            if (entry.sr > lastEntrySr) {
                entry.wld = "Win"
            }
            else if(entry.sr < lastEntrySr) {
                entry.wld = "Loss"
            } else {
                entry.wld = "Draw"
            }
            entry.diff = entry.sr - lastEntrySr;
        } else {
            entry.diff = 0;
        }
    });

    return filteredEntries;
}

export function calcStats (role: Role, season: string | number = "All"): Stats {
    const entries = getEntries(role, season);
    const lastEntry = entries[entries.length - 1] || { sr: 0 };
    const currentSession = getCurrentSession();
    const sessionEntries = filterIf(entries, [["session", currentSession]]);

    const stats: Stats = {
        // General
        enhancedEntries: entries,
        gamesPlayed: entries.length,
        startSr: firstGreaterThan(entries, "sr", 0),
        seasonHigh: maxInList(entries, "sr", 0),
        seasonLow: minInList(entries, "sr", 5000),
        win: countIf(entries, [["wld", "Win"], ["wld", "Win"]]),
        loss: countIf(entries, [["wld", "Loss"]]),
        draw: countIf(entries, [["wld", "Draw"]]),
        winStreak: largestGroup(entries, "wld", "Win"),
        lossStreak: largestGroup(entries, "wld", "Loss"),
        currentSr: lastEntry.sr,
        srGain: null,
        winRate: null,
        srWin: sumIfAverage(entries, "diff", [["wld", "Win"], ["diff", null, 0]]),
        srLoss: sumIfAverage(entries, "diff", [["wld", "Loss"], ["diff", null, 0]]),
        srAvg: sumIfAverage(entries, "diff", [["wasDefault", true], ["diff", null, 0]]),
        // Group
        gamesPlayedGroup: {
            1: countIf(entries, [["size", 1]]),
            2: countIf(entries, [["size", 2]]),
            3: countIf(entries, [["size", 3]]),
            4: countIf(entries, [["size", 4]]),
            5: countIf(entries, [["size", 5]]),
            6: countIf(entries, [["size", 6]])
        },
        winGroup: {
            1: countIf(entries, [["size", 1], ["wld", "Win"]]),
            2: countIf(entries, [["size", 2], ["wld", "Win"]]),
            3: countIf(entries, [["size", 3], ["wld", "Win"]]),
            4: countIf(entries, [["size", 4], ["wld", "Win"]]),
            5: countIf(entries, [["size", 5], ["wld", "Win"]]),
            6: countIf(entries, [["size", 6], ["wld", "Win"]])
        },
        lossGroup: {
            1: countIf(entries, [["size", 1], ["wld", "Loss"]]),
            2: countIf(entries, [["size", 2], ["wld", "Loss"]]),
            3: countIf(entries, [["size", 3], ["wld", "Loss"]]),
            4: countIf(entries, [["size", 4], ["wld", "Loss"]]),
            5: countIf(entries, [["size", 5], ["wld", "Loss"]]),
            6: countIf(entries, [["size", 6], ["wld", "Loss"]])
        },
        drawGroup: {
            1: countIf(entries, [["size", 1], ["wld", "Draw"]]),
            2: countIf(entries, [["size", 2], ["wld", "Draw"]]),
            3: countIf(entries, [["size", 3], ["wld", "Draw"]]),
            4: countIf(entries, [["size", 4], ["wld", "Draw"]]),
            5: countIf(entries, [["size", 5], ["wld", "Draw"]]),
            6: countIf(entries, [["size", 6], ["wld", "Draw"]])
        },
        winRateGroup: {
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null
        },
        // Session
        sessionStart: findInList(entries, "sr", "id", firstGreaterThan(sessionEntries, "id", 0) - 1) || 0,
        sessionCurrent: lastGreaterThan(sessionEntries, "sr", 0),
        sessionWin: countIf(sessionEntries, [["wld", "Win"]]),
        sessionLoss: countIf(sessionEntries, [["wld", "Loss"]]),
        sessionDraw: countIf(sessionEntries, [["wld", "Draw"]])
    };
    // General
    stats.srGain = stats.currentSr - stats.startSr;
    stats.winRate = stats.win / (stats.gamesPlayed - stats.draw);
    // Group
    stats.winRateGroup = {
        1: stats.winGroup[1] / (stats.gamesPlayedGroup[1] - stats.drawGroup[1]) || 0,
        2: stats.winGroup[2] / (stats.gamesPlayedGroup[2] - stats.drawGroup[2]) || 0,
        3: stats.winGroup[3] / (stats.gamesPlayedGroup[3] - stats.drawGroup[3]) || 0,
        4: stats.winGroup[4] / (stats.gamesPlayedGroup[4] - stats.drawGroup[4]) || 0,
        5: stats.winGroup[5] / (stats.gamesPlayedGroup[5] - stats.drawGroup[5]) || 0,
        6: stats.winGroup[6] / (stats.gamesPlayedGroup[6] - stats.drawGroup[6]) || 0
    };

	return stats;
}

export function getCurrentSession (): number {
    const entries = getEntries(null);
    return maxInList(entries, "session", 0)
}

export function getCurrentSeason (): number {
    const entries = getEntries(null);
    return maxInList(entries, "season", 0)
}

export function getEnhancedEntries () : Entry[]{
	const entries = ROLES
		.reduce((acc, role) => {
			return [...acc, ...getEntries(role)];
		}, [])
		.sort((a, b) => {
			if (a.sortId > b.sortId) return 1;
			if (b.sortId > a.sortId) return -1;
			return 0;
		});
	return entries;
}

export function getSessionStats () {
	const sessionStats = {
		start: [0, 0, 0],
		current: [0, 0, 0],
		gain: [0, 0, 0],
		wld: [0, 0, 0],
		sum: 0
	}
	ROLES.forEach((role, index) => {
		const roleStats = calcStats(role);

		sessionStats.start[index] = roleStats.sessionStart;
		sessionStats.current[index] = roleStats.sessionCurrent;
		sessionStats.gain[index] = roleStats.sessionCurrent - roleStats.sessionStart;
		sessionStats.sum += sessionStats.gain[index];
		sessionStats.wld[0] += roleStats.sessionWin;
		sessionStats.wld[1] += roleStats.sessionLoss;
		sessionStats.wld[2] += roleStats.sessionDraw;
	})

	return sessionStats;
}


export function getSeasonStats () {
	const season = getCurrentSeason();
	const seasonStats: any = {
		srGain: [0, 0, 0],
		srLoss: [0, 0, 0],
		srWin: [0, 0, 0]
	}
	ROLES.forEach((role, index) => {
        const roleStats = calcStats(role, season);

		seasonStats.srGain[index] = roleStats.srAvg || 0
		seasonStats.srGain[index] = seasonStats.srGain[index].toFixed(2);
		seasonStats.srLoss[index] = roleStats.srLoss || 0;
		seasonStats.srLoss[index] = seasonStats.srLoss[index].toFixed(2);
		seasonStats.srWin[index] = roleStats.srWin || 0;
		seasonStats.srWin[index] = seasonStats.srWin[index].toFixed(2);
	});

	return seasonStats;
}