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
export function indexByProperty(arr, property, value) {
    return arr.findIndex((item) => {
        return item[property] === value;
    });
}
export function mergeChartJsData(target, source) {
    const labelDiff = target.labels.length - source.labels.length;
    if (labelDiff > 0) {
        target.labels.splice(source.labels.length - 1, labelDiff);
    }
    source.labels.forEach((value, index) => {
        target.labels[index] = value;
    });
    const datasetDiff = target.datasets.length - source.datasets.length;
    if (datasetDiff > 0) {
        target.datasets.splice(source.datasets.length - 1, datasetDiff);
    }
    source.datasets.forEach((sourceDataset, index) => {
        const targetDataset = target.datasets[index];
        for (const prop in sourceDataset) {
            if (prop === "data") {
                continue;
            }
            targetDataset[prop] = sourceDataset[prop];
        }
        const dataDiff = targetDataset.data.length - sourceDataset.data.length;
        if (dataDiff > 0) {
            targetDataset.data.splice(sourceDataset.data.length - 1, dataDiff);
        }
        sourceDataset.data.forEach((value, index) => {
            targetDataset.data[index] = value;
        });
    });
}
