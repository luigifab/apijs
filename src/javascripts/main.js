/**
 * Created J/03/12/2009
 * Updated J/06/02/2020
 *
 * Copyright 2008-2020 | Fabrice Creuzot (luigifab) <code~luigifab~fr>
 * https://www.luigifab.fr/apijs
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

if (!Array.prototype.has) {
	Array.prototype.has = function (needle, key) {
		if (needle instanceof Array) {
			for (key in needle) if (needle.hasOwnProperty(key)) {
				if (this.has(needle[key]))
					return true;
			}
		}
		else {
			for (key in this) if (this.hasOwnProperty(key)) {
				if (this[key] === needle)
					return true;
			}
		}
		return false;
	};
}

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, that, i) {
		that = that || window;
		for (i = 0; i < this.length; i++)
			callback.call(that, this[i], i, this);
	};
}

var apijs = new (function () {

	"use strict";
	this.core = {};
	this.version = 600;

	this.config = {
		lang: 'auto',
		debug: false,
		dialog: {
			closeOnClick: false,
			restrictNavigation: true,
			player: true
		},
		slideshow: {
			ids: 'slideshow',
			anchor: true
		},
		upload: {
			tokenName: 'X-CSRF-Token',
			tokenValue: null
		}
	};

	this.start = function () {

		var elem;

		// bonjour
		console.info('APIJS ' + this.version.toString().split('').join('.') + ' - hello - 1 MB/Mo = 1024 kB/ko');
		if (document.getElementById('oldBrowser'))
			throw new Error('APIJS canceled, #oldBrowser detected!');

		if (elem = document.querySelector('link[href*="apijs/fontello.woff2"]')) {
			if (elem.getAttribute('href').indexOf('?e6c8f63375') < 0)
				console.error('APIJS warning invalid cachekey for link:fontello.woff2?x, it must be ?e6c8f63375');
		}
		if (elem = document.querySelector('script[src*="apijs.min.js?"]')) {
			if (elem.getAttribute('src').indexOf('?v=' + this.version) < 0)
				console.error('APIJS warning invalid cachekey for script:apijs.min.js?x, it must be ?v=' + this.version);
		}

		// instancie
		this.i18n = new this.core.i18n();
		this.player = null;
		this.dialog = new this.core.dialog();
		this.upload = new this.core.upload();
		this.slideshow = new this.core.slideshow();

		// fonctions/événement
		if (typeof setApijsRewrites == 'function') {
			console.error('setApijsRewrites function is deprecated, use apijsbeforeload event');
			setApijsRewrites();
		}
		if (typeof setApijsLang == 'function') {
			console.error('setApijsLang function is deprecated, use apijsbeforeload event');
			setApijsLang();
		}
		if (typeof setApijsConfig == 'function') {
			console.error('setApijsConfig function is deprecated, use apijsbeforeload event');
			setApijsConfig();
		}

		self.dispatchEvent(new CustomEvent('apijsbeforeload'));

		// démarre
		this.i18n.init();
		this.slideshow.init();

		self.addEventListener('popstate', apijs.slideshow.onPopState);
		self.addEventListener('hashchange', apijs.slideshow.onPopState);

		if (this.config.debug) {
			console.info('APIJS available languages: ' + Object.keys(this.i18n.data).join(' '));
			console.info('APIJS language loaded: ' + this.config.lang);
			console.info('APIJS successfully started');
		}

		// événement
		self.dispatchEvent(new CustomEvent('apijsload'));
	};

	this.toArray = function (data) {
		return Array.prototype.slice.call(data, 0);
	};

	this.log = function (txt) {
		if (this.config.debug)
			console.info('APIJS ' + txt);
	};

	this.html = function (selector) {
		if ((selector.indexOf('#') === 0) || (selector.indexOf(this.config.slideshow.ids) === 0))
			return document.getElementById(selector.replace('#', 'apijs'));
		else if (this.dialog.t1)
			return this.dialog.t1.querySelector(selector);
		else
			return null;
	};

	this.formatNumber = function (nb, d) {
		// Firefox 29+ pas 27+, (iOS) Safari 10+ pas 9+
		try {
			d = (d === false) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
			return new Intl.NumberFormat(this.config.lang, d).format(nb);
		}
		catch (e) { return nb.toFixed(2); }
	};

	this.openTab = function (ev) {
		ev.preventDefault();
		if (this.href.length > 0)
			self.open(this.href);
	};

	this.serialize = function (form, filter) {

		filter = (typeof filter == 'string') ? filter : '';
		var q = [];

		// https://gomakethings.com/how-to-serialize-form-data-with-vanilla-js/
		Array.prototype.forEach.call(form.elements, function (elem) {

			if (!elem.name || elem.disabled || ['file', 'reset', 'submit', 'button'].has(elem.type) || (elem.name.indexOf(filter) !== 0)) {

			}
			else if (elem.type === 'select-multiple') {
				for (var n = 0; n < elem.options.length; n++) {
					if (elem.options[n].selected)
						q.push(encodeURIComponent(elem.name) + '=' + encodeURIComponent(elem.options[n].value));
				}
			}
			else if (!['checkbox', 'radio'].has(elem.type) || elem.checked) {
				q.push(encodeURIComponent(elem.name) + '=' + encodeURIComponent(elem.value));
			}
		});

		return q.join('&');
	};

})();

if (typeof self.addEventListener == 'function')
	self.addEventListener('load', apijs.start.bind(apijs));