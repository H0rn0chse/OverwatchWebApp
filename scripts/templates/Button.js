"use strict";
Promise.all([
	load.js("scripts/templates/Base.js")
]).then(function () {
	window.tButton = obj => {
		tBase.call(this, obj);
		this.init(obj);
	};

	tButton.prototype = new tBase();

	tButton.prototype.init = obj => {
		this.fnClickHandler = obj.fnClickHandler;
	}

	tButton.prototype.render = () => {
		if (this.node) {
			return this.node;
		}
		this.node = document.createElement("div");
		this.addClass("button");
		this.node.onclick = this.fnClickHandler;
	}
});