"use strict";
const load = (() => {
	const _oFiles = {
		script: [],
		link: []
	};
	const _load = tag => {
		return url => {
			
			return new Promise((resolve, reject) => {
				if (!_oFiles[tag].includes(url)) {
					const oRef = document.createElement(tag);
					const attr = 'src';
			
					oRef.onload = () => {resolve(url);};
					oRef.onerror = () => {reject(url);};
			
					switch(tag) {
						case 'script':
							oRef.async = true;
							break;
						case 'link':
							oRef.type = 'text/css';
							oRef.rel = 'stylesheet';
							attr = 'href';
							break;
					}
					oRef[attr] = url;
					document.getElementsByTagName("head")[0].appendChild(oRef);
					_oFiles[tag].push(url);
				} else {
					resolve(url);
				}
			});
		};
	};
	
	return {
	  css: _load('link'),
	  js: _load('script')
	}
})();