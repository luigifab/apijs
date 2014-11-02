/**
 * Created J/03/12/2009
 * Updated S/25/10/2014
 * Version 108
 *
 * Copyright 2008-2014 | Fabrice Creuzot (luigifab) <code~luigifab~info>
 * http://www.luigifab.info/apijs
 *
 * This program is free software, you can redistribute it or modify
 * it under the terms of the GNU General Public License (GPL) as published
 * by the free software foundation, either version 2 of the license, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but without any warranty, without even the implied warranty of
 * merchantability or fitness for a particular purpose. See the
 * GNU General Public License (GPL) for more details.
 */

if (!Function.prototype.hasOwnProperty('bind')) {
	// http://stackoverflow.com/a/1558289
	Function.prototype.bind = function (owner) {
		var that = this, args = Array.prototype.slice.call(arguments, 1);
		return function () {
			return that.apply(owner, (args.length === 0) ? arguments :
				(arguments.length === 0) ? args : args.concat(Array.prototype.slice.call(arguments, 0)));
		};
	};
}

if (!String.prototype.hasOwnProperty('trim')) {
	// http://stackoverflow.com/a/498995
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

var apijs = {

	core: {},
	version: 510,
	config: {
		lang: 'auto',
		debug: false,
		dialog: {
			closeOnClick: false,
			restrictNavigation: true,
			emotes: true,
			imagePrev: null,
			imageNext: null,
			imageClose: null
		},
		slideshow: {
			ids: 'slideshow'
		},
		upload: {
			tokenName: 'authenticity_token',
			tokenValue: null
		}
	},

	// démarrage
	start: function () {

		// vérification du navigateur avec information dans la console
		// ne démarre pas si le navigateur est une épave
		var ua = navigator.userAgent, test = [], v;

		// Opera < 13 = Presto ou Opera
		test.push(/Presto|Opera/.test(ua));
		test.push(0);
		// Firefox 4 = Gecko 2.0 (attention au like Gecko)
		v = ua.slice(ua.indexOf('rv:') + 3);
		v = parseFloat(v.slice(0, v.indexOf(')')));
		test.push(('Gecko/'.indexOf(ua) > 0) && (v < 2));
		test.push(v);
		// Safari 6 = WebKit 536.25, Chromium/Chrome 19 = WebKit 536.5 (Chromium/Chrome 18 = 535.19)
		v = ua.slice(ua.indexOf('WebKit/') + 7);
		v = parseFloat(v.slice(0, v.indexOf(' ')));
		test.push(('WebKit/'.indexOf(ua) > 0) && (v < 536.25));
		test.push(v);

		try {
			console.info('APIJS Hello! Starting ' + this.version.toString().replace(/([0-9]+)([0-9])([0-9])$/g, '$1.$2.$3') + '/' + this.config.lang);
			console.info('APIJS oldPresto=' + test[0] + ' oldGecko=' + test[2] + '/' + test[3] + ' oldWebKit=' + test[4] + '/' + test[5]);
		}
		catch (e) {
			// dans le cas ou la console n'existe pas (par exemple avec IE 9)
			window.console = { info: function () {}, warn: function () {}, log: function () {} };
		}
		if (this.inArray(true, test)) {
			console.warn('APIJS canceled for old browser');
			return;
		}

		// démarrage de l'application
		this.i18n = new this.core.i18n();
		this.dialog = new this.core.dialog();
		this.upload = new this.core.upload();
		this.slideshow = new this.core.slideshow();

		// appelle des fonctions utilisateurs
		if (typeof setApijsRewrites === 'function')
			setApijsRewrites();
		if (typeof setApijsLang === 'function')
			setApijsLang();
		if (typeof setApijsConfig === 'function')
			setApijsConfig();

		// activation du mode debug
		if (this.config.debug) {
			this.logger(this.i18n, 'apijs.i18n.');
			this.logger(this.dialog, 'apijs.dialog.');
			this.logger(this.upload, 'apijs.upload.');
			this.logger(this.slideshow, 'apijs.slideshow.');
			console.info('APIJS debug mode enabled');
			console.info('APIJS available languages: ' + Object.keys(this.i18n.data).join(','));
			console.info('APIJS setApijsLang:' + ((typeof setApijsLang === 'function') ? 'yes' : 'no') + ' setApijsConfig:' + ((typeof setApijsConfig === 'function') ? 'yes' : 'no') + ' setApijsRewrites:' + ((typeof setApijsRewrites === 'function') ? 'yes' : 'no'));
		}

		// initilisation des traductions
		// et du diaporama
		this.i18n.init();
		this.slideshow.init();

		// finialisation du démarrage
		if (this.config.debug) {
			console.info('APIJS language loaded: ' + this.config.lang);
			console.info('APIJS slideshows loaded: ' + this.slideshow.started);
			console.info('APIJS Okay! Successfully started');
		}
	},

	// utilitaires
	openTab: function (ev) {
		ev.preventDefault();
		window.open(this.href);
	},
	inArray: function (needle, haystack) {
		var key;
		if (needle instanceof Array) {
			for (key in needle) if (needle.hasOwnProperty(key)) {
				if (apijs.inArray(needle[key], haystack))
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
	},
	serialize: function (form) {

		// Basé sur form-serialize 0.2 (http://code.google.com/p/form-serialize/)
		var nodeName, nodeType, i, j, q = [];

		for (i = form.elements.length - 1; i >= 0; i = i - 1) {

			nodeName = form.elements[i].nodeName;
			nodeType = form.elements[i].type;

			if (nodeName === 'INPUT') {
				if (this.inArray(nodeType, ['checkbox', 'radio'])) {
					if (form.elements[i].checked)
						q.push(form.elements[i].getAttribute('name') + '=' + encodeURIComponent(form.elements[i].value));
				}
				else if (!this.inArray(nodeType, ['file', 'button', 'reset', 'submit'])) {
					q.push(form.elements[i].getAttribute('name') + '=' + encodeURIComponent(form.elements[i].value));
				}
			}
			else if (nodeName === 'TEXTAREA') {
				q.push(form.elements[i].getAttribute('name') + '=' + encodeURIComponent(form.elements[i].value));
			}
			else if (nodeName === 'SELECT') {
				if (nodeType === 'select-multiple') {
					for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
						if (form.elements[i].options[j].selected)
							q.push(form.elements[i].getAttribute('name') + '=' + encodeURIComponent(form.elements[i].options[j].value));
					}
				}
				else {
					q.push(form.elements[i].getAttribute('name') + '=' + encodeURIComponent(form.elements[i].value));
				}
			}
		}

		return q.join('&');
	},
	error: function (method, data) {

		var key, text = [];

		if (typeof data === 'string') {
			text.push(data);
		}
		else {
			for (key in data) if (data.hasOwnProperty(key))
				text.push(key + ': ' + data[key]);
		}

		if (this.config.debug)
			this.dialog.dialogInformation('(debug) Invalid call', '[pre]' + method + '[br]➩ ' + text.join('[br]➩ '), 'debug');

		console.warn(method + ' => ' + text.join(' / '));
	},

	// mode debug (http://stackoverflow.com/a/3919564)
	methods: {},
	logger: function (src, scope) {

		for (var func in src) {
			if (typeof(src[func]) === 'function') {

				// store the original to our global pool
				apijs.methods[scope + func] = src[func];

				// create an closure to maintain function name
				(function () {
					// do not remove this
					var date, functionName = func;
					// overwrite the function with our own version
					src[functionName] = function () {

						// convert arguments to array
						var args = [].splice.call(arguments, 0);

						// do the logging before callling the method
						if (functionName.indexOf('nodeTranslate') < 0) {

							date = new Date();
							date = date.getMinutes() + 'm' + date.getSeconds() + 's' + date.getMilliseconds() + 'ms ';

							if ((functionName.indexOf('dialog') > -1) || (functionName.indexOf('sendFile') > -1))
								console.info('displaying ' + scope + functionName + '()');
							else if (functionName.indexOf('translate') > -1)
								console.log(date + scope + functionName + '(' + args.join(',') + ')');
							else if (functionName.indexOf('actionKey') > -1)
								console.log(date + scope + functionName + '(' + args[0].keyCode + ')');
							else
								console.log(date + scope + functionName + '(' + args.join(',') + ')');
						}

						// call the original method but in the src scope, and return the results
						return apijs.methods[scope + functionName].apply(src, args);
					};
				})();
			}
		}
	}
};

if (typeof window.addEventListener === 'function')
	window.addEventListener('load', apijs.start.bind(apijs), false);