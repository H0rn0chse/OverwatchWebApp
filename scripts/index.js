window.onload = () => {
	console.log("loaded")
};

window.writeLocalStorage = () => {
	window.localStorage.setItem('name', 'Obaseki Nosa');
};

window.readLocalStorage = () => {
	window.localStorage.getItem('name');
};