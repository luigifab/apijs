/**
 * Created J/03/12/2009
 * Updated L/25/05/2015
 * Version 116
 *
 * Copyright 2008-2015 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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

if (!Array.prototype.hasOwnProperty('has')) {
	Array.prototype.has = function (needle) {
		var key;
		if (needle instanceof Array) {
			for (key in needle) if (needle.hasOwnProperty(key)) {
				if (this.has(needle[key]))
					return true;
			}
		}
		else {
			for (key in this) if (this.hasOwnProperty(key)) {
				if (!isNaN(key) && (this[key] === needle))
					return true;
			}
		}
		return false;
	};
}

var apijs = {

	core: {},
	version: 520,
	config: {
		lang: 'auto',
		debug: false,
		dialog: {
			emotes: true,
			player: true,
			closeOnClick: false,
			restrictNavigation: true,
			imagePrev: null,
			imageNext: null,
			imageClose: null
		},
		slideshow: {
			ids: 'slideshow',
			anchor: true
		},
		upload: {
			tokenName: 'authenticity_token',
			tokenValue: null
		}
	},

	start: function () {

		// vérification du navigateur avec information dans la console
		// ne démarre pas si le navigateur correspond à une épave
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
			console.info('APIJS ' + this.version.toString().replace(/([0-9]+)([0-9])([0-9])$/g, '$1.$2.$3') + ' Hello!');
			console.info('APIJS oldPresto=' + test[0] + ' oldGecko=' + test[2] + '/' + test[3] + ' oldWebKit=' + test[4] + '/' + test[5]);
		}
		catch (e) {
			// dans le cas ou la console n'existe pas (par exemple avec IE 9)
			window.console = { info: function () {}, warn: function () {}, log: function () {} };
		}
		if (test.has(true)) {
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

		// if (apijs.config.slideshow.anchor)
		// attention, si désactivé cela empèche les ancres de fonctionner
		window.addEventListener('popstate', apijs.slideshow.popState, false);
		window.addEventListener('hashchange', apijs.slideshow.popState, false);

		// finalisation du démarrage
		if (this.config.debug) {
			console.info('APIJS language loaded: ' + this.config.lang);
			console.info('APIJS slideshows loaded: ' + this.slideshow.started);
			console.info('APIJS successfully started');
		}
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

	openTab: function (ev) {
		ev.preventDefault();
		window.open(this.href);
	},

	// fonction basée sur form-serialize 0.2
	// http://code.google.com/p/form-serialize/
	serialize: function (form) {

		var nodeName, nodeType, i, j, q = [];

		for (i = form.elements.length - 1; i >= 0; i = i - 1) {

			nodeName = form.elements[i].nodeName;
			nodeType = form.elements[i].type;

			if (nodeName === 'INPUT') {
				if (['checkbox', 'radio'].has(nodeType)) {
					if (form.elements[i].checked)
						q.push(form.elements[i].getAttribute('name') + '=' + encodeURIComponent(form.elements[i].value));
				}
				else if (['file', 'button', 'reset', 'submit'].has(nodeType)) {
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

	// activation par configuration via setApijsConfig (sinon cela ne fonctionnera pas)
	// http://stackoverflow.com/a/3919564
	logger: function (src, scope) {

		for (var func in src) {
			if (typeof(src[func]) === 'function') {

				// store the original to our global pool
				apijs.methods[scope + func] = src[func];

				// create an closure to maintain function name
				(function () {
					// do not remove this
					var functionName = func;
					// overwrite the function with our own version
					src[functionName] = function () {

						// convert arguments to array
						var args = [].splice.call(arguments, 0);

						// do the logging before callling the method
						// sauf pour i18n.*ranslate
						if (functionName.indexOf('ranslate') < 0) {

							if ((functionName.indexOf('dialog') > -1) || (functionName.indexOf('sendFile') > -1))
								console.info('displaying ' + scope + functionName + '()');
							else if (functionName.indexOf('popState') > -1)
								console.info('history ' + scope + functionName + '()');
							else if (functionName.indexOf('actionKey') > -1)
								console.log(scope + functionName + '(' + (isNaN(args[0]) ? args[0].keyCode : args[0]) + ')');
							else
								console.log(scope + functionName + '(' + args.join(', ') + ')');
						}

						// call the original method but in the src scope, and return the results
						return apijs.methods[scope + functionName].apply(src, args);
					};
				})();
			}
		}
	},
	methods: {}
};

if (typeof window.addEventListener === 'function')
	window.addEventListener('load', apijs.start.bind(apijs), false);