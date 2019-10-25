"use strict";
Promise.all([
	load.js("scripts/templates/Base.js")
]).then(function () {
	window.tRow = obj => {
		tBase.call(this, obj);
		this.init();
	};

	tRow.prototype = new tBase();

	tRow.prototype.init = () => {

	};
});