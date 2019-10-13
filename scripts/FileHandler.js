var FileHandler = (function () {
	'use strict';
	var MODULE_NAME = "FileHandler"
	var _bDebug = false;
	var _eFileHandler;
	var fnResolve = () => {};
	var fnReject = () => {};

	function _log (sMsg) {
		if (_bDebug) {
			console.log(sMsg, MODULE_NAME);
		}
	}

	function _addLoadFile () {
		_eFileHandler = document.createElement("input")
		_eFileHandler.setAttribute('id', "FileHandler");
		_eFileHandler.setAttribute('type', 'file');
		_eFileHandler.setAttribute('accept', '.json');
		_eFileHandler.setAttribute('multiple', false);
		document.getElementById("hidden").appendChild(_eFileHandler);

		_eFileHandler.onchange = _handleFileSelect;
	}

	function _handleFileSelect (evt) {
		var oFile = evt.target.files[0];
		var oReader = new FileReader();
		oReader.onload = (evt) => {
				_log("openFile successfull");
				return fnResolve(evt.target.result);
			}
		oReader.readAsText(oFile);
	}

	function _saveFile(filename, text) {
        var oTemp = document.createElement('a');
        oTemp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        oTemp.setAttribute('download', filename);
        oTemp.click();
	}

	return {
		init: (debug) => {
			if (debug) {
				_bDebug = true;
			}
			_addLoadFile();
			
			_log("module initialized");
		},

		saveFile: (filename, text) => {
			_log("saveFile started");
			_saveFile(filename, text);
			_log("saveFile successfull");
		},

		openFile: () => {
			_log("openFile started");
			_eFileHandler.click();
			fnReject();
			return new Promise((resolve, reject) => {
				fnResolve = resolve;
				fnReject = reject;
			});
		}
	};
}());