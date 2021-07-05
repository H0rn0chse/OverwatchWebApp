import { RANKS } from "./Constants.js";

export function avgArray (arr: any[], digits: number = 0): string {
	const avg = arr.reduce((acc, val) => {
		return acc += parseFloat(val)
	}, 0);
	return (avg/ arr.length).toFixed(digits);
}

export function deepClone (value: any): any {
	return JSON.parse(JSON.stringify(value));
}

type Direction = "ASC" | "DESC";

export function sort (direction: Direction, property) : (a: any, b: any) => number {
	return function (itemA, itemB) {
		if (itemA[property] < itemB[property]) {
			return direction === "ASC" ? -1 : 1
		}
		if (itemA[property] > itemB[property]) {
			return direction === "ASC" ? 1 : -1
		}
		return 0;
	}
}

export function indexByProperty (arr: any[], property: string, value: any): number {
	return arr.findIndex((item) => {
		return item[property] === value;
	});
}

export function mergeChartJsData (target: any, source: any) {
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
			targetDataset[prop] = sourceDataset[prop]
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

export function getRank (sr = "0") {
	var parsedSr = parseInt(sr.toString(), 10);

	if (parsedSr >= 4000) {
		return RANKS.grandmaster;
	}
	if (parsedSr >= 3500 && parsedSr < 4000) {
		return RANKS.master;
	}
	if (parsedSr >= 3000 && parsedSr < 3500) {
		return RANKS.diamond;
	}
	if (parsedSr >= 2500 && parsedSr < 3000) {
		return RANKS.platinum;
	}
	if (parsedSr >= 2000 && parsedSr < 2500) {
		return RANKS.gold;
	}
	if (parsedSr >= 1500 && parsedSr < 2000) {
		return RANKS.silver;
	}
	if (parsedSr < 1500) {
		return RANKS.bronze;
	}
}
