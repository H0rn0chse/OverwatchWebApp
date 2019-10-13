var Utils = (function () {
	'use strict';
	var MODULE_NAME = "Utils"
	var _bDebug = false;

	function _log (sMsg) {
		if (_bDebug) {
			console.log(sMsg, MODULE_NAME);
		}
	}

	return {
		init: (debug) => {
			if (debug) {
				_bDebug = true;
			}

			_log("module initialized");
		},

		readPath: (sPath, oObj) => {
			var oTemp = JSON.parse(JSON.stringify(oObj));
			var aParts = sPath.split(".")
			aParts.forEach((elem) => {
				if (oTemp[elem]) {
					oTemp = oTemp[elem];
				} else {
					oTemp = undefined;
				}
			})
			return oTemp;
		},

		setPath: (sPath, oObj, oValue) => {
			var aParts = sPath.split(".")
			aParts.forEach((elem) => {
				if (!oObj[elem]) {
					oObj[elem] = {}
				}
				oObj = oObj[elem];
			})
			oObj = oValue;
		}
	};
}());