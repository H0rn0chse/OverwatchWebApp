function avgArray (arr, digits = 0) {
	avg = arr.reduce((acc, val) => { return acc += parseInt(val, 10)}, 0) / arr.length;
	return avg.toFixed(digits);
}