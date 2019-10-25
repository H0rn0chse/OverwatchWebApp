'use strict';
Promise.all([
	Promise.resolve()
]).then(function () {
	window.FileHandler = (() => {
		const MODULE_NAME = "FileHandler"
		let _bDebug = false;
		let _oFileHandler;
		let fnResolve = () => {};
		let fnReject = () => {};

		const _log = sMsg => {
			if (_bDebug) {
				console.log(sMsg, MODULE_NAME);
			}
		};

		const _addLoadFile = () => {
			_oFileHandler = document.createElement("input")
			_oFileHandler.setAttribute('id', "FileHandler");
			_oFileHandler.setAttribute('type', 'file');
			_oFileHandler.setAttribute('accept', '.json');
			_oFileHandler.setAttribute('multiple', false);
			document.getElementById("hidden").appendChild(_oFileHandler);

			_oFileHandler.onchange = _handleFileSelect;
		};

		const _handleFileSelect = oEvt => {
			const oFile = oEvt.target.files[0];
			const oReader = new FileReader();
			oReader.onload = oEvt => {
					_log("openFile successfull");
					return fnResolve(oEvt.target.result);
				}
			oReader.readAsText(oFile);
		};

		const _saveFile = (sFileName, sText) => {
			const oTemp = document.createElement('a');
			oTemp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(sText));
			oTemp.setAttribute('download', sFileName);
			oTemp.click();
		};

		const _openFile = () => {
			_oFileHandler.click();
			fnReject();
			return new Promise((resolve, reject) => {
				fnResolve = resolve;
				fnReject = reject;
			});
		};

		return {
			init: (debug) => {
				if (debug) {
					_bDebug = true;
				}
				_addLoadFile();
				
				_log("module initialized");
			},

			saveFile: (sFileName, sText) => {
				return _saveFile(sFileName, sText);
			},

			openFile: () => {
				return _openFile()
			}
		};
	})();
});