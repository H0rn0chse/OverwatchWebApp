var items;
window.onload = () => {
	items = JSON.parse(localStorage.getItem("items"));
	if (!items) {
		items = [];
		addRow();
	} else {
		items.forEach(item => {
			addRow(item);
		});
	}
	
	updateStats();
}

function saveItems () {
	localStorage.setItem("items", JSON.stringify(items));
	updateStats();
}
