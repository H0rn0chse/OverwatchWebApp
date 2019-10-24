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
				var oContent = new tInput({
					lang: sLang,
					type: headerElem.type,
					value: elem[headerElem.id],
					listItems: _oData.StaticParameter.lists[headerElem.id]
				}).render();

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
				var oContent = new tInput({
					lang: sLang,
					type: headerElem.type,
					listItems: _oData.StaticParameter.lists[headerElem.id]
				}).render();

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