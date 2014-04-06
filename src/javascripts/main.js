"use strict";
/**
 * Created J/03/12/2009
 * Updated S/11/01/2014
 * Version 99
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
	version: 500,
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
		}
	},
	start: function () {

		this.i18n = new apijs.core.i18n();

		if (typeof setApijsLang === 'function')
			setApijsLang();

		this.i18n.init();

		if (typeof setApijsConfig === 'function')
			setApijsConfig();

		this.dialog = new apijs.core.dialog();
		this.upload = new apijs.core.upload();
		this.slideshow = new apijs.core.slideshow();
		this.slideshow.init();

		if (typeof setApijsRewrites === 'function')
			setApijsRewrites();
	},
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
	}
};

if ((typeof window.addEventListener === 'function') && (!/Presto|Opera.{1}12/.test(navigator.userAgent)))
	window.addEventListener('load', apijs.start.bind(apijs), false);