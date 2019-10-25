'use strict';
Promise.all([
	load.js("scripts/Utils.js")
]).then(function () {
	window.LocalStorageHandler = (() => {
		const MODULE_NAME = "LocalStorageHandler"
		let _bDebug = false;
		let _iMinVersion = 1;
		let _oSettings = {
			version: 1,
			lang: "DE"
		};

		const _DefaultObject = {
			EntryList: [],
			StaticParameter : {
				values: [{
					id: "session",
					type: "number",
					DE: "Session"
				}, {
					id: "class",
					type: "list",
					DE: "Klasse"
				}, {
					id: "rating",
					type: "number",
					DE: "SR"
				}, {
					id: "teamSize",
					type: "number",
					DE: "Teamgröße"
				}],
				lists: {
					class: [{
						id: "damage",
						DE: "Schaden"
					}, {
						id: "support",
						DE: "Support"
					}, {
						id: "tank",
						DE: "Tank"
					}]
				}
			}
		};

		const _log = sMsg => {
			if (_bDebug) {
				console.log(sMsg, MODULE_NAME);
			}
		};

		const _checkLocalStorage = () => {
			let sSettings = localStorage.getItem('Settings');

			if (!sSettings) { // Initial access
				localStorage.clear();
				localStorage.setItem('Settings', JSON.stringify(_oSettings));
				localStorage.setItem('EntryList', JSON.stringify(_DefaultObject.EntryList));
				localStorage.setItem('StaticParameter', JSON.stringify(_DefaultObject.StaticParameter));
			} else {
				_oSettings = JSON.parse(sSettings);
			}
			return true;
		};

		const _checkVersion = () => {
			return _iMinVersion <= _oSettings.version;
		};

		const _getConfig = (sPath) => {
			return Utils.readPath(sPath, _oSettings);
		};

		const _setConfig = (sPath, sValue) => {
			return Utils.setPath(sPath, _oSettings, sValue);
		};

		const _importData = (sData) => {
			const oTemp = JSON.parse(sData);
			_oSettings = oTemp.Settings;
			delete oTemp.Settings;
			return oTemp;
		};

		const _exportData = (oData) => {
			const oTemp = {
				Settings: _oSettings,
				EntryList: oData.EntryList,
				StaticParameter: oData.StaticParameter
			}
			return JSON.stringify(oTemp)
		};

		const _readData = () => {
			const sEntryList = localStorage.getItem('EntryList');
			const sStaticParameter = localStorage.getItem('StaticParameter');
			const oTemp = {
				EntryList: JSON.parse(sEntryList),
				StaticParameter: JSON.parse(sStaticParameter),
			}
			return oTemp;
		};

		const _writeData = (oData) => {
			localStorage.setItem('EntryList', oData.EntryList);
			localStorage.setItem('StaticParameter', oData.StaticParameter);
		};

		return {
			init: (debug) => {
				if (debug) {
					_bDebug = true;
				}

				if(!_checkLocalStorage()){
					_log("local storage is corrupted");
				}

				if(!_checkVersion()){
					_log("version is outdated");
				}

				_log("module initialized");
			},

			getConfig: (sPath) => {
				return _getConfig(sPath);
			},

			setConfig: (sPath, sValue) => {
				return _setConfig(sPath, sValue);
			},

			importData: (sData) => {
				return _importData(sData)
			},

			exportData: (oData) => {
				return _exportData(oData);
			},

			readData: () => {
				return _readData();
			},

			writeData: (oData) => {
				return _writeData(oData);
			}
		};
	})();
});