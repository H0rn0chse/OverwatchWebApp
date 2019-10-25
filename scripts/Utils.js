'use strict';
Promise.all([
	Promise.resolve()
]).then(function () {
	window.Utils = (() => {
		const MODULE_NAME = "Utils"
		let _bDebug = false;

		const _log = (sMsg) => {
			if (_bDebug) {
				console.log(sMsg, MODULE_NAME);
			}
		};

		const _readPath = (sPath, oObj) => {
			let oTemp = JSON.parse(JSON.stringify(oObj));
				const aParts = sPath.split(".")
				aParts.forEach((elem) => {
					if (oTemp[elem]) {
						oTemp = oTemp[elem];
					} else {
						oTemp = undefined;
					}
				})
				return oTemp;
		};

		const _setPath = (sPath, oObj, oValue) => {
			const aParts = sPath.split(".")
				aParts.forEach((elem) => {
					if (!oObj[elem]) {
						oObj[elem] = {}
					}
					oObj = oObj[elem];
				})
				oObj = oValue;
		};

		return {
			init: (debug) => {
				if (debug) {
					_bDebug = true;
				}

				_log("module initialized");
			},

			readPath: (sPath, oObj) => {
				return _readPath(sPath, oObj);
			},

			setPath: (sPath, oObj, oValue) => {
				return _setPath(sPath, oObj, oValue);
			}
		};
	})();
});