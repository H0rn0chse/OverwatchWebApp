var items;
window.onload = () => {
	items = JSON.parse(localStorage.getItem("items"));
	if (!items) {
		items = [];
		saveItems();
	}
	items.forEach(item => {
		addRow(item);
	});
}

function saveItems () {
	localStorage.setItem("items", JSON.stringify(items));
	updateStats();
}
