/**
 * Created D/12/04/2009
 * Updated D/12/07/2020
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

apijs.core.dialog = function () {

	"use strict";
	this.klass    = [];
	this.height   = 0;
	this.scroll   = 0; // time
	this.callback = null;
	this.args     = null;
	this.xhr      = null;

	this.ft = /information|confirmation|options|upload|progress|waiting|photo|video|iframe|ajax|start|ready|end|reduce|mobile|tiny|fullscreen/g;
	this.ti = 'a,area,button,input,textarea,select,object,iframe';
	this.ns = 'http://www.w3.org/2000/svg';

	this.media = null;
	this.t0 = null; // fragment
	this.t1 = null; // div id=apijsDialog
	this.t2 = null; // div/form id=apijsBox
	this.a  = null;
	this.b  = null;
	this.c  = null;
	this.d  = null;


	// GÉNÉRATION DES BOÎTES DE DIALOGUE (public return boolean)

	this.dialogInformation = function (title, text, icon) {

		if ((typeof title == 'string') && (typeof text == 'string')) {
			return this.init('information', icon)
				.htmlParent()
				.htmlContent(title, text)
				.htmlBtnOk()
				.show('button.confirm');
		}

		console.error('apijs.dialog.dialogInformation invalid arguments', apijs.toArray(arguments));
		return false;
	};

	this.dialogConfirmation = function (title, text, callback, args, icon) {

		if ((typeof title == 'string') && (typeof text == 'string') && (typeof callback == 'function')) {
			this.callback = callback;
			this.args = args;
			return this.init('confirmation', icon)
				.htmlParent()
				.htmlContent(title, text)
				.htmlBtnConfirm('button', 'apijs.dialog.actionConfirm();')
				.show('button.confirm');
		}

		console.error('apijs.dialog.dialogConfirmation invalid arguments', apijs.toArray(arguments));
		return false;
	};

	this.dialogFormOptions = function (title, text, action, callback, args, icon) {

		if ((typeof title == 'string') && (typeof text == 'string') && (typeof action == 'string') && (typeof callback == 'function')) {
			this.callback = callback;
			this.args = args;
			return this.init('options', icon)
				.htmlParent(action, 'apijs.dialog.actionConfirm();')
				.htmlContent(title, text)
				.htmlBtnConfirm('submit')
				.show(true);
		}

		console.error('apijs.dialog.dialogFormOptions invalid arguments', apijs.toArray(arguments));
		return false;
	};

	this.dialogFormUpload = function (title, text, action, input, multiple, icon) {

		if ((typeof title == 'string') && (typeof text == 'string') && (typeof action == 'string') && (typeof input == 'string')) {
			return this.init('upload', icon)
				.htmlParent(action, 'apijs.upload.actionConfirm();')
				.htmlContent(title, text)
				.htmlUpload(input, (typeof multiple == 'boolean') ? multiple : false)
				.htmlBtnConfirm('submit')
				.show('button.browse');
		}

		console.error('apijs.dialog.dialogFormUpload invalid arguments', apijs.toArray(arguments));
		return false;
	};

	this.dialogProgress = function (title, text, icon) {

		if ((typeof title == 'string') && (typeof text == 'string')) {
			return this.init('progress', icon)
				.htmlParent()
				.htmlContent(title, text)
				.htmlSvgProgress()
				.show();
		}

		console.error('apijs.dialog.dialogProgress invalid arguments', apijs.toArray(arguments));
		return false;
	};

	this.dialogWaiting = function (title, text, icon) {

		if ((typeof title == 'string') && (typeof text == 'string')) {
			return this.init('waiting', icon)
				.htmlParent()
				.htmlContent(title, text)
				.htmlSvgLoader(false)
				.show();
		}

		console.error('apijs.dialog.dialogWaiting invalid arguments', apijs.toArray(arguments));
		return false;
	};

	this.dialogPhoto = function (url, name, date, legend, icon) {

		var slideshow = (typeof icon == 'string');
		icon = slideshow ? 'notransition slideshow loading ' + icon : 'notransition loading';

		if ((typeof url == 'string') && (typeof name == 'string') && (typeof date == 'string') && (typeof legend == 'string')) {
			return this.init('photo', icon)
				.htmlParent()
				.htmlMedia(url, name, date, legend)
				.htmlHelp(slideshow, false)
				.htmlBtnClose()
				.htmlBtnNavigation()
				.htmlSvgLoader()
				.show();
		}

		console.error('apijs.dialog.dialogPhoto invalid arguments', apijs.toArray(arguments));
		return false;
	};

	this.dialogVideo = function (url, name, date, legend, icon) {

		var slideshow = (typeof icon == 'string');
		icon = slideshow ? 'notransition slideshow loading ' + icon : 'notransition loading';

		if ((typeof url == 'string') && (typeof name == 'string') && (typeof date == 'string') && (typeof legend == 'string')) {
			return this.init('video', icon)
				.htmlParent()
				.htmlMedia(url, name, date, legend)
				.htmlHelp(slideshow, url.indexOf('iframe') < 0) // true si pas iframe
				.htmlBtnClose()
				.htmlBtnNavigation()
				.htmlSvgLoader()
				.show();
		}

		console.error('apijs.dialog.dialogVideo invalid arguments', apijs.toArray(arguments));
		return false;
	};

	this.dialogIframe = function (url, close, icon) {

		if ((typeof url == 'string') && (typeof close == 'boolean')) {
			return this.init('iframe', (typeof icon == 'string') ? icon + ' loading' : 'loading', !close)
				.htmlParent()
				.htmlIframe(url)
				.htmlBtnClose(close)
				.htmlSvgLoader(false)
				.show();
		}

		console.error('apijs.dialog.dialogIframe invalid arguments', apijs.toArray(arguments));
		return false;
	};

	this.dialogAjax = function (url, close, callback, args, icon) {

		if ((typeof url == 'string') && (typeof close == 'boolean') && (typeof callback == 'function')) {
			this.callback = callback;
			this.args = args;
			var result = this.init('ajax', (typeof icon == 'string') ? icon + ' loading' : 'loading', !close)
				.htmlParent()
				.htmlBtnClose(close)
				.htmlSvgLoader(false)
				.show();
			// ajax
			this.xhr = new XMLHttpRequest();
			this.xhr.open('GET', url, true);
			this.xhr.onreadystatechange = function () {
				if ((this.xhr.readyState === 4) && (typeof this.callback == 'function')) {
					this.callback(this.xhr, this.args);
					this.remove('loading');
				}
			}.bind(apijs.dialog);
			this.xhr.send();
			return result;
		}

		console.error('apijs.dialog.dialogAjax invalid arguments', apijs.toArray(arguments));
		return false;
	};


	// GESTION DES CLASSES CSS (public sauf update private, return this sauf has return true)

	this.update = function () {

		// il n'est pas question de mettre à jour les attributs class sans l'une des 3 classes de base
		if (this.has('start', 'ready', 'end')) {
			if (apijs.dialog.t1)
				apijs.dialog.t1.setAttribute('class', this.klass.join(' '));
			if (apijs.dialog.t2)
				apijs.dialog.t2.setAttribute('class', this.klass.join(' '));
		}

		return this;
	};

	this.add = function () {

		Array.prototype.forEach.call(arguments, function (css) {
			if (typeof css != 'string')
				console.error('apijs.dialog.add argument is not a string', css);
			if (this.klass.indexOf(css) < 0)
				this.klass.push(css);
		}, this); // pour que ci-dessus this = this

		return this.update();
	};

	this.remove = function () {

		Array.prototype.forEach.call(arguments, function (css) {
			if (typeof css != 'string')
				console.error('apijs.dialog.remove argument is not a string', css);
			if (this.klass.indexOf(css) > -1)
				this.klass.splice(this.klass.indexOf(css), 1);
		}, this); // pour que ci-dessus this = this

		return this.update();
	};

	this.toggle = function (search, replace) {

		if ((typeof search != 'string') || (typeof replace != 'string'))
			console.error('apijs.dialog.toggle argument is not a string', search, replace);

		if (this.has(search))
			this.remove(search);
		if (!this.has(replace))
			this.add(replace);

		return this.update();
	};

	this.has = function () {
		return this.klass.has(apijs.toArray(arguments)); // true if one found
	};


	// GESTION DES INTERACTIONS (private sauf actionClose)

	this.actionClose = function (ev) {

		// \\ au lieu de \ sinon Bad or unnecessary escaping
		if (new RegExp('#(' + apijs.config.slideshow.ids + '[\-\\.]\\d+[\-\\.]\\d+)').test(self.location.href)) {
			if (apijs.config.slideshow.anchor && (typeof history.pushState == 'function'))
				history.pushState({}, '', self.location.href.slice(0, self.location.href.indexOf('#')));
		}

		if (typeof ev == 'object') {
			if ((ev.target.getAttribute('id') === 'apijsDialog') && !apijs.dialog.has('photo', 'video', 'progress', 'waiting', 'lock'))
				apijs.dialog.clear(true);
		}
		else if (this.t1) {
			this.clear(true);
		}
	};

	this.onCloseBrowser = function (ev) {

		if (apijs.dialog.has('progress', 'waiting', 'lock')) {
			ev.preventDefault();
			ev.stopPropagation();
			ev.m = apijs.i18n.translate(124);
			ev.returnValue = ev.m; // Gecko, Trident, Chrome 34+
			return ev.m;           // Gecko, WebKit, Chrome
		}
	};

	this.onResizeBrowser = function () {

		var add = document.querySelector('body').clientWidth <= (apijs.dialog.has('photo', 'video') ? 900 : 460);
		apijs.dialog[add ? 'add' : 'remove']('mobile');

		add = document.querySelector('body').clientWidth <= 300;
		apijs.dialog[add ? 'add' : 'remove']('tiny');
	};

	this.onScrollBrowser = function (ev) {

		var elem = ev.target, brk = false;

		// dialogues du diaporama (suivant/précédent)
		if (apijs.dialog.has('slideshow') && !apijs.dialog.has('playing') && !['OPTION', 'SELECT'].has(elem.nodeName) && ['DOMMouseScroll','mousewheel','panleft','panright'].has(ev.type)) {
			elem = new Date().getTime() / 1000;
			if ((apijs.dialog.scroll < 1) || (elem > (1 + apijs.dialog.scroll))) {
				apijs.dialog.scroll = elem;
				// ev.detail     > 0 si vers le bas avec Firefox
				// ev.wheelDelta < 0 si vers le bas avec Chromium/Opera/Edge...
				brk = (ev.detail > 0) || (ev.wheelDelta < 0); // true si vers le bas
				apijs.slideshow[((ev.type === 'panleft') || brk) ? 'actionNext' : 'actionPrev']();
			}
		}
		// autorise éventuellement le défilement
		// recherche l'éventuel élément scrollable
		else {
			if (elem.nodeName === 'OPTION') {
				elem = elem.parentNode;
			}
			else if (!['TEXTAREA', 'SELECT'].has(elem.nodeName)) {
				while ((brk !== true) && (elem.nodeName !== 'HTML')) {
					if (elem.classList.contains('scrollable'))
						brk = true;
					else
						elem = elem.parentNode;
				}
			}

			// elem = select | textarea | scrollable
			if (elem.nodeName !== 'HTML') {
				// ev.detail     > 0 si vers le bas avec Firefox
				// ev.wheelDelta < 0 si vers le bas avec Chromium/Opera/Edge...
				brk = (ev.detail > 0) || (ev.wheelDelta < 0); // true si vers le bas
				if ((brk && (elem.scrollTop < (elem.scrollHeight - elem.offsetHeight))) || (!brk && (elem.scrollTop > 0)))
					return;
			}
		}

		apijs.dialog.stopScroll(ev);
	};

	this.onScrollIframe = function (ev) {

		var elem = ev.target, brk;
		while (elem.parentNode)
			elem = elem.parentNode;

		// ev.detail     > 0 si vers le bas avec Firefox
		// ev.wheelDelta < 0 si vers le bas avec Chromium/Opera/Edge...
		brk = (ev.detail > 0) || (ev.wheelDelta < 0); // true si vers le bas

		// empèche le défilement (elem = document)
		if ((brk && ((elem.defaultView.innerHeight + elem.defaultView.pageYOffset) > elem.body.offsetHeight)) ||
		    (!brk && (elem.defaultView.pageYOffset <= 0)))
			apijs.dialog.stopScroll(ev);
	};

	this.onKey = function (ev) { // todo

		var that = apijs.dialog, media = that.media, elem = that.t1;
		if (!isNaN(ev)) // si true alors ev est un nombre
			ev = { keyCode: ev, ctrlKey: false, altKey: false, preventDefault: function () { } };

		// » dialogues d'attente et de progresssion ou tout autre dialogue verrouillé
		// empèche la fermeture
		// touches : ctrl + q | ctrl + w | ctrl + r | ctrl + f4 | ctrl + f5 // alt + f4 // échap | f5
		if (that.has('progress', 'waiting', 'lock')) {

			if ((ev.ctrlKey && [81, 87, 82, 115, 116].has(ev.keyCode)) ||
			    (ev.altKey && (ev.keyCode === 115)) ||
			    [27, 116].has(ev.keyCode))
				ev.preventDefault();
		}
		// » dialogues photo et vidéo
		// passe en plein écran
		// touche : f11
		else if (that.has('photo', 'video') && (ev.keyCode === 122)) {
			ev.preventDefault();
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
		}
		// » dialogues photo et vidéo du diaporama
		// ferme le dialogue, ou affiche le premier ou dernier média, ou affiche le média précédent ou suivant
		// touches : échap // fin // début // gauche // droite
		else if (that.has('slideshow')) {

			if (ev.keyCode === 27) {
				ev.preventDefault();
				that.actionClose();
			}
			else if (ev.keyCode === 35) {
				ev.preventDefault();
				apijs.slideshow.actionLast();
			}
			else if (ev.keyCode === 36) {
				ev.preventDefault();
				apijs.slideshow.actionFirst();
			}
			else if (ev.keyCode === 37) {
				ev.preventDefault();
				apijs.slideshow.actionPrev();
			}
			else if (ev.keyCode === 39) {
				ev.preventDefault();
				apijs.slideshow.actionNext();
			}
		}
		// » tout le monde sauf les dialogues précédents
		// ferme le dialogue
		// touche : échap
		else if (ev.keyCode === 27) {
			ev.preventDefault();
			that.actionClose();
		}

		// » dialogue vidéo
		// actions sur la vidéo (networkState 3 = NETWORK_NO_SOURCE)
		// touches : espace | p // haut | page haut // bas | page bas // + // - // m
		if (that.has('video')) {

			if ((ev.keyCode === 32) || (ev.keyCode === 80)) {
				ev.preventDefault();
				if (media.networkState !== 3) {
					if (media.ended || media.paused)
						media.play();
					else
						media.pause();
				}
			}
			else if ((ev.keyCode === 38) || (ev.keyCode === 33)) {
				ev.preventDefault();
				if ((media.networkState !== 3) && (media.duration !== Infinity)) {
					if (media.currentTime < (media.duration - 10))
						media.currentTime += 10;
				}
			}
			else if ((ev.keyCode === 40) || (ev.keyCode === 34)) {
				ev.preventDefault();
				if ((media.networkState !== 3) && (media.duration !== Infinity)) {
					if (media.currentTime > 10)
						media.currentTime -= 10;
					else
						media.currentTime = 0;
				}
			}
			else if (ev.keyCode === 107) {
				ev.preventDefault();
				if (media.networkState !== 3) {
					if (media.muted)
						media.muted = false;
					if (media.volume < 0.8)
						media.volume += 0.2;
					else
						media.volume = 1;
				}
			}
			else if (ev.keyCode === 109) {
				ev.preventDefault();
				if (media.networkState !== 3) {
					if (media.muted)
						media.muted = false;
					if (media.volume > 0.21)
						media.volume -= 0.2;
					else
						media.volume = 0;
				}
			}
			else if (ev.keyCode === 77) {
				ev.preventDefault();
				if (media.networkState !== 3)
					media.muted = !media.muted; // true si muted=false, false si muted=true
			}
		}

		// » défilement de la page pour tous (renvoi sur actionScrollBrowser)
		// touches : espace | page haut | page bas | fin | début | haut | bas
		if ([32, 33, 34, 35, 36, 38, 40].has(ev.keyCode)) {

			// empèche le défilement
			if (!ev.target || !['INPUT', 'TEXTAREA', 'OPTION', 'SELECT'].has(ev.target.nodeName))
				that.stopScroll(ev);
		}
	};

	this.stopScroll = function (ev) {

		ev.preventDefault();
		if (typeof ev.stopPropagation == 'function')
			ev.stopPropagation();
	};

	this.actionConfirm = function () { // todo

		// vérifie le dialogue d'options
		// arrêt du traitement si c'est pas bon
		if (this.has('options')) {
			if (this.callback(false, this.args) !== true)
				return false;
		}

		// verrouille le dialogue et affiche le loader
		this.add('lock', 'loading');
		this.htmlSvgLoader(false);

		// masque les boutons et le texte du dialogue
		apijs.html('div.btns').style.visibility = 'hidden';
		apijs.html('div.bbcode').style.visibility = 'hidden';

		// appelle la fonction de rappel
		// ne déverrouille pas le dialogue
		self.setTimeout(function () {
			if ((this.t2) && (this.t2.nodeName === 'FORM'))
				this.callback(this.t2.getAttribute('action'), this.args);
			else if (this.t2)
				this.callback(this.args);
		}.bind(this), 12);

		return false; // très important
	};

	this.onIframeLoad = function (elem) {

		elem.removeAttribute('class');
		apijs.dialog.remove('loading');

		elem.contentWindow.addEventListener('DOMMouseScroll', window.parent.apijs.dialog.onScrollIframe, { passive: false });
		elem.contentWindow.addEventListener('mousewheel', window.parent.apijs.dialog.onScrollIframe, { passive: false });
		elem.contentWindow.addEventListener('touchmove', window.parent.apijs.dialog.onScrollIframe, { passive: false });
	};

	this.onMediaLoad = function (ev) { // todo

		var that = apijs.dialog, media = that.media, src, elem, elems;
		if (ev && ev.target) {
			src = ev.target.currentSrc || ev.target.src;
			apijs.log('dialog:onMediaLoad:' + ev.type + ' ' + (src ? src.slice(src.lastIndexOf('/') + 1) : ''));
		}

		if (media && ['load', 'durationchange'].has(ev.type)) {
			that.remove('loading', 'error');
			media.style.visibility = 'visible';
			if (!media.hasAttribute('src') && (media.nodeName === 'IMG'))
				media.setAttribute('src', media.imageLoader.src);
		}
		else if (media && (ev.type === 'error')) {
			that.toggle('loading', 'error');
			media.removeAttribute('style');
			// player vidéo (désactive l'option et active la suivante)
			elem = apijs.html('.tracks.video select');
			if (elem && ev && ev.target) {
				elems = elem.querySelectorAll('option');
				if ((elems.length > 0) && (elem.value.length > 0)) {
					elems[elem.value].setAttribute('disabled', 'disabled');
					elem.selectedIndex += 1;
					// charge la vidéo suivante (si erreur au clic sur le select)
					if ((ev.target.nodeName === 'VIDEO') && (elem.value !== ''))
						apijs.player.actionVideo(elem);
				}
			}
		}
	};

	this.onFullscreen = function (ev) {

		var res = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		if (ev) apijs.log('dialog:onFullscreen:' + (res ? 'in' : 'out'));

		apijs.dialog[res ? 'add' : 'remove']('fullscreen');
	};


	// GESTION DES CONTENEURS (private return this|boolean)

	this.init = function (type, icon, isLocked) { // todo

		if (typeof icon == 'string') {
			icon = icon.replace(this.ft, '').trim();
			icon = (icon.length > 0) ? ((isLocked === true) ? icon + ' lock' : icon) : ((isLocked === true) ? 'lock' : null);
		}
		else if (isLocked === true) {
			icon = 'lock';
		}

		// préparation
		if (this.t0)
			this.clear(false);

		// css
		this.klass.push('start');
		this.klass.push(type);
		if (self.matchMedia('prefers-reduced-motion:reduce').matches)
			this.klass.push('reduce');
		if (typeof icon == 'string')
			this.klass = this.klass.concat(icon.split(' '));

		// création du fragment
		this.t0 = document.createDocumentFragment();

		// surveillance des touches et du navigateur
		document.addEventListener('keydown', apijs.dialog.onKey);
		self.addEventListener('beforeunload', apijs.dialog.onCloseBrowser);
		self.addEventListener('DOMMouseScroll', apijs.dialog.onScrollBrowser, { passive: false });
		self.addEventListener('mousewheel', apijs.dialog.onScrollBrowser, { passive: false });
		self.addEventListener('touchmove', apijs.dialog.onScrollBrowser, { passive: false });
		self.addEventListener('resize', apijs.dialog.onResizeBrowser);

		// restriction de la navigation
		if (apijs.config.dialog.restrictNavigation)
			document.querySelectorAll(this.ti).forEach(function (elem) { elem.setAttribute('tabindex', '-1'); });

		return this;
	};

	this.show = function (focus) { // todo

		// design
		this.onResizeBrowser();
		this.onFullscreen();

		if ((this.height > 0) && !this.has('photo', 'video'))
			this.t2.style.minHeight = this.height + 'px';

		// ça y est, c'est l'heure
		// affichage du dialogue (sans/sans/avec transitions CSS)
		if (apijs.html('#Dialog')) {
			this.toggle('start', 'ready');
			this.t1 = apijs.html('#Dialog');
			this.t1.appendChild(this.t0.firstChild.firstChild);
			this.t1.setAttribute('class', this.t2.getAttribute('class'));
		}
		else if (this.has('notransition')) {
			this.toggle('start', 'ready');
			document.querySelector('body').appendChild(this.t0);
		}
		else {
			document.querySelector('body').appendChild(this.t0);
			self.setTimeout(function () { apijs.dialog.toggle('start', 'ready'); }, 12);
		}

		// fermeture des popups au clic
		if (apijs.config.dialog.closeOnClick && !this.has('progress', 'waiting', 'lock'))
			document.addEventListener('click', apijs.dialog.actionClose);

		// passage en plein écran
		if (this.has('photo', 'video')) {

			if (document.webkitFullscreenEnabled)
				document.addEventListener('webkitfullscreenchange', apijs.dialog.onFullscreen);
			else if (document.fullscreenEnabled)
				document.addEventListener('fullscreenchange', apijs.dialog.onFullscreen);
			else if (document.mozFullScreenEnabled)
				document.addEventListener('mozfullscreenchange', apijs.dialog.onFullscreen);
		}

		// auto-focus
		if (focus === true)
			self.setTimeout(function () { apijs.html('input:not([readonly]),textarea:not([readonly]),select:not([disabled])').focus(); }, 12);
		else if (typeof focus == 'string')
			apijs.html(focus).focus();

		return true;
	};

	this.clear = function (isAll) { // todo

		if (isAll && this.xhr) {
			this.callback = null; // très important
			this.xhr.abort();
		}

		// surveillance des touches et du navigateur (depuis initDialog)
		document.removeEventListener('keydown', apijs.dialog.onKey);
		self.removeEventListener('beforeunload', apijs.dialog.onCloseBrowser);
		self.removeEventListener('DOMMouseScroll', apijs.dialog.onScrollBrowser, { passive: false });
		self.removeEventListener('mousewheel', apijs.dialog.onScrollBrowser, { passive: false });
		self.removeEventListener('touchmove', apijs.dialog.onScrollBrowser, { passive: false });
		self.removeEventListener('resize', apijs.dialog.onResizeBrowser);

		// restriction de la navigation (depuis initDialog)
		if (apijs.config.dialog.restrictNavigation)
			document.querySelectorAll(this.ti).forEach(function (elem) { elem.removeAttribute('tabindex'); });

		// fermeture des popups au clic (depuis showDialog)
		if (apijs.config.dialog.closeOnClick)
			document.removeEventListener('click', apijs.dialog.actionClose);

		// passage en plein écran (depuis showDialog)
		if (this.has('photo', 'video')) {

			if (document.webkitFullscreenEnabled)
				document.removeEventListener('webkitfullscreenchange', apijs.dialog.onFullscreen);
			else if (document.fullscreenEnabled)
				document.removeEventListener('fullscreenchange', apijs.dialog.onFullscreen);
			else if (document.mozFullScreenEnabled)
				document.removeEventListener('mozfullscreenchange', apijs.dialog.onFullscreen);
		}

		// pour ne pas déclencher les fonctions
		if (this.has('video')) {
			this.media.ondurationchange = null;
			this.media.onerror = null;
		}

		// mémorise la hauteur du dialogue
		if (!this.has('photo', 'video'))
			this.height = parseFloat(self.getComputedStyle(this.t2).height);

		// supprime le dialogue
		if (isAll) {
			this.toggle('ready', 'end');
			document.querySelector('body').removeChild(this.t1);
		}
		else {
			this.t1.removeChild(this.t2);
		}

		// réinitialise toutes les variables (sauf ft/ti/ns)
		this.klass = [];
		if (isAll) {
			this.height   = 0;
			this.scroll   = 0; // time
			this.callback = null;
			this.args     = null;
			this.xhr      = null
		}
		this.media = null;
		this.t0 = null; // fragment
		this.t1 = null; // div id=apijsDialog
		this.t2 = null; // div/form id=apijsBox
		this.a  = null;
		this.b  = null;
		this.c  = null;
		this.d  = null;

		return true;
	};


	// GÉNÉRATION DES ÉLÉMENTS (private return this)

	this.htmlParent = function (action, onSubmit) {

		this.t1 = document.createElement('div');
		this.t1.setAttribute('id', 'apijsDialog');

		if (typeof action == 'string') {
			this.t2 = document.createElement('form');
			this.t2.setAttribute('action', action);
			this.t2.setAttribute('method', 'post');
			this.t2.setAttribute('enctype', 'multipart/form-data');
			this.t2.setAttribute('onsubmit', 'return ' + onSubmit);
		}
		else {
			this.t2 = document.createElement('div');
		}

		this.t2.setAttribute('id', 'apijsBox');
		this.t1.appendChild(this.t2);
		this.t0.appendChild(this.t1);

		return this;
	};

	this.htmlContent = function (title, text) {

		if (title.length > 0) {
			this.a = document.createElement('h1');
			this.a.innerHTML = title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\[/g, '<').replace(/]/g, '>');
			this.t2.appendChild(this.a);
		}

		if (text.length > 0) {
			this.a = document.createElement('div');
			this.a.setAttribute('class', 'bbcode');
			if (text[0] !== '[') text = '[p]' + text + '[/p]';
			this.a.innerHTML = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\[/g, '<').replace(/]/g, '>');
			this.a.querySelectorAll('a.popup').forEach(function (elem) { elem.addEventListener('click', apijs.openTab); });
			this.t2.appendChild(this.a);
		}

		return this;
	};

	this.htmlBtnOk = function () {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'btns');

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('class', 'confirm');
			this.b.setAttribute('onclick', 'apijs.dialog.actionClose();');

				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.translateNode(102));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);

		return this;
	};

	this.htmlBtnConfirm = function (type, onClick) {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'btns');

			this.b = document.createElement('button');
			this.b.setAttribute('type', type);
			this.b.setAttribute('class', 'confirm');
			if (type !== 'submit') this.b.setAttribute('onclick', onClick);

				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.translateNode(104));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('class', 'cancel');
			this.b.setAttribute('onclick', 'apijs.dialog.actionClose();');

				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.translateNode(103));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);

		return this;
	};

	this.htmlBtnNavigation = function () {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'navigation noplaying');

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('disabled', 'disabled');
			this.b.setAttribute('class', 'prev');
			this.b.setAttribute('id', 'apijsPrev');
			this.b.setAttribute('onclick', 'apijs.slideshow.actionPrev();');

				this.c = document.createElement('span');
				//this.c.appendChild(apijs.i18n.translateNode(106));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('disabled', 'disabled');
			this.b.setAttribute('class', 'next');
			this.b.setAttribute('id', 'apijsNext');
			this.b.setAttribute('onclick', 'apijs.slideshow.actionNext();');

				this.c = document.createElement('span');
				//this.c.appendChild(apijs.i18n.translateNode(107));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);

		return this;
	};

	this.htmlBtnClose = function (canClose) {

		if (canClose === false)
			return this;

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'close noplaying');

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('class', 'close');
			this.b.setAttribute('onclick', 'apijs.dialog.actionClose();');

				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.translateNode(105));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);

		return this;
	};

	this.htmlUpload = function (input, isMultiple) {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'btns upload');

			this.b = document.createElement('input');
			this.b.setAttribute('type', 'file');
			this.b.setAttribute('name', input);
			this.b.setAttribute('id', 'apijsFile');
			if (isMultiple) this.b.setAttribute('multiple', 'multiple');
			this.b.setAttribute('onchange', 'apijs.upload.actionChoose(this);');

		this.a.appendChild(this.b);

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('class', 'browse');
			this.b.setAttribute('onclick', 'this.previousSibling.click();');

				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.translateNode(isMultiple ? 109 : 108));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('div');
			this.b.setAttribute('class', 'filenames');

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);

		return this;
	};

	this.htmlSvgProgress = function () {

		this.a = document.createElement('span');
		this.a.setAttribute('class', 'info');
		this.t2.appendChild(this.a);

		this.a = document.createElement('svg');
		this.a.setAttribute('id', 'apijsProgress');

			this.b = document.createElement('rect');
			this.b.setAttribute('class', 'auto');

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);

		return this;
	};

	this.htmlSvgLoader = function (isDelayed) {

		this.a = document.createElementNS(this.ns, 'svg');
		this.a.setAttribute('class', 'loader');

			this.b = document.createElementNS(this.ns, 'path');
			if (isDelayed !== false) this.b.setAttribute('style', 'opacity:0;');
			this.b.setAttribute('d', 'M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z');

				this.c = document.createElementNS(this.ns, 'animateTransform');
				this.c.setAttribute('attributeName', 'transform');
				this.c.setAttribute('type', 'rotate');
				this.c.setAttribute('from', '0 64 64');
				this.c.setAttribute('to', '360 64 64');
				this.c.setAttribute('dur', '5s');
				this.c.setAttribute('repeatCount', 'indefinite');

			this.b.appendChild(this.c);

				this.c = document.createElementNS(this.ns, 'animate');
				this.c.setAttribute('attributeName', 'opacity');
				this.c.setAttribute('to', '1');
				this.c.setAttribute('dur', '0.01s');
				this.c.setAttribute('begin', '1s');
				this.c.setAttribute('fill', 'freeze');

			if (isDelayed !== false) this.b.appendChild(this.c);

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);

		return this;
	};

	this.htmlSvgPlayer = function (root) {

		this.a = document.createElement('span');
		this.a.setAttribute('class', 'player noplaying');

			this.b = document.createElement('span');
			this.b.setAttribute('class', 'btn play fnt');
			this.b.setAttribute('onclick', 'apijs.dialog.onKey(80);'); // lecture/pause
			this.b.appendChild(document.createTextNode('\uE810'));

		this.a.appendChild(this.b);

			this.b = document.createElement('span');
			this.b.setAttribute('class', 'svg bar');

				this.c = document.createElement('svg');
				this.c.setAttribute('class', 'bar');
				this.c.setAttribute('onclick', 'apijs.player.actionPosition(event);');

					this.d = document.createElement('rect');

				this.c.appendChild(this.d);

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('span');
			this.b.setAttribute('class', 'time');
			this.b.appendChild(document.createTextNode('00:00 / 00:00'));

		this.a.appendChild(this.b);

			this.b = document.createElement('span');
			this.b.setAttribute('class', 'svg vol nomobile');

				this.c = document.createElement('svg');
				this.c.setAttribute('class', 'vol');
				this.c.setAttribute('onclick', 'apijs.player.actionVolume(event);');

					this.d = document.createElement('rect');

				this.c.appendChild(this.d);

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('label');
			this.b.setAttribute('class', 'tracks audiotrack');
			this.b.setAttribute('style', 'display:none;');
			this.b.appendChild(apijs.i18n.translateNode(133));

				this.c = document.createElement('em');
				this.c.setAttribute('class', 'nomobile');

			this.b.appendChild(this.c);

				this.c = document.createElement('select');
				this.c.setAttribute('lang', 'mul');
				this.c.setAttribute('onchange', 'apijs.player.actionAudiotrack(this);');

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('label');
			this.b.setAttribute('class', 'tracks videotrack');
			this.b.setAttribute('style', 'display:none;');
			this.b.appendChild(apijs.i18n.translateNode(132));

				this.c = document.createElement('em');
				this.c.setAttribute('class', 'nomobile');

			this.b.appendChild(this.c);

				this.c = document.createElement('select');
				this.c.setAttribute('lang', 'mul');
				this.c.setAttribute('onchange', 'apijs.player.actionVideotrack(this);');

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('label');
			this.b.setAttribute('class', 'tracks video');
			this.b.setAttribute('style', 'display:none;');
			this.b.appendChild(apijs.i18n.translateNode(131));

				this.c = document.createElement('em');
				this.c.setAttribute('class', 'nomobile');

			this.b.appendChild(this.c);

				this.c = document.createElement('select');
				this.c.setAttribute('lang', 'mul');
				this.c.setAttribute('onchange', 'apijs.player.actionVideo(this);');

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('label');
			this.b.setAttribute('class', 'tracks text');
			this.b.setAttribute('style', 'display:none;');
			this.b.appendChild(apijs.i18n.translateNode(134));

				this.c = document.createElement('em');
				this.c.setAttribute('class', 'nomobile');

			this.b.appendChild(this.c);

				this.c = document.createElement('select');
				this.c.setAttribute('lang', 'mul');
				this.c.setAttribute('onchange', 'apijs.player.actionText(this);');

					this.d = document.createElement('option');
					this.d.appendChild(apijs.i18n.translateNode(135)); // off

				this.c.appendChild(this.d);

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('span');
			this.b.setAttribute('class', 'btn full fnt nomobile');
			this.b.setAttribute('onclick', 'apijs.dialog.onKey(122);'); // plein écran
			this.b.appendChild(document.createTextNode('\uE80F'));

		this.a.appendChild(this.b);
		root.appendChild(this.a);

		return this;
	};

	this.htmlMedia = function (url, name, date, legend) { // todo

		this.a = document.createElement('dl');
		this.a.setAttribute('class', 'media');

			this.b = document.createElement('dt');

			if (this.has('photo')) {
				this.media = document.createElement('img');
				this.media.setAttribute('alt', legend.replace('"', ''));
			}
			else if (url.indexOf('iframe') > 0) {
				this.media = document.createElement('iframe');
				this.media.setAttribute('type', 'text/html');
				this.media.setAttribute('scrolling', 'no');
				this.media.setAttribute('src', url);
			}
			else {
				this.media = document.createElement('video');
				this.media.setAttribute('controls', 'controls');
				this.media.setAttribute('preload', 'metadata');
				this.media.setAttribute('onclick', 'apijs.dialog.onKey(80);'); // lecture/pause
			}

			this.media.setAttribute('id', 'apijsMedia');
			this.b.appendChild(this.media);

		this.a.appendChild(this.b);

			this.b = document.createElement('dd');
			this.b.setAttribute('class', 'nomobile noplaying');

			if ((name !== 'false') || (date !== 'false')) {

				var fileid = url.slice(url.lastIndexOf('/') + 1);
				this.c = document.createElement('span');

				// name + date
				if ((name !== 'false') && (name !== 'auto') && (date !== 'false'))
					this.c.appendChild(document.createTextNode(name + ' (' + date + ') '));
				// name
				else if ((name !== 'false') && (name !== 'auto'))
					this.c.appendChild(document.createTextNode(name + ' '));
				// auto name + date
				else if ((name === 'auto') && (date !== 'false'))
					this.c.appendChild(document.createTextNode(fileid + ' (' + date + ') '));
				// auto name
				else if (name === 'auto')
					this.c.appendChild(document.createTextNode(fileid + ' '));
				// date
				else if (date !== 'false')
					this.c.appendChild(document.createTextNode('(' + date + ') '));

				this.b.appendChild(this.c);
			}

			this.b.appendChild(document.createTextNode(legend));

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);

		// player créé v5.2 - supprimé v5.3 - refait v6.0
		if (this.has('photo')) {
			this.media.imageLoader = new Image();
			this.media.imageLoader.src = url;
			this.media.imageLoader.onload  = apijs.dialog.onMediaLoad;
			this.media.imageLoader.onerror = apijs.dialog.onMediaLoad;
		}
		else if (url.indexOf('iframe') > 0) {
			this.media.onload = apijs.dialog.onMediaLoad;
		}
		else if (apijs.config.dialog.player === true) {
			this.media.setAttribute('class', 'player');
			this.htmlSvgPlayer(this.media.parentNode);
			apijs.player = new apijs.core.player();
			apijs.player.init(this.media.parentNode, this.media, url);
			this.media.ondurationchange = apijs.dialog.onMediaLoad;
			this.media.onerror = apijs.dialog.onMediaLoad;
		}
		else if (typeof apijs.config.dialog.player == 'function') {
			apijs.config.dialog.player(this.media, url);
		}
		else {
			this.c = document.createElement('source');
			this.c.setAttribute('src', url);
			this.c.onerror = apijs.dialog.onMediaLoad;
			this.media.appendChild(this.c);
			this.media.ondurationchange = apijs.dialog.onMediaLoad;
			this.media.onerror = apijs.dialog.onMediaLoad;
		}

		return this;
	};

	this.htmlHelp = function (isSlideshow, isVideo) {

		var items, item, keys = [
			isSlideshow ? ['start', 149, 141] : [], // début/fin
			isSlideshow ? ['left', 'right', 142] : [],
			isVideo ? ['bottom', 'topk', 144] : [],
			isVideo ? ['minus', 'plus', 145] : [],
			isVideo ? ['M', 146] : [],
			isVideo ? ['P', 143] : [],
			['F11', 147],
			[150, 148] // échap
		];

		this.a = document.createElement('ul');
		this.a.setAttribute('class', 'kbd nomobile nofullscreen');

		while (items = keys.shift()) {

			if (items.length > 0) {

				this.b = document.createElement('li');

				while (item = items.shift()) {
					if (items.length > 0) {
						this.c = document.createElement('kbd');
						if (['M', 'P', 'F11'].has(item))
							this.c.appendChild(document.createTextNode(item));
						else if (typeof item == 'string')
							this.c.setAttribute('class', item);
						else
							this.c.appendChild(apijs.i18n.translateNode(item));
						this.b.appendChild(this.c);
					}
					else {
						this.b.appendChild(apijs.i18n.translateNode(item));
					}
				}

				this.a.appendChild(this.b);
			}
		}

		this.t2.appendChild(this.a);

		return this;
	};

	this.htmlIframe = function (url) {

		this.a = document.createElement('iframe');
		this.a.setAttribute('src', url);
		this.a.setAttribute('class', 'loading');
		this.a.setAttribute('onload', 'apijs.dialog.onIframeLoad(this);');

		this.t2.appendChild(this.a);

		return this;
	};
};