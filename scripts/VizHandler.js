var VizHandler = (function () {
	'use strict';
	var MODULE_NAME = "VizHandler"
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

		createViz: () => {
			_log("createViz started");
			_log("createViz successfull");
		}
	};
}());