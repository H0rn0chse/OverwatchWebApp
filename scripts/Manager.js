var Manager = (function () {
	'use strict';
	var MODULE_NAME = "Manager"
	var _bDebug = false;
	var _oData = {};

	function _log (sMsg) {
		if (_bDebug) {
			console.log(sMsg, MODULE_NAME);
		}
	}

	function _buildTable() {
		var sLang = LocalStorageHandler.getConfig("lang")
		var oTable = document.createElement("table");
		// Header
		var oHRow = document.createElement("tr");
		var aHeader = _oData.StaticParameter.values;
		aHeader.forEach((elem) => {
			var oCell = document.createElement("th");
			oCell.innerHTML = elem[sLang];
			oHRow.appendChild(oCell)
		});
		oHRow.appendChild(document.createElement("th"))
		oTable.appendChild(oHRow);

		// Rows
		var aRows = _oData.EntryList;
		aRows.forEach((elem) => {
			var oRow = document.createElement("tr");
			aHeader.forEach((headerElem) => {
				var oCell = document.createElement("td");
				var oContent;
				switch (headerElem.type) {
					case "number":
						oContent = document.createElement("input");
						oContent.setAttribute("type", "number");
						oContent.value = elem[headerElem.id];
						break;
					case "text":
						oContent = document.createElement("input");
						oContent.setAttribute("type", "number");
						oContent.value = elem[headerElem.id];
						break;
					case "list":
						oContent = document.createElement("select");
						_oData.StaticParameter.lists[headerElem.id].forEach((listElem) => {
							var oListItem = document.createElement("option");
							oListItem.setAttribute("value", listElem.id)
							oListItem.innerText = listElem[sLang];
							if (elem[headerElem.id] === listElem.id) {
								oListItem.setAttribute("selected", true);
							}
							oContent.appendChild(oListItem)
						});
						break;
				}

				oCell.appendChild(oContent);
				oRow.appendChild(oCell);
			});
			var oBla = document.createElement("td");
			var oButton = document.createElement("button")
			oBla.appendChild(oButton)
			oRow.appendChild(oBla);
			oTable.appendChild(oRow);
		})

		// New inputs
		var oRow = document.createElement("tr");
		aHeader.forEach((headerElem) => {
			var oCell = document.createElement("td");
				var oContent;
				switch (headerElem.type) {
					case "number":
						oContent = document.createElement("input");
						oContent.setAttribute("type", "number");
						break;
					case "text":
						oContent = document.createElement("input");
						oContent.setAttribute("type", "number");
						break;
					case "list":
						oContent = document.createElement("select");
						_oData.StaticParameter.lists[headerElem.id].forEach((listElem) => {
							var oListItem = document.createElement("option");
							oListItem.setAttribute("value", listElem.id)
							oListItem.innerText = listElem[sLang];
							oContent.appendChild(oListItem)
						});
						break;
				}

				oCell.appendChild(oContent);
				oRow.appendChild(oCell);
		});
		oTable.appendChild(oRow);

		document.getElementById("Data").appendChild(oTable);
	}

	return {
		init: (debug) => {
			if (debug) {
				_bDebug = true;
			}
			LocalStorageHandler.init(_bDebug);
			FileHandler.init(_bDebug);
			VizHandler.init(_bDebug);
			Utils.init(_bDebug);
			_log("module initialized");
		},

		loadFromLocalStorage: () => {
			_oData = LocalStorageHandler.readData();
			_buildTable();
		},

		saveToLocalStorage: () => {
			LocalStorageHandler.writeData(_oData);
		},

		importJSON: () => {
			FileHandler.openFile().then(function (sData) {
				_oData = LocalStorageHandler.importData(sData);
				_buildTable();
			}.bind(this));
		},

		exportJSON: () => {
			var sData = LocalStorageHandler.exportData(_oData);
			FileHandler.saveFile("Data.json", sData);
		},

		readOData: () => {
			console.log(_oData);
		}
	};
}());