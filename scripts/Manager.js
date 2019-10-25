'use strict';
Promise.all([
	load.js("scripts/LocalStorageHandler.js"),
	load.js("scripts/FileHandler.js"),
	load.js("scripts/VizHandler.js"),
	load.js("scripts/Utils.js"),
	load.js("scripts/templates/Input.js"),
]).then(function () {
	window.Manager = (() => {
		const MODULE_NAME = "Manager"
		let _bDebug = false;
		let _oData = {};

		const _log = sMsg => {
			if (_bDebug) {
				console.log(sMsg, MODULE_NAME);
			}
		};

		const _buildTable = () => {
			const sLang = LocalStorageHandler.getConfig("lang")
			const oTable = document.createElement("table");
			// Header
			const oHRow = document.createElement("tr");
			const aHeader = _oData.StaticParameter.values;
			aHeader.forEach(oElem => {
				const oCell = document.createElement("th");
				oCell.innerHTML = oElem[sLang];
				oHRow.appendChild(oCell)
			});
			oHRow.appendChild(document.createElement("th"))
			oTable.appendChild(oHRow);

			// Rows
			const aRows = _oData.EntryList;
			aRows.forEach(oElem => {
				const oRow = document.createElement("tr");
				aHeader.forEach(headerElem => {
					const oCell = document.createElement("td");
					const oContent = new tInput({
						lang: sLang,
						type: headerElem.type,
						value: oElem[headerElem.id],
						listItems: _oData.StaticParameter.lists[headerElem.id]
					}).render();

					oCell.appendChild(oContent);
					oRow.appendChild(oCell);
				});
				const oBla = document.createElement("td");
				const oButton = document.createElement("button")
				oBla.appendChild(oButton)
				oRow.appendChild(oBla);
				oTable.appendChild(oRow);
			})

			// New inputs
			const oRow = document.createElement("tr");
			aHeader.forEach((headerElem) => {
				const oCell = document.createElement("td");
				const oContent = new tInput({
					lang: sLang,
					type: headerElem.type,
					listItems: _oData.StaticParameter.lists[headerElem.id]
				}).render();

				oCell.appendChild(oContent);
				oRow.appendChild(oCell);
			});
			oTable.appendChild(oRow);

			document.getElementById("Data").appendChild(oTable);
		};

		const _loadFromLocalStorage = () => {
			_oData = LocalStorageHandler.readData();
			_buildTable();
		};

		const _saveToLocalStorage = () => {
			LocalStorageHandler.writeData(_oData);
		};

		const _importJSON = () => {
			FileHandler.openFile().then(sData => {
				_oData = LocalStorageHandler.importData(sData);
				_buildTable();
			});
		};

		const _exportJSON = () => {
			const sData = LocalStorageHandler.exportData(_oData);
			FileHandler.saveFile("Data.json", sData);
		};

		const _readOData = () => {
			console.log(_oData);
		};

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
				return _loadFromLocalStorage();
			},

			saveToLocalStorage: () => {
				return _saveToLocalStorage();
			},

			importJSON: () => {
				return _importJSON();
			},

			exportJSON: () => {
				return _exportJSON();
			},

			readOData: () => {
				return _readOData();
			}
		};
	})();
});