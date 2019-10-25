"use strict";
Promise.all([
	load.js("scripts/templates/Base.js")
]).then(function () {
	window.tInput = function(obj) {
		tBase.call(this, obj);
		this.init(obj);
	};

	tInput.prototype = new tBase();

	tInput.prototype.init = function (obj) {
		if (!obj) {
			obj = {};
		}
		this.lang = obj.lang;
		this.value = obj.value;
		this.type = obj.type;
		this.listItems = obj.listItems || [];
	};

	tInput.prototype.render = function () {
		if (this.node) {
			return this.node;
		}
		switch (this.type) {
			case "number":
				this.node = document.createElement("input");
				this.node.setAttribute("type", "number");
				this.node.value = this.value;
				break;
			case "text":
				this.node = document.createElement("input");
				this.node.setAttribute("type", "number");
				this.node.value = this.value;
				break;
			case "list":
				this.node = document.createElement("select");
				this.listItems.forEach((oListItem) => {
					const oOption = document.createElement("option");
					oOption.setAttribute("value", oListItem.id)
					oOption.innerText = oListItem[this.lang];
					if (this.value === oListItem.id) {
						oOption.setAttribute("selected", true);
					}
					this.node.appendChild(oOption)
				});
				break;
		}
		return this.node;
	};
});