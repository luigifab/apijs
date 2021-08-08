/**
 * Created J/03/12/2009
 * Updated V/09/07/2021
 *
 * Copyright 2008-2021 | Fabrice Creuzot (luigifab) <code~luigifab~fr>
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
	this.version = 680;

	this.config = {
		lang: 'auto',
		debug: false,
		//select: { },
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
			if (elem.getAttribute('href').indexOf('?a3ab5acff3') < 0)
				console.error('APIJS warning invalid cachekey for link:fontello.woff2?x, it must be ?a3ab5acff3');
		}
		if (elem = document.querySelector('script[src*="apijs.min.js?v="]')) {
			if (elem.getAttribute('src').indexOf('?v=' + this.version) < 0)
				console.error('APIJS warning invalid cachekey for script:apijs.min.js?x, it must be ?v=' + this.version);
		}

		// instancie
		this.i18n = new this.core.i18n();
		//this.select = new this.core.select();
		this.dialog = new this.core.dialog();
		this.upload = new this.core.upload();
		this.slideshow = new this.core.slideshow();
		self.dispatchEvent(new CustomEvent('apijsbeforeload'));

		// démarre
		this.i18n.init();
		this.slideshow.init();
		//this.select.init();
		document.querySelectorAll('video.apijsplayer[data-src]').forEach(function (elem) {
			apijs.startPlayer(elem, elem.getAttribute('data-src'));
		});

		self.addEventListener('popstate', this.slideshow.onPopState);
		self.addEventListener('hashchange', this.slideshow.onPopState);

		if (this.config.debug) {
			console.info('APIJS available languages: ' + Object.keys(this.i18n.data).join(' '));
			console.info('APIJS language loaded: ' + this.config.lang);
			console.info('APIJS successfully started');
		}

		// événement
		self.dispatchEvent(new CustomEvent('apijsload'));
	};

	this.formatNumber = function (nb, dec) {

		// par défaut 2 chiffres
		var dgt = (typeof dec == 'number') ? dec : ((dec === false) ? 0 : 2), str;

		// Firefox 29+ pas 27+, (iOS) Safari 10+ pas 9+
		try {
			str = new Intl.NumberFormat(this.config.lang, { minimumFractionDigits: dgt, maximumFractionDigits: dgt }).format(nb);
		}
		catch (ignore) {
			str = nb.toFixed(dgt);
		}

		// conserve 00 si on veut vraiment 2 chiffres
		return (typeof dec == 'number') ? str : str.replace(/[.,]00$/, '');
	};

	this.startPlayer = function (elem, url) {

		if (this.config.dialog.player === true) {
			elem.videoPlayer = new this.core.player(elem, url);
			elem.parentNode.classList.add('apijsvideoplayer');
			return true;
		}

		if (typeof this.config.dialog.player == 'function') {
			this.config.dialog.player(elem, url);
			return true;
		}

		return false;
	};

	this.toArray = function (data) {
		return Array.prototype.slice.call(data, 0);
	};

	this.openTab = function (ev) {
		ev.preventDefault();
		if (this.href.length > 0)
			self.open(this.href);
	};

	this.log = function (txt) {
		if (this.config.debug)
			console.info('APIJS ' + txt);
	};

	this.html = function (selector, id) {
		if ((id === true) || (selector.indexOf('#') === 0))
			return document.getElementById(selector.replace('#', 'apijs'));
		else if (this.dialog.t1)
			return this.dialog.t1.querySelector(selector);
		else
			return null;
	};

	this.requestFullscreen = function (elem) {
		if (document.webkitFullscreenElement)
			document.webkitCancelFullScreen();
		else if (document.mozFullScreenElement)
			document.mozCancelFullScreen();
		else if (document.fullscreenElement)
			document.cancelFullScreen();
		else if (elem.webkitRequestFullscreen)
			elem.webkitRequestFullscreen();
		else if (elem.requestFullscreen)
			elem.requestFullscreen();
		else if (elem.mozRequestFullScreen)
			elem.mozRequestFullScreen();
	};

	this.serialize = function (form, filter) {

		var data = [];
		filter   = (typeof filter == 'string') ? filter : '';

		// https://gomakethings.com/how-to-serialize-form-data-with-vanilla-js/
		Array.prototype.forEach.call(form.elements, function (elem, idx) {

			if (!elem.name || elem.disabled || ['file', 'reset', 'submit', 'button'].has(elem.type) || (elem.name.indexOf(filter) !== 0))
				return;

			if (elem.type === 'select-multiple') {
				for (idx = 0; idx < elem.options.length; idx++) {
					if (elem.options[idx].selected)
						data.push(encodeURIComponent(elem.name) + '=' + encodeURIComponent(elem.options[idx].value));
				}
			}
			else if (!['checkbox', 'radio'].has(elem.type) || elem.checked) {
				data.push(encodeURIComponent(elem.name) + '=' + encodeURIComponent(elem.value));
			}
		});

		return data.join('&');
	};

})();

if (typeof self.addEventListener == 'function')
	self.addEventListener('load', apijs.start.bind(apijs));