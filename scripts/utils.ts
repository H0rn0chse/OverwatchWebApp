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