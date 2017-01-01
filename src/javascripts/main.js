/**
 * Created J/03/12/2009
 * Updated D/18/12/2016
 *
 * Copyright 2008-2017 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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

if (!Array.prototype.hasOwnProperty('has')) {
	Object.defineProperty(Array.prototype, 'has', {
		value: function (needle) {
			var key;
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
		},
		enumerable: false,
	});
}

if (!Object.prototype.hasOwnProperty('invokeAll')) {
	Object.defineProperty(Object.prototype, 'invokeAll', {
		value: function (method) {
			var args = Array.prototype.slice.call(arguments).slice(1), key;
			for (key in this) if (this.hasOwnProperty(key)) {
				if (typeof this[key] === 'object') {
					if (typeof this[key][method] === 'function')
						this[key][method].apply(this[key], args);
				}
			}
		},
		enumerable: false,
	});
}

var apijs = {

	core: {},
	version: 530,

	config: {
		lang: 'auto',
		debug: false,
		dialog: {
			closeOnClick: false,
			restrictNavigation: true
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

		console.info('APIJS ' + this.version.toString().replace(/([0-9]+)([0-9])([0-9])$/g, '$1.$2.$3') + ' Hello! 1 MB/Mo = 1024 kB/ko');

		if (document.getElementById('oldBrowser'))
			throw new Error('APIJS canceled, #oldBrowser detected!');

		// démarrage de l'application
		this.i18n = new this.core.i18n();
		this.dialog = new this.core.dialog();
		this.upload = new this.core.upload();
		this.slideshow = new this.core.slideshow();

		if (typeof setApijsRewrites === 'function')
			setApijsRewrites();
		if (typeof setApijsLang === 'function')
			setApijsLang();
		if (typeof setApijsConfig === 'function')
			setApijsConfig();

		if (this.config.debug) {
			console.info('APIJS available languages: ' + Object.keys(this.i18n.data).join(','));
			console.info('APIJS setApijsLang:' + ((typeof setApijsLang === 'function') ? 'yes' : 'no') + ' setApijsConfig:' + ((typeof setApijsConfig === 'function') ? 'yes' : 'no') + ' setApijsRewrites:' + ((typeof setApijsRewrites === 'function') ? 'yes' : 'no'));
		}

		this.i18n.init();
		this.slideshow.init();

		window.addEventListener('popstate', apijs.slideshow.popState, false);
		window.addEventListener('hashchange', apijs.slideshow.popState, false);

		if (this.config.debug) {
			console.info('APIJS language loaded: ' + this.config.lang);
			console.info('APIJS slideshows loaded: ' + this.slideshow.ready);
			console.info('APIJS successfully started');
		}
	},

	error: function (method, data) {

		var key, text = [''];

		if (typeof data === 'string') {
			text.push(data);
		}
		else {
			for (key in data) if (data.hasOwnProperty(key))
				text.push(key + ': ' + data[key]);
		}

		if (this.config.debug)
			this.dialog.dialogInformation('(debug) Invalid call', '[pre]' + method + text.join('[br]➩ '), 'debug');

		console.warn('APIJS ' + method + text.join(', '));
	},

	log: function (txt) {
		if (apijs.config.debug)
			console.log('APIJS ' + txt);
	},

	html: function (s) {
		if ((s.indexOf('#') === 0) || (s.indexOf(this.config.slideshow.ids) === 0))
			return document.getElementById(s.replace('#', 'apijs'));
		else if (this.dialog.t1)
			return this.dialog.t1.querySelector(s);
		else
			return null;
	},

	openTab: function (ev) {
		ev.preventDefault();
		window.open(this.href);
	},

	// basée sur form-serialize
	// http://code.google.com/p/form-serialize/ (0.2)
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

	// objectFitImages (voir aussi dans le CSS : « object-fit:scale-down; font-family:'object-fit:scale-down;'; »)
	// https://github.com/bfred-it/object-fit-images (2.5.9)
	// Copyright 2016 Federico Brigante, Licence MIT
	/* jshint ignore:start */
	objectFitImages: function () {
		"use strict";function t(t){for(var e,r=getComputedStyle(t).fontFamily,i={};null!==(e=c.exec(r));)i[e[1]]=e[2];return i}function e(e,i){if(!e[n].parsingSrcset){var s=t(e);if(s["object-fit"]=s["object-fit"]||"fill",!e[n].s){if("fill"===s["object-fit"])return;if(!e[n].skipTest&&l&&!s["object-position"])return}var c=e[n].ios7src||e.currentSrc||e.src;if(i)c=i;else if(e.srcset&&!u&&window.picturefill){var o=window.picturefill._;e[n].parsingSrcset=!0,e[o.ns]&&e[o.ns].evaled||o.fillImg(e,{reselect:!0}),e[o.ns].curSrc||(e[o.ns].supported=!1,o.fillImg(e,{reselect:!0})),delete e[n].parsingSrcset,c=e[o.ns].curSrc||c}if(e[n].s)e[n].s=c,i&&(e[n].srcAttr=i);else{e[n]={s:c,srcAttr:i||f.call(e,"src"),srcsetAttr:e.srcset},e.src=n;try{e.srcset&&(e.srcset="",Object.defineProperty(e,"srcset",{value:e[n].srcsetAttr})),r(e)}catch(t){e[n].ios7src=c}}e.style.backgroundImage='url("'+c+'")',e.style.backgroundPosition=s["object-position"]||"center",e.style.backgroundRepeat="no-repeat",/scale-down/.test(s["object-fit"])?(e[n].i||(e[n].i=new Image,e[n].i.src=c),function t(){return e[n].i.naturalWidth?void(e[n].i.naturalWidth>e.width||e[n].i.naturalHeight>e.height?e.style.backgroundSize="contain":e.style.backgroundSize="auto"):void setTimeout(t,100)}()):e.style.backgroundSize=s["object-fit"].replace("none","auto").replace("fill","100% 100%")}}function r(t){var r={get:function(){return t[n].s},set:function(r){return delete t[n].i,e(t,r),r}};Object.defineProperty(t,"src",r),Object.defineProperty(t,"currentSrc",{get:r.get})}function i(){a||(HTMLImageElement.prototype.getAttribute=function(t){return!this[n]||"src"!==t&&"srcset"!==t?f.call(this,t):this[n][t+"Attr"]},HTMLImageElement.prototype.setAttribute=function(t,e){!this[n]||"src"!==t&&"srcset"!==t?g.call(this,t,e):this["src"===t?"src":t+"Attr"]=String(e)})}function s(t,r){var i=!A&&!t;if(r=r||{},t=t||"img",a&&!r.skipTest)return!1;"string"==typeof t?t=document.querySelectorAll("img"):"length"in t&&(t=[t]);for(var c=0;c<t.length;c++)t[c][n]=t[c][n]||r,e(t[c]);i&&(document.body.addEventListener("load",function(t){"IMG"===t.target.tagName&&s(t.target,{skipTest:r.skipTest})},!0),A=!0,t="img"),r.watchMQ&&window.addEventListener("resize",s.bind(null,t,{skipTest:r.skipTest}))}var n="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",c=/(object-fit|object-position)\s*:\s*([-\w\s%]+)/g,o=new Image,l="object-fit"in o.style,a="object-position"in o.style,u="string"==typeof o.currentSrc,f=o.getAttribute,g=o.setAttribute,A=!1;return s.supportsObjectFit=l,s.supportsObjectPosition=a,i(),s
	}()
	/* jshint ignore:end */
};

if (typeof window.addEventListener === 'function')
	window.addEventListener('load', apijs.start.bind(apijs), false);