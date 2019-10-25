'use strict';
Promise.all([
	Promise.resolve()
]).then(function () {
	window.VizHandler = (() => {
		'use strict';
		const MODULE_NAME = "VizHandler"
		let _bDebug = false;

		const _log = sMsg => {
			if (_bDebug) {
				console.log(sMsg, MODULE_NAME);
			}
		};

		return {
			init: (debug) => {
				if (debug) {
					_bDebug = true;
				}

				_log("module initialized");
			},

			createViz: () => {
			}
		};
	})();
});