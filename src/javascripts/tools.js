/**
 * Function.bind
 * http://stackoverflow.com/a/1558289
 */
if (!Function.prototype.hasOwnProperty('bind')) {
	Function.prototype.bind = function (owner) {
		var that = this, args = Array.prototype.slice.call(arguments, 1);
		return function () {
			return that.apply(owner, (args.length === 0) ? arguments :
				(arguments.length === 0) ? args : args.concat(Array.prototype.slice.call(arguments, 0)));
		};
	};
}

/**
 * PHP functions
 * http://phpjs.org/
 */
function str_shuffle(data) {
	var result = '', rand = 0;
	while (data.length > 0) {
		rand = Math.floor(Math.random() * data.length);
		result += data[rand];
		data = data.substring(0, rand) + data.substr(rand + 1);
	}
	return result;
}
function in_array(needle, haystack) {

	var key = null;

	if (needle instanceof Array) {
		for (key in needle) if (needle.hasOwnProperty(key)) {
			if (in_array(needle[key], haystack))
				return true;
		}
	}
	else {
		for (key in haystack) if (haystack.hasOwnProperty(key)) {
			if (!isNaN(key) && (haystack[key] === needle))
				return true;
		}
	}

	return false;
}

/**
 * Browser detect
 * http://www.quirksmode.org/js/detect.html
 */
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || 'an unknown browser';
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'an unknown version';
		this.OS = this.searchString(this.dataOS) || 'an unknown OS';
	},
	searchString: function (data) {
		var i, dataString, dataProp;
		for (i = 0; i < data.length; i++) {
			dataString = data[i].string;
			dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) !== -1)
					return data[i].identity;
			}
			else if (dataProp) {
				return data[i].identity;
			}
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index === -1)
			return;
		else
			return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
	},
	dataBrowser: [
		{ string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome' },
		{ string: navigator.userAgent, subString: 'OmniWeb', versionSearch: 'OmniWeb/', identity: 'OmniWeb' },
		{ string: navigator.vendor, subString: 'Apple', identity: 'Safari', versionSearch: 'Version' },
		{ prop: window.opera, identity: 'Opera', versionSearch: 'Version' },
		{ string: navigator.vendor, subString: 'iCab', identity: 'iCab' },
		{ string: navigator.vendor, subString: 'KDE', identity: 'Konqueror' },
		{ string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox' },
		{ string: navigator.vendor, subString: 'Camino', identity: 'Camino' },
		{ string: navigator.userAgent, subString: 'Netscape', identity: 'Netscape' },
		{ string: navigator.userAgent, subString: 'MSIE', identity: 'Internet Explorer', versionSearch: 'MSIE' },
		{ string: navigator.userAgent, subString: 'Gecko', identity: 'Mozilla', versionSearch: 'rv' },
		{ string: navigator.userAgent, subString: 'Mozilla', identity: 'Netscape', versionSearch: 'Mozilla' }
	],
	dataOS : [
		{ string: navigator.platform, subString: 'Win', identity: 'Windows' },
		{ string: navigator.platform, subString: 'Mac', identity: 'Mac' },
		{ string: navigator.userAgent, subString: 'iPhone', identity: 'iPhone/iPod' },
		{ string: navigator.platform, subString: 'Linux', identity: 'Linux' }
	]
};
BrowserDetect.init();