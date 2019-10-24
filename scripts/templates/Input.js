function tInput (obj) {
	this.obj = obj;

	this.render = function () {
		if (this.node) {
			return this.node;
		}
		switch (this.obj.type) {
			case "number":
				this.node = document.createElement("input");
				this.node.setAttribute("type", "number");
				this.node.value = this.obj.value;
				break;
			case "text":
				this.node = document.createElement("input");
				this.node.setAttribute("type", "number");
				this.node.value = this.obj.value;
				break;
			case "list":
				this.node = document.createElement("select");
				this.obj.listItems.forEach((oListItem) => {
					var oOption = document.createElement("option");
					oOption.setAttribute("value", oListItem.id)
					oOption.innerText = oListItem[this.obj.lang];
					if (this.obj.value === oListItem.id) {
						oOption.setAttribute("selected", true);
					}
					this.node.appendChild(oOption)
				});
				break;
		}
		return this.node;
	}
}