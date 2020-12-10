export function avgArray(arr, digits = 0) {
    const avg = arr.reduce((acc, val) => {
        return acc += parseFloat(val);
    }, 0);
    return (avg / arr.length).toFixed(digits);
}
export function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}
export function sort(direction, property) {
    return function (itemA, itemB) {
        if (itemA[property] < itemB[property]) {
            return direction === "ASC" ? -1 : 1;
        }
        if (itemA[property] > itemB[property]) {
            return direction === "ASC" ? 1 : -1;
        }
        return 0;
    };
}
