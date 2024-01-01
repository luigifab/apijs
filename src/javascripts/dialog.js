/**
 * Created D/12/04/2009
 * Updated D/03/12/2023
 *
 * Copyright 2008-2024 | Fabrice Creuzot (luigifab) <code~luigifab~fr>
 * https://github.com/luigifab/apijs
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

	this.swipe = false;
	this.media = null;
	this.t0 = null; // fragment
	this.t1 = null; // div id=apijsDialog
	this.t2 = null; // div/form id=apijsBox
	this.t3 = null; // input file
	this.a  = null;
	this.b  = null;
	this.c  = null;


	// GÉNÉRATION DES BOÎTES DE DIALOGUE (public return boolean)

	this.dialogInformation = function (title, text, icon) {

		if ((typeof title == 'string') && (typeof text == 'string')) {
			return this.init('information', icon)
				.htmlParent()
				.htmlContent(title, text)
				.htmlBtnOk()
				.show('button.confirm');
		}

		console.error('apijs.dialog.dialogInformation invalid arguments', arguments);
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

		console.error('apijs.dialog.dialogConfirmation invalid arguments', arguments);
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

		console.error('apijs.dialog.dialogFormOptions invalid arguments', arguments);
		return false;
	};

	this.dialogFormUpload = function (title, text, action, input, multiple, icon) {

		if ((typeof title == 'string') && (typeof text == 'string') && (typeof action == 'string') && (typeof input == 'string')) {
			return this.init('upload', icon)
				.htmlParent(action, 'apijs.upload.actionConfirm();', 'apijs.upload.actionDrag(event);')
				.htmlContent(title, text)
				.htmlUpload(input, (typeof multiple == 'boolean') ? multiple : false, 'apijs.upload.actionChoose(this);')
				.htmlBtnConfirm('submit')
				.show('button.browse');
		}

		console.error('apijs.dialog.dialogFormUpload invalid arguments', arguments);
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

		console.error('apijs.dialog.dialogProgress invalid arguments', arguments);
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

		console.error('apijs.dialog.dialogWaiting invalid arguments', arguments);
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

		console.error('apijs.dialog.dialogPhoto invalid arguments', arguments);
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

		console.error('apijs.dialog.dialogVideo invalid arguments', arguments);
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

		console.error('apijs.dialog.dialogIframe invalid arguments', arguments);
		return false;
	};

	this.dialogAjax = function (url, close, callback, args, icon) {

		if ((typeof url == 'string') && (typeof close == 'boolean') && (typeof callback == 'function')) {
			// dialogue
			this.callback = callback;
			this.args = args;
			this.init('ajax', (typeof icon == 'string') ? icon + ' loading' : 'loading', !close)
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
			}.bind(this); // pour que ci-dessus this = this
			this.xhr.send();
			return this;
		}

		console.error('apijs.dialog.dialogAjax invalid arguments', arguments);
		return false;
	};


	// GESTION DES CLASSES CSS (public sauf update private, return this sauf has return true)

	this.update = function () {

		// il n'est pas question de mettre à jour les attributs class sans l'une des 3 classes de base
		if (this.has('start', 'ready', 'end')) {
			if (this.t1)
				this.t1.setAttribute('class', this.klass.join(' '));
			if (this.t2)
				this.t2.setAttribute('class', this.klass.join(' '));
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
		if (apijs.config.slideshow.anchor && (typeof history.pushState == 'function')) {
			if (new RegExp('#(' + apijs.config.slideshow.ids + '[\-\\.]\\d+[\-\\.]\\d+)').test(self.location.href))
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

		var width = document.querySelector('body').clientWidth;

		apijs.dialog[(width <= (apijs.dialog.has('photo', 'video') ? 900 : 460)) ? 'add' : 'remove']('mobile');
		apijs.dialog[(width <= 300) ? 'add' : 'remove']('tiny');
	};

	this.onScrollBrowser = function (ev) {

		var that = apijs.dialog, elem = ev.target, brk = false;

		// dialogues du diaporama (suivant/précédent)
		// @see https://github.com/hammerjs/hammer.js
		// @see https://github.com/john-doherty/swiped-events
		if (
			that.has('slideshow') && !that.has('playing') &&
			!['OPTION', 'SELECT'].has(elem.nodeName) && ['DOMMouseScroll', 'mousewheel', 'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'swiped-left', 'swiped-right', 'swiped-up', 'swiped-down'].has(ev.type)
		) {
			elem = new Date().getTime() / 1000;
			if ((that.scroll < 1) || (elem > (that.scroll + 1))) {
				that.scroll = elem;
				// ev.detail     > 0 si vers le bas avec Firefox
				// ev.wheelDelta < 0 si vers le bas avec Chromium/Opera/Edge...
				brk = (ev.detail > 0) || (ev.wheelDelta < 0); // true si vers le bas
				apijs.slideshow[(['swipeleft', 'swipeup', 'swiped-left', 'swiped-up'].has(ev.type) || brk) ? 'actionNext' : 'actionPrev']();
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
			if ((elem.scrollHeight > elem.offsetHeight) && (elem.nodeName !== 'HTML')) {
				// ev.detail     > 0 si vers le bas avec Firefox
				// ev.wheelDelta < 0 si vers le bas avec Chromium/Opera/Edge...
				brk = (ev.detail > 0) || (ev.wheelDelta < 0); // true si vers le bas
				if ((brk && (elem.scrollTop < (elem.scrollHeight - elem.offsetHeight - 1))) || (!brk && (elem.scrollTop > 0)))
					return;
			}
		}

		// empèche le défilement
		ev.preventDefault();
		ev.stopPropagation();
	};

	this.onScrollIframe = function (ev) {

		var elem = ev.target, brk;
		while (elem.parentNode)
			elem = elem.parentNode;

		// ev.detail     > 0 si vers le bas avec Firefox
		// ev.wheelDelta < 0 si vers le bas avec Chromium/Opera/Edge...
		brk = (ev.detail > 0) || (ev.wheelDelta < 0); // true si vers le bas

		// empèche le défilement (elem = iframe document)
		if (
			(brk && ((elem.defaultView.innerHeight + elem.defaultView.scrollY) >= (elem.body.offsetHeight - 1))) ||
			(!brk && (elem.defaultView.scrollY <= 0))
		) {
			ev.preventDefault();
			ev.stopPropagation();
		}
	};

	this.onKey = function (ev) {

		var that = apijs.dialog, elem = that.media, time;

		// dialogues d'attente et de progresssion ou tout autre dialogue verrouillé
		// ctrl + q | ctrl + w | ctrl + r | ctrl + f4 | ctrl + f5 // alt + f4 // échap | f5
		if (that.has('progress', 'waiting', 'lock')) {

			if ((ev.ctrlKey && [81, 87, 82, 115, 116].has(ev.keyCode)) || (ev.altKey && (ev.keyCode === 115)) || [27, 116].has(ev.keyCode))
				ev.preventDefault();
		}
		// dialogues photo et vidéo
		// f11 (ne fonctionne plus sur Opera 74 Windows)
		else if (that.has('photo', 'video') && (ev.keyCode === 122)) {
			ev.preventDefault();
			apijs.requestFullscreen(that.t1);
		}
		// dialogues photo et vidéo du diaporama
		// échap // fin // début // gauche // droite
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
		// pour tous les autres
		// échap
		else if (ev.keyCode === 27) {
			ev.preventDefault();
			that.actionClose();
		}

		// dialogue vidéo
		// espace | p // haut | page haut // bas | page bas // + // - // m
		if (that.has('video') && !that.has('videoiframe')) {

			// espace | p
			if ([32, 80].has(ev.keyCode)) {
				ev.preventDefault();
				if ([1, 2].has(elem.networkState)) {
					if (elem.ended || elem.paused)
						elem.play();
					else
						elem.pause();
				}
			}
			// haut | page haut
			else if ([38, 33].has(ev.keyCode)) {
				ev.preventDefault();
				time = (ev.keyCode === 38) ? 10 : 60;
				if (([1, 2].has(elem.networkState)) && (elem.duration !== Infinity) && !isNaN(elem.duration)) {
					if (elem.currentTime > time)
						elem.currentTime -= time;
					else
						elem.currentTime = 0;
				}
			}
			// bas | page bas
			else if ([40, 34].has(ev.keyCode)) {
				ev.preventDefault();
				if (([1, 2].has(elem.networkState)) && (elem.duration !== Infinity) && !isNaN(elem.duration)) {
					time = (ev.keyCode === 40) ? 10 : 60;
					if (elem.currentTime < (elem.duration - time))
						elem.currentTime += time;
				}
			}
			// +
			else if (ev.keyCode === 107) {
				ev.preventDefault();
				if ([1, 2].has(elem.networkState)) {
					if (elem.muted)
						elem.muted = false;
					if (elem.volume < 0.8)
						elem.volume += 0.2;
					else
						elem.volume = 1;
				}
			}
			// -
			else if (ev.keyCode === 109) {
				ev.preventDefault();
				if ([1, 2].has(elem.networkState)) {
					if (elem.muted)
						elem.muted = false;
					if (elem.volume > 0.21)
						elem.volume -= 0.2;
					else
						elem.volume = 0;
				}
			}
			// m
			else if (ev.keyCode === 77) {
				ev.preventDefault();
				if ([1, 2].has(elem.networkState)) {
					elem.muted = !elem.muted; // inverse
				}
			}
		}

		// défilement de la page pour tous (renvoi sur actionScrollBrowser)
		// espace | page haut | page bas | fin | début | haut | bas
		if ([32, 33, 34, 35, 36, 38, 40].has(ev.keyCode)) {

			// empèche le défilement
			if (!ev.target || (!['INPUT','TEXTAREA','OPTION','SELECT'].has(ev.target.nodeName) && !ev.target.classList.contains('scrollable'))) {
				ev.preventDefault();
				ev.stopPropagation();
			}
		}
	};

	this.onFullscreen = function (ev) {

		var res = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		if (ev) apijs.log('dialog:onFullscreen:' + (res ? 'in' : 'out'));

		apijs.dialog[res ? 'add' : 'remove']('fullscreen');
	};

	this.onIframeLoad = function (elem) { // todo

		elem.removeAttribute('class');
		apijs.dialog.remove('loading');

		elem.contentWindow.document.addEventListener('keydown', window.parent.apijs.dialog.onKey);
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
						media.videoPlayer.actionVideo(elem);
				}
			}
		}
	};

	this.onSlideshowSwipe = function (ev) {

		apijs.dialog.swipe = true;
		self.setTimeout(function () { apijs.dialog.swipe = false; }, 150);

		if (['swiperight', 'swipedown', 'swiped-right', 'swiped-down'].has(ev.type))
			apijs.slideshow.actionPrev();
		else // swipeleft swipeup swiped-left swiped-up
			apijs.slideshow.actionNext();
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
		}.bind(this), 12); // pour que ci-dessus this = this

		return false; // très important
	};


	// GESTION DES CONTENEURS (private return this|boolean)

	this.init = function (type, icon, isLocked) { // todo

		isLocked = (isLocked === true);
		if (typeof icon == 'string') {
			icon = icon.replace(this.ft, '').trim();
			icon = (icon.length > 0) ? (isLocked ? icon + ' lock' : icon) : (isLocked ? 'lock' : null);
		}
		else if (isLocked) {
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
		document.addEventListener('keydown', this.onKey);
		self.addEventListener('beforeunload', this.onCloseBrowser);
		self.addEventListener('DOMMouseScroll', this.onScrollBrowser, { passive: false });
		self.addEventListener('mousewheel', this.onScrollBrowser, { passive: false });
		self.addEventListener('touchmove', this.onScrollBrowser, { passive: false });
		self.addEventListener('resize', this.onResizeBrowser);

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

		// affichage du dialogue sans/sans/avec transitions CSS
		var old = apijs.html('#Dialog');
		if (old) {
			this.toggle('start', 'ready');
			this.t1 = old;
			// this.t1.appendChild(this.t0.firstChild.firstChild);
			// @see https://stackoverflow.com/a/24775765/2980105
			apijs.toArray(this.t0.firstChild.childNodes).forEach(function (node) {
				this.t1.appendChild(node);
			}, this); // pour que ci-dessus this = this
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
			document.addEventListener('click', this.actionClose);

		// passage en plein écran
		if (this.has('photo', 'video')) {

			if (document.webkitFullscreenEnabled)
				document.addEventListener('webkitfullscreenchange', this.onFullscreen);
			else if (document.fullscreenEnabled)
				document.addEventListener('fullscreenchange', this.onFullscreen);
			else if (document.mozFullScreenEnabled)
				document.addEventListener('mozfullscreenchange', this.onFullscreen);
		}
		// copier coller
		else if (this.has('upload')) {
			window.addEventListener('paste', apijs.upload.actionDrag);
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

		if (this.hammer) { // (depuis htmlBtnNavigation)
			this.hammer.off('swiperight swipedown swipeleft swipeup', apijs.dialog.onSlideshowSwipe).destroy();
			delete this.hammer;
		}

		// surveillance des touches et du navigateur (depuis initDialog)
		document.removeEventListener('keydown', this.onKey);
		self.removeEventListener('beforeunload', this.onCloseBrowser);
		self.removeEventListener('DOMMouseScroll', this.onScrollBrowser, { passive: false });
		self.removeEventListener('mousewheel', this.onScrollBrowser, { passive: false });
		self.removeEventListener('touchmove', this.onScrollBrowser, { passive: false });
		self.removeEventListener('resize', this.onResizeBrowser);

		// restriction de la navigation (depuis initDialog)
		if (apijs.config.dialog.restrictNavigation)
			document.querySelectorAll(this.ti).forEach(function (elem) { elem.removeAttribute('tabindex'); });

		// fermeture des popups au clic (depuis showDialog)
		if (apijs.config.dialog.closeOnClick)
			document.removeEventListener('click', this.actionClose);

		// spécial
		if (this.has('photo', 'video')) {

			// pour ne pas déclencher les fonctions
			// supprime tous les ontruc et les src
			if (this.has('video') && !this.has('videoiframe')) {
				this.t2.querySelectorAll('video, source, track').forEach(function (elem) {
					for (var name in elem) {
						if (name.indexOf('on') === 0)
							elem[name] = null;
					}
					elem.removeAttribute('src');
				});
			}

			this.media.videoPlayer = null;
			this.media.imageLoader = null;

			// passage en plein écran (depuis showDialog)
			if (document.webkitFullscreenEnabled)
				document.removeEventListener('webkitfullscreenchange', this.onFullscreen);
			else if (document.fullscreenEnabled)
				document.removeEventListener('fullscreenchange', this.onFullscreen);
			else if (document.mozFullScreenEnabled)
				document.removeEventListener('mozfullscreenchange', this.onFullscreen);
		}
		else {
			// copier coller
			if (this.has('upload'))
				window.removeEventListener('paste', apijs.upload.actionDrag);

			// mémorise la hauteur du dialogue
			this.height = parseFloat(self.getComputedStyle(this.t2).height);
		}

		// supprime le dialogue
		if (isAll) {
			this.toggle('ready', 'end');
			this.t1.remove();
		}
		else {
			while (this.t1.firstChild)
				this.t1.firstChild.remove();
		}

		// réinitialise toutes les variables (sauf ft/ti/ns et swipe)
		this.klass = [];
		if (isAll) {
			this.height   = 0;
			this.scroll   = 0; // time
			this.callback = null;
			this.args     = null;
			this.xhr      = null;
		}
		this.media = null;
		this.t0 = null; // fragment
		this.t1 = null; // div id=apijsDialog
		this.t2 = null; // div/form id=apijsBox
		this.t3 = null; // input file
		this.a  = null;
		this.b  = null;
		this.c  = null;

		return true;
	};


	// GÉNÉRATION DES ÉLÉMENTS (private return this)

	this.htmlParent = function (action, submit, drag) {

		this.t1 = document.createElement('div');
		this.t1.setAttribute('id', 'apijsDialog');

		if (typeof drag == 'string') {

			this.t1.setAttribute('ondragenter', drag);
			this.t1.setAttribute('ondragleave', drag);
			this.t1.setAttribute('ondragover', drag);
			this.t1.setAttribute('ondrop', drag);
			this.t1.setAttribute('onpaste', drag); // Firefox

			this.a = document.createElement('p');
			this.a.setAttribute('class', 'drag');
			this.a.appendChild(apijs.i18n.translateNode(127));
			this.t1.appendChild(this.a);
		}
		else {
			this.t1.setAttribute('ondragstart', 'return false;');
		}

		if (typeof action == 'string') {
			this.t2 = document.createElement('form');
			this.t2.setAttribute('action', action);
			this.t2.setAttribute('method', 'post');
			this.t2.setAttribute('enctype', 'multipart/form-data');
			this.t2.setAttribute('onsubmit', 'return ' + submit);
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

	this.htmlBtnConfirm = function (type, click) {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'btns');

			this.b = document.createElement('button');
			this.b.setAttribute('type', type);
			this.b.setAttribute('class', 'confirm');
			if (type !== 'submit') this.b.setAttribute('onclick', click);

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

		if (typeof Hammer == 'function') {
			this.hammer = new Hammer(this.t2);
			this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
			this.hammer.on('swiperight swipedown swipeleft swipeup', apijs.dialog.onSlideshowSwipe);
		}

		return this;
	};

	this.htmlBtnClose = function (close) {

		if (close !== false) {

			this.a = document.createElement('div');
			this.a.setAttribute('class', 'close nofullplaying');

				this.b = document.createElement('button');
				this.b.setAttribute('type', 'button');
				this.b.setAttribute('class', 'close');
				this.b.setAttribute('onclick', 'apijs.dialog.actionClose();');

					this.c = document.createElement('span');
					this.c.appendChild(apijs.i18n.translateNode(105));

				this.b.appendChild(this.c);

			this.a.appendChild(this.b);
			this.t2.appendChild(this.a);
		}

		return this;
	};

	this.htmlUpload = function (input, isMultiple, change) {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'btns upload');

			this.t3 = document.createElement('input');
			this.t3.setAttribute('type', 'file');
			this.t3.setAttribute('name', isMultiple ? input + '[]' : input);
			this.t3.setAttribute('id', 'apijsFile');
			if (isMultiple) this.t3.setAttribute('multiple', 'multiple');
			this.t3.setAttribute('onchange', change);

		this.a.appendChild(this.t3);

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('class', 'browse');
			this.b.setAttribute('onclick', 'this.previousSibling.click();');

				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.translateNode(isMultiple ? 109 : 108));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('div');
			this.b.setAttribute('class', 'filenames scrollable');

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

	this.htmlMedia = function (url, name, date, legend) {

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
			}

			this.media.setAttribute('id', 'apijsMedia');
			this.b.appendChild(this.media);

		this.a.appendChild(this.b);

			this.b = document.createElement('dd');
			this.b.setAttribute('class', 'nofullplaying');

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

		// au choix : photo / vidéo avec iframe / vidéo avec lecteur / vidéo simple
		// lecteur créé v5.2 / supprimé v5.3 / refait v6.0 / extrait v6.6
		if (this.has('photo')) {
			this.media.imageLoader = new Image();
			this.media.imageLoader.src = url;
			this.media.imageLoader.onload  = this.onMediaLoad;
			this.media.imageLoader.onerror = this.onMediaLoad;
		}
		else if (url.indexOf('iframe') > 0) {
			this.media.onload = function (ev) {
				this.onIframeLoad(this.media);
				this.onMediaLoad(ev);
			}.bind(this); // pour que ci-dessus this = this
			this.add('videoiframe');
		}
		else if (apijs.startPlayer(this.media, url)) {
			this.add('apijsvideoplayer');
		}
		else {
			this.c = document.createElement('source');
			this.c.setAttribute('src', url);
			this.c.onerror = this.onMediaLoad;
			this.media.appendChild(this.c);
			this.media.ondurationchange = this.onMediaLoad;
			this.media.onerror = this.onMediaLoad;
			this.add('videosource');
		}

		return this;
	};

	this.htmlHelp = function (isSlideshow, isVideo) {

		// pas d'aide en mobile car pas de clavier
		if (('ontouchstart' in window) && navigator.userAgent.match(/mobi/i))
			return this;

		var items, item, keys = [
			isSlideshow ? ['start', 149, 141] : [], // début/fin
			isSlideshow ? ['left', 'right', 142] : [],
			isVideo ? ['topk', 'bottom', 144] : [],
			isVideo ? ['minus', 'plus', 145] : [],
			isVideo ? ['M', 146] : [],
			isVideo ? ['P', 143] : [],
			['F11', 147],
			[150, 148] // échap
		];

		this.a = document.createElement('ul');
		this.a.setAttribute('class', 'kbd nofullscreen');

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