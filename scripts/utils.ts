export function avgArray (arr: any[], digits: number = 0): string {
	const avg = arr.reduce((acc, val) => {
		return acc += parseFloat(val)
	}, 0);
	return (avg/ arr.length).toFixed(digits);
}

export function deepClone (value: any): any {
	return JSON.parse(JSON.stringify(value));
}