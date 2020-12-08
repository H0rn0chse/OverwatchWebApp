export function avgArray(arr, digits = 0) {
    const avg = arr.reduce((acc, val) => {
        return acc += parseFloat(val);
    }, 0);
    return (avg / arr.length).toFixed(digits);
}
export function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}
