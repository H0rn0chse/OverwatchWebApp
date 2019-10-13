var LocalStorageHandler = (function () {
	'use strict';
	var MODULE_NAME = "LocalStorageHandler"
	var _bDebug = false;
	var _iMinVersion = 1;
	var _oSettings = {
		version: 1,
		lang: "DE"
	};

	/*//========================================================
	window.buffer = {};
	var oMock = {
		EntryList: [{
			session: 1,
			class: "damage",
			rating: 1000,
			teamSize: 1
		}, {
			session: 1,
			class: "damage",
			rating: 1020,
			teamSize: 1
		}],
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
	window.buffer.Settings = JSON.stringify(_oSettings);
	window.buffer.EntryList = JSON.stringify(oMock.EntryList);
	window.buffer.StaticParameter = JSON.stringify(oMock.StaticParameter);
	//========================================================*/

	function _log (sMsg) {
		if (_bDebug) {
			console.log(sMsg, MODULE_NAME);
		}
	}

	function _checkLocalStorage () {
		var sSettings = localStorage.getItem('Settings');
		//var sSettings = window.buffer['Settings'];

		if (sSettings) { // Initial access
			localStorage.clear();
			localStorage.setItem('Settings', JSON.stringify(_oSettings));
			//window.buffer['Settings'] = JSON.stringify(_oSettings);
		} else {
			_oSettings = JSON.parse(sSettings);
		}
		return true;
	}

	function _checkVersion () {
		return _iMinVersion <= _oSettings.version;
	}

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
			return Utils.readPath(sPath, _oSettings);
		},

		setConfig: (sPath, sValue) => {
			return Utils.setPath(sPath, _oSettings, sValue);
		},

		importData: (sData) => {
			_log("importData started");
			var oTemp = JSON.parse(sData);
			_oSettings = oTemp.Settings;
			delete oTemp.Settings;
			_log("importData successfull");
			return oTemp;
		},

		exportData: (oData) => {
			_log("exportData started");
			var oTemp = {
				Settings: _oSettings,
				EntryList: oData.EntryList,
				StaticParameter: oData.StaticParameter
			}
			_log("exportData successfull");
			return JSON.stringify(oTemp)
		},

		readData: () => {
			_log("readData started");
			var sEntryList = localStorage.getItem('EntryList');
			//var sEntryList = window.buffer.EntryList;
			var sStaticParameter = localStorage.getItem('StaticParameter');
			//var sStaticParameter = window.buffer.StaticParameter;
			var oTemp = {
				EntryList: JSON.parse(sEntryList),
				StaticParameter: JSON.parse(sStaticParameter),
			}
			_log("readData successfull");
			return oTemp;
		},

		writeData: (oData) => {
			_log("writeData started");
			localStorage.setItem('EntryList', oData.EntryList);
			//window.buffer.EntryList = oData.EntryList;
			localStorage.setItem('StaticParameter', oData.StaticParameter);
			//window.buffer.StaticParameter = oData.StaticParameter;
			_log("writeData successfull");
		}
	};
}());