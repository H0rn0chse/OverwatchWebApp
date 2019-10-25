"use strict";
Promise.all([
	Promise.resolve()
]).then(function () {
	window.tBase = function () {
		this.init();	
	};

	tBase.prototype.init = () => {
		const that = this;
	};

	tBase.prototype.addClass = (sClassName, refElem) => {
		const oElem = refElem ? refElem : this.node;
		oElem.classList.add(sClassName);
	};

	tBase.prototype.removeClass = (sClassName, refElem) => {
		const oElem = refElem ? refElem : this.node;
		oElem.classList.remove(sClassName);
	};
});