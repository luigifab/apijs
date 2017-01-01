/**
 * Created D/12/04/2009
 * Updated V/23/12/2016
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

apijs.core.dialog = function () {

	// Totalement testé et approuvé sur
	// Debian testing/64 : Firefox 45, Chromium 53
	// Windows 7/32 : IE 11, Firefox 22, Chrome 55, Opera 42
	// Windows 10/64 : Edge 14

	"use strict";
	this.styles = null;
	this.media  = null;
	this.paused = true;
	this.scrollTime = 0;

	this.timer = null;
	this.callback = null;
	this.args = null;

	this.frag = null;
	this.a = null;
	this.b = null;
	this.c = null;
	this.d = null;
	this.e = null;
	this.t1 = null; // div id=apijsDialog
	this.t2 = null; // div/form id=apijsBox


	// DÉFINITION DES 8 BOÎTES DE DIALOGUE

	// #### Dialogue d'information ################################################## public ### //
	// = révision : 92
	// » Permet d'afficher un message d'information à l'intention de l'utilisateur
	// » Composé d'un titre, d'un paragraphe et d'un bouton de dialogue (Ok)
	// » Fermeture par bouton Ok ou touche Échap
	// » Auto-focus sur le bouton Ok
	this.dialogInformation = function (title, text, icon) {

		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.initDialog('information', icon);

			this.htmlParent();
			this.htmlContent(title, text);
			this.htmlButtonOk();

			this.showDialog();
			apijs.html('button.confirm').focus();
		}
		else {
			apijs.error('TheDialog:dialogInformation', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue de confirmation ################################################ public ### //
	// = révision : 108
	// » Permet de demander une confirmation à l'utilisateur
	// » Composé d'un titre, d'un paragraphe et de deux boutons de dialogue (Annuler/Valider)
	// » Fermeture par bouton Annuler ou touche Échap tant que le dialogue n'est pas validé
	// » Appelle la fonction callback avec son paramètre args après la validation du dialogue [ callback(args) ]
	// » Auto-focus sur le bouton Valider
	this.dialogConfirmation = function (title, text, callback, args, icon) {

		if ((typeof title === 'string') && (typeof text === 'string') && (typeof callback === 'function')) {

			this.initDialog('confirmation', icon);

			this.htmlParent();
			this.htmlContent(title, text);
			this.htmlButtonConfirm('button');

			this.callback = callback;
			this.args = args;

			this.showDialog();
			apijs.html('button.confirm').focus();
		}
		else {
			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.error('TheDialog:dialogConfirmation', {
				'(string) *title': title,
				'(string) *text': text,
				'(function) *callback': callback,
				'(mixed) args': args,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue d'options ###################################################### public ### //
	// = révision : 52
	// » Permet à l'utilisateur de modifier des options
	// » Composé d'un formulaire, d'un titre, d'un paragraphe et de deux boutons de dialogue (Annuler/Valider)
	// » Fermeture par bouton Annuler ou touche Échap tant que le formulaire n'est pas validé
	// » Validation du formulaire si la fonction callback avec son paramètre args renvoie true [ callback(false, args) ]
	// » Appelle la fonction callback avec ses paramètres action et args après la validation du dialogue [ callback(action, args) ]
	// » Auto-focus différé sur le premier champ du formulaire (12 ms)
	this.dialogFormOptions = function (title, text, action, callback, args, icon) {

		if ((typeof title === 'string') && (typeof text === 'string') && (typeof action === 'string') && (typeof callback === 'function')) {

			this.initDialog('options', icon);

			this.htmlParent(action);
			this.htmlContent(title, text);
			this.htmlButtonConfirm('submit');

			this.callback = callback;
			this.args = args;

			this.showDialog();

			window.setTimeout(function () {
				apijs.html('input:not([readonly]),textarea:not([readonly]),select:not([disabled])').focus();
			}, 12);
		}
		else {
			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.error('TheDialog:dialogFormOptions', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) *action': action,
				'(function) *callback': callback,
				'(mixed) args': args,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue d'upload ####################################################### public ### //
	// = révision : 126
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Composé d'un formulaire, d'un titre, d'un paragraphe, d'un champ fichier et de deux boutons de dialogue (Annuler/Valider)
	// » Fermeture par bouton Annuler ou touche Échap tant que le formulaire n'est pas validé
	// » Auto-focus sur le bouton fichier du formulaire
	this.dialogFormUpload = function (title, text, action, inputname, icon) {

		if ((typeof title === 'string') && (typeof text === 'string') && (typeof action === 'string') && (typeof inputname === 'string')) {

			this.initDialog('upload', icon);

			this.htmlParent(action);
			this.htmlContent(title, text);
			this.htmlFormUpload(inputname);
			this.htmlButtonConfirm('submit');

			this.showDialog();
			apijs.html('button.browse').focus();
		}
		else {
			apijs.error('TheDialog:dialogFormUpload', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) *action': action,
				'(string) *inputname': inputname,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue de progression ################################################# public ### //
	// = révision : 108
	// » Permet de faire patienter l'utilisateur en affichant une barre de progression
	// » Composé d'un titre, d'un paragraphe et d'une barre de progression
	// » Fermeture automatique (ou pas) et touches CTRL+Q, CTRL+W, CTRL+R, CTRL+F4, CTRL+F5, ALT+F4, Échap et F5 désactivées
	this.dialogProgress = function (title, text, icon) {

		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.initDialog('progress', icon);

			this.htmlParent();
			this.htmlContent(title, text);
			this.htmlProgressBar();

			this.showDialog();
		}
		else {
			apijs.error('TheDialog:dialogProgress', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue d'attente ###################################################### public ### //
	// = révision : 106
	// » Permet de faire patienter l'utilisateur en affichant un message d'attente
	// » Composé d'un titre, d'un paragraphe et d'un lien différé de time secondes si time est supérieur à 5 (time * 1000 ms)
	// » Fermeture automatique (ou pas) et touches CTRL+Q, CTRL+W, CTRL+R, CTRL+F4, CTRL+F5, ALT+F4, Échap et F5 désactivées
	this.dialogWaiting = function (title, text, time, icon) {

		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.initDialog('waiting', icon);

			this.htmlParent();
			this.htmlContent(title, text);

			this.showDialog();

			if ((typeof time === 'number') && (time > 5))
				this.timer = window.setTimeout(apijs.dialog.htmlLinkReload, time * 1000);
		}
		else {
			apijs.error('TheDialog:dialogWaiting', {
				'(string) *title': title,
				'(string) *text': text,
				'(number) time': time,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue photo ########################################################## public ### //
	// = révision : 156
	// » Permet d'afficher une image au premier plan
	// » Composé d'une image, d'une définition et de trois boutons de dialogue (Précédent/Suivant/Fermer)
	// » Fermeture par bouton Fermer ou touche Échap et touche F11 pour passer en plein écran
	// » S'adapte automatiquement à la taille de la fenêtre du navigateur
	this.dialogPhoto = function (url, name, date, legend, slideshow) {

		if ((typeof url === 'string') && (typeof name === 'string') && (typeof date === 'string') && (typeof legend === 'string')) {

			if (typeof slideshow === 'string') {
				this.initDialog('photo', 'notransition slideshow loading' + ((typeof slideshow === 'string') ? ' ' + slideshow : ''));
				this.htmlParent();
			}
			else {
				this.initDialog('photo', 'notransition loading');
				this.htmlParent();
			}

			this.htmlMedia(url, name, date, legend);
			this.htmlHelp((typeof slideshow === 'string'), false);
			this.htmlButtonClose();
			this.htmlButtonNavigation();

			this.showDialog();
		}
		else {
			apijs.error('TheDialog:dialogPhoto', {
				'(string) *url': url,
				'(string) *name': name,
				'(string) *date': date,
				'(string) *legend': legend
			});
		}
	};


	// #### Dialogue vidéo ########################################################## public ### //
	// = révision : 116
	// » Permet d'afficher une vidéo au premier plan
	// » Composé d'une vidéo, d'une définition et de trois boutons de dialogue (Précédent/Suivant/Fermer)
	// » S'adapte automatiquement à la taille de la fenêtre et se met en pause lors d'un changement d'onglet
	// » Fermeture par bouton Fermer ou touche Échap et touche F11 pour passer en plein écran
	this.dialogVideo = function (url, name, date, legend, slideshow) {

		if ((typeof url === 'string') && (typeof name === 'string') && (typeof legend === 'string') && (typeof legend === 'string')) {

			if (typeof slideshow === 'string') {
				this.initDialog('video', 'notransition slideshow loading' + ((typeof slideshow === 'string') ? ' ' + slideshow : ''));
				this.htmlParent();
			}
			else {
				this.initDialog('video', 'notransition loading');
				this.htmlParent();
			}

			this.htmlMedia(url, name, date, legend);
			this.htmlHelp((typeof slideshow === 'string'), true);
			this.htmlButtonClose();
			this.htmlButtonNavigation();

			this.showDialog();
		}
		else {
			apijs.error('TheDialog:dialogVideo', {
				'(string) *url': url,
				'(string) *name': name,
				'(string) *date': date,
				'(string) *legend': legend
			});
		}
	};



	// GESTION DES INTERACTIONS ENTRE LE MONDE ET LES DIALOGUES

	// #### Action de fermeture ############################################ event ## public ### //
	// = révision : 65
	// » Supprime la boîte de dialogue
	// » Sur demande ou au clic mais uniquement pour certains dialogues
	// » Supprime aussi l'éventuelle ancre du diaporama
	this.actionClose = function (ev) {

		if (new RegExp('#(' + apijs.config.slideshow.ids + '(?:-|\\.)[0-9]+(?:-|\\.)[0-9]+)').test(location.href)) {
			if (apijs.config.slideshow.anchor && (typeof history.pushState === 'function'))
				history.pushState({}, '', location.href.slice(0, location.href.indexOf('#')));
		}

		if (typeof ev === 'object') {
			if ((ev.target.getAttribute('id') === 'apijsDialog') && !apijs.dialog.styles.has('photo', 'video', 'progress', 'waiting', 'lock'))
				apijs.dialog.deleteDialog(true);
		}
		else if (this.t1) {
			this.deleteDialog((typeof ev !== 'boolean') ? true : ev);
		}
	};


	// #### Action du clavier et du navigateur ############################ event ## private ### //
	// = révision : 153
	// » Gère les actions des touches en fonction des dialogues
	// » Passe d'un média à l'autre en mode diaporama avec la molette de la souris (toutes les 2 secondes)
	// » Passe en mode plein écran lors avec la touche F11 en utilisant l'API Fullscreen
	// » Empêche la fermeture du navigateur pour les dialogues ayant un verrou
	// » Empèche le défilement de la page dès qu'un dialogue est présent
	this.actionKey = function (ev) {

		var styles = apijs.dialog.styles, media = apijs.dialog.media;

		if (!isNaN(ev))
			ev = { keyCode: ev, ctrlKey: false, altKey: false, preventDefault: function () { } };

		// * dialogues d'attente et de progresssion, ou tout autre dialogue verrouillé
		// empèche la fermeture de l'onglet et donc du navigateur
		// touches : ctrl + q | ctrl + w | ctrl + r | ctrl + f4 | ctrl + f5 // alt + f4 // échap | f5
		if (styles.has('progress', 'waiting', 'lock')) {

			if ((ev.ctrlKey && [81, 87, 82, 115, 116].has(ev.keyCode)) ||
			    (ev.altKey && (ev.keyCode === 115)) ||
			    [27, 116].has(ev.keyCode))
				ev.preventDefault();
		}
		// * dialogues photo et vidéo
		// passe en plein écran
		// touche : f11
		else if (styles.has('photo', 'video') && (ev.keyCode === 122)) {
			ev.preventDefault();
			apijs.dialog.actionFullscreen();
		}
		// * dialogues photo et vidéo du diaporama
		// ferme le dialogue, ou affiche le premier ou dernier média, ou affiche le média précédent ou suivant
		// touches : échap // fin // début // gauche // droite
		else if (styles.has('slideshow')) {

			if (ev.keyCode === 27) {
				ev.preventDefault();
				apijs.dialog.actionClose();
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
		// * tout le monde sauf les dialogues précédents
		// ferme le dialogue
		// touche : échap
		else if (ev.keyCode === 27) {
			ev.preventDefault();
			apijs.dialog.actionClose();
		}

		// * dialogue vidéo
		// actions sur la vidéo (networkState 3 = NETWORK_NO_SOURCE)
		// touches : espace | p // haut | page haut // bas | page bas // + // - // m
		if (styles.has('video')) {

			if ((ev.keyCode === 32) || (ev.keyCode === 80)) {
				ev.preventDefault();
				if (media.networkState !== 3) {
					if (media.ended || media.paused) // pour media.ended : media.currentTime = 0;
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
					media.muted = !media.muted; // =true si muted=false, =false si muted=true
			}
		}

		// * défilement de la page pour tous (renvoi sur actionScrollBrowser)
		// touches : espace | page haut | page bas | fin | début | haut | bas
		// SAUF lorsque ces touches sont dans un formulaire
		if ([32, 33, 34, 35, 36, 38, 40].has(ev.keyCode)) {

			if (!['INPUT', 'TEXTAREA', 'SELECT'].has(ev.target.nodeName))
				apijs.dialog.actionScrollBrowser(ev);
		}
	};

	this.actionCloseBrowser = function (ev) {

		// dialogues d'attente, de progresssion ou tout autre dialogue verrouillé
		// empèche la fermeture de l'onglet (et donc du navigateur)
		if (apijs.dialog.styles.has('progress', 'waiting', 'lock')) {

			ev.preventDefault();
			ev.stopPropagation();

			ev.m = apijs.i18n.translate('warningLostChange');
			ev.returnValue = ev.m; // Gecko, Trident, Chrome 34+
			return ev.m;           // Gecko, WebKit, Chrome
		}
	};

	this.actionScrollBrowser = function (ev) {

		// dialogues du diaporama
		// passe au média suivant ou précédent
		if (apijs.dialog.styles.has('slideshow') && ['DOMMouseScroll', 'mousewheel'].has(ev.type)) {

			var time = new Date().getTime() / 1000;

			if ((apijs.dialog.scrollTime < 1) || (time > (1 + apijs.dialog.scrollTime))) {
				apijs.dialog.scrollTime = time;
				apijs.slideshow[((ev.detail > 0) || (ev.wheelDelta < 0)) ? 'actionNext' : 'actionPrev']();
			}
		}

		// empèche le défilement
		// dans tous les cas
		ev.preventDefault();
		ev.stopPropagation();
	};


	// #### Action du bouton Valider ############################## event ## i18n ## private ### // TODO
	// = révision : 174
	// » Pour le dialogue d'options et de confirmation,
	//  vérifie le dialogue d'options (arrêt du traitement si ce n'est pas bon)
	//  verrouille le dialogue, masque les boutons et le texte du dialogue, met en place le texte d'attente, active le lien différé (7000 ms)
	//  appelle la fonction de rappel (ne déverrouille pas le dialogue) (1000 ms)
	// » Pour le dialogue d'upload, transfert l'appel vers la méthode actionConfirm de TheUpload
	this.actionConfirm = function () {

		if (this.styles.has('options', 'confirmation')) {

			// vérifie le dialogue d'options
			// arrêt du traitement si c'est pas bon
			if (this.styles.has('options')) {
				if (this.callback(false, this.args) !== true)
					return false;
			}

			// verrouille le dialogue
			this.styles.add('waiting');

			// masque les boutons et le texte du dialogue
			apijs.html('div.control').style.visibility = 'hidden';
			apijs.html('div.bbcode').style.visibility = 'hidden';

			// met en place le texte d'attente
			this.a = document.createElement('p');
			this.a.setAttribute('class', 'saving');
			this.a.appendChild(apijs.i18n.nodeTranslate('operationInProgress'));
			this.t2.appendChild(this.a);

			// active le lien différé (7000 ms)
			this.timer = window.setTimeout(apijs.dialog.htmlLinkReload, 7000);

			// appelle la fonction de rappel
			// ne déverrouille pas le dialogue
			window.setTimeout(function () {
				if ((this.t2) && (this.t2.nodeName === 'FORM'))
					this.callback(this.t2.getAttribute('action'), this.args);
				else if (this.t2)
					this.callback(this.args);
			}.bind(this), 1000);
		}
		else if (this.styles.has('upload')) {
			apijs.upload.actionConfirm();
		}

		return false;
	};


	// #### Gestion du média ###################################### event ## i18n ## private ### //
	// = révision : 49
	// » Affiche l'image une fois chargée dans sa balise IMG
	// » Ou positionne le message d'erreur dans une balise SPAN
	// » Log des informations si le mode debug est activé
	this.mediaReady = function (ev) {

		var that = apijs.dialog, media = that.media, text;

		apijs.log('mediaReady:' + ev.type + ' (styles: ' + that.styles + ')');

		if (media && ((ev.type === 'load') || (ev.type === 'durationchange')) && that.styles.has('loading')) {

			that.styles.remove('loading');
			media.setAttribute('style', 'visibility:visible;');

			if (media.nodeName === 'IMG')
				media.setAttribute('src', media.imageData.src);

			apijs.objectFitImages(); // ne fonctionne plus avec media en paramètre sur IE11
		}
		else if (media && (ev.type === 'error') && !that.styles.has('error')) {

			that.styles.toggle('loading', 'error');

			text = document.createElement('span');
			text.innerHTML = ((media.nodeName === 'IMG') ? apijs.i18n.translate('imageError') : apijs.i18n.translate('videoError', apijs.html('source').getAttribute('src'))).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\[/g, '<').replace(/\]/g, '>');

			media.parentNode.insertBefore(text, media);
		}
	};


	// #### Plein écran ou document caché ################################# event ## private ### //
	// = révision : 6
	// » Met en pause la vidéo lorsque la page n'est plus visible (utilise l'API JavaScript Page Visibility)
	// » Entre en mode plein écran pour les dialogues photo et vidéo (utilise l'API JavaScript Full Screen)
	this.actionHidden = function () {

		var media = apijs.dialog.media;

		if (!document.hidden && !document.mozHidden && !document.msHidden && !document.webkitHidden) {
			if (!apijs.dialog.paused)
				media.play();
		}
		else {
			apijs.dialog.paused = media.paused;
			media.pause();
		}
	};

	this.actionFullscreen = function () {

		var elem = apijs.dialog.t1;

		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {

			if (elem.requestFullscreen)
				elem.requestFullscreen();
			else if (elem.mozRequestFullScreen)
				elem.mozRequestFullScreen();
			else if (elem.webkitRequestFullscreen)
				elem.webkitRequestFullscreen();
		}
		else {
			if (document.cancelFullScreen)
				document.cancelFullScreen();
			else if (document.mozCancelFullScreen)
				document.mozCancelFullScreen();
			else if (document.webkitCancelFullScreen)
				document.webkitCancelFullScreen();
		}
	};



	// GESTION DES CONTENEURS

	// #### Prépare le terrain ##################################################### private ### //
	// = révision : 105
	// » Supprime l'ancien dialogue (si frag n'est pas null) sans supprimer le conteneur de base (t1)
	// » Empêche la navigation au clavier avec la touche TAB de quitter la boîte de dialogue
	// » Met en place les gestionnaires d'événements du dialogue (+keydown, +beforeunload, +DOMMouseScroll, +mousewheel, +touchmove)
	this.initDialog = function (type, icon) {

		if (typeof icon === 'string') {
			// ne peuvent pas être utilisées ou modifiées - ne peuvent pas être utilisées mais peuvent être modifiées
			// start ready end slideshow loading - information confirmation options upload download progress waiting photo video
			// /!\ ne filtre pas slideshow et loading car utilisées lors du chargement des dialogues photo et vidéo
			icon = icon.replace(/start|ready|end|information|confirmation|options|upload|progress|waiting|photo|video/g, '').trim();
			icon = (icon.length > 0) ? icon : null;
		}

		// préparation
		if (this.frag !== null)
			this.deleteDialog(false);

		this.styles = new apijs.core.styles();
		this.styles.init(type, icon);

		// création du fragment
		this.frag = document.createDocumentFragment();

		// surveillance des touches et du navigateur
		document.addEventListener('keydown', apijs.dialog.actionKey, false);
		window.addEventListener('beforeunload', apijs.dialog.actionCloseBrowser, false);
		window.addEventListener('DOMMouseScroll', apijs.dialog.actionScrollBrowser, false);
		window.addEventListener('mousewheel', apijs.dialog.actionScrollBrowser, false);
		window.addEventListener('touchmove', apijs.dialog.actionScrollBrowser, false);

		// restriction de la navigation
		if (apijs.config.dialog.restrictNavigation)
			document.querySelectorAll('a,area,button,input,object,select,textarea,iframe').invokeAll('setAttribute', 'tabindex', '-1');
	};


	// #### Affiche le dialogue #################################################### private ### //
	// = révision : 62
	// » Accroche le fragment DOM au document HTML (sur apijsDialog ou sur body) et applique le style du dialogue
	// » Diffère le changement de la classe CSS de start vers ready pour permettre les transitions CSS lorsque nécessaire (12 ms)
	// » Met en place les gestionnaires d'événements du contenu du dialogue (+click, +visibilitychange)
	this.showDialog = function () {

		// ça y est, c'est l'heure
		// affichage du dialogue (sans/sans/avec transitions CSS)
		if (apijs.html('#Dialog')) {
			this.styles.toggle('start', 'ready');
			this.t1 = apijs.html('#Dialog');
			this.t1.appendChild(this.frag.firstChild.firstChild);
			this.t1.setAttribute('class', this.t2.getAttribute('class'));
		}
		else if (this.styles.has('notransition')) {
			this.styles.toggle('start', 'ready');
			document.body.appendChild(this.frag);
		}
		else {
			document.body.appendChild(this.frag);
			window.setTimeout(function () {
				this.styles.toggle('start', 'ready');
			}.bind(this), 12);
		}

		// fermeture des popups au clic
		if (apijs.config.dialog.closeOnClick && !this.styles.has('progress', 'waiting', 'lock'))
			document.addEventListener('click', apijs.dialog.actionClose, false);

		// mise en pause de la vidéo
		if (this.styles.has('video')) {

			if (typeof document.hidden === 'boolean')
				document.addEventListener('visibilitychange', apijs.dialog.actionHidden, false);
			else if (typeof document.mozHidden === 'boolean')
				document.addEventListener('mozvisibilitychange', apijs.dialog.actionHidden, false);
			else if (typeof document.msHidden === 'boolean')
				document.addEventListener('msvisibilitychange', apijs.dialog.actionHidden, false);
			else if (typeof document.webkitHidden === 'boolean')
				document.addEventListener('webkitvisibilitychange', apijs.dialog.actionHidden, false);
		}
	};


	// #### Supprime le dialogue ################################################### private ### //
	// = révision : 182
	// » Supprime la boîte de dialogue totalement ou pas sans transitions CSS
	// » Annule les gestionnaires d'événements du dialogue (-keydown, -beforeunload, -DOMMouseScroll, -mousewheel, -touchmove)
	// » Annule les gestionnaires d'événements du contenu du dialogue (-click, -visibilitychange)
	// » Réinitialise les variables
	this.deleteDialog = function (all) {

		if (this.timer)
			clearTimeout(this.timer);

		// surveillance des touches et du navigateur (depuis initDialog)
		document.removeEventListener('keydown', apijs.dialog.actionKey, false);
		window.removeEventListener('beforeunload', apijs.dialog.actionCloseBrowser, false);
		window.removeEventListener('DOMMouseScroll', apijs.dialog.actionScrollBrowser, false);
		window.removeEventListener('mousewheel', apijs.dialog.actionScrollBrowser, false);
		window.removeEventListener('touchmove', apijs.dialog.actionScrollBrowser, false);

		// restriction de la navigation (depuis initDialog)
		if (apijs.config.dialog.restrictNavigation)
			document.querySelectorAll('a,area,button,input,object,select,textarea,iframe').invokeAll('removeAttribute', 'tabindex');

		// fermeture des popups au clic (depuis showDialog)
		if (apijs.config.dialog.closeOnClick)
			document.removeEventListener('click', apijs.dialog.actionClose, false);

		// liens dans un nouvel onglet (depuis htmlContent)
		this.t2.querySelectorAll('a.popup').invokeAll('removeEventListener', 'click', apijs.openTab, false);

		// mise en pause de la vidéo (depuis showDialog)
		if (this.styles.has('video')) {

			this.media.onerror = null; // pour ne pas déclencher la fonction

			if (typeof this.media.pause === 'function') {

				this.media.onpause = null;
				this.media.pause();

				// la vidéo plante au deuxième chargement sans lecture avec au moins Chrome/Chromium 30-33 et Opera 17
				// 1) l'utilisateur est là, il clic sur une vidéo
				// 2) le programme crée le dialogue et l'affiche
				// 3) la première image de la vidéo s'affiche tout de suite
				// 4) l'utilisateur, n'a plus envie, il appuie sur le bouton fermer
				// 5) le programme supprime le dialogue
				// 6) l'utilisateur est là, il reclic sur la même vidéo
				// 7) le programme crée le dialogue et l'affiche
				// 8) la première image de la vidéo ne s'affiche pas
				if (navigator.userAgent.indexOf('WebKit/') > 0)
					this.media.setAttribute('src', '');
			}

			if (typeof document.hidden === 'boolean')
				document.removeEventListener('visibilitychange', apijs.dialog.actionHidden, false);
			else if (typeof document.mozHidden === 'boolean')
				document.removeEventListener('mozvisibilitychange', apijs.dialog.actionHidden, false);
			else if (typeof document.msHidden === 'boolean')
				document.removeEventListener('msvisibilitychange', apijs.dialog.actionHidden, false);
			else if (typeof document.webkitHidden === 'boolean')
				document.removeEventListener('webkitvisibilitychange', apijs.dialog.actionHidden, false);
		}

		// supprime le dialogue
		if (all) {
			this.styles.toggle('ready', 'end');
			document.body.removeChild(this.t1);
		}
		else {
			this.t1.removeChild(this.t2);
		}

		// réinitialise toutes les variables SAUF timer
		this.styles = null;
		this.media  = null;
		this.paused = true;
		if (all) {
			this.scrollTime = 0;
			//this.timer = null;
			this.callback = null;
			this.args = null;
		}
		this.frag = null;
		this.a = null;
		this.b = null;
		this.c = null;
		this.d = null;
		this.e = null;
		this.t1 = null; // div id=apijsDialog
		this.t2 = null; // div/form id=apijsBox
	};



	// CONTENU DES BOÎTES DE DIALOGUE

	// #### Éléments parents ####################################################### private ### //
	// = révision : 112
	// » Crée le conteneur parent et le conteneur du contenu du dialogue
	// » Conteneur form ou div en fonction de la demande
	// # <div id="apijsDialog">
	// #  [<form action="{data}" method="post" enctype="multipart/form-data" onsubmit="...actionConfirm();" id="apijsBox"></form>]
	// #  [<div id="apijsBox"></div>]
	// # </div>
	this.htmlParent = function (action) {

		this.t1 = document.createElement('div');
		this.t1.setAttribute('id', 'apijsDialog');

			if (typeof action === 'string') {
				this.t2 = document.createElement('form');
				this.t2.setAttribute('action', action);
				this.t2.setAttribute('method', 'post');
				this.t2.setAttribute('enctype', 'multipart/form-data');
				this.t2.setAttribute('onsubmit', 'return apijs.dialog.actionConfirm();');
			}
			else {
				this.t2 = document.createElement('div');
			}

			this.t2.setAttribute('id', 'apijsBox');

		this.t1.appendChild(this.t2);
		this.frag.appendChild(this.t1);
	};


	// #### Texte ################################################################## private ### //
	// = révision : 103
	// » Met en place le titre et le paragraphe du dialogue
	// » Ouvre les liens ayant la classe CSS popup dans un nouvel onglet
	// » Prend en charge le bbcode via innerHTML
	// # [<h1>{title}</h1>]
	// #  <div class="bbcode">
	// #   [<p>]{text}[</p>]
	// #  </div>
	this.htmlContent = function (title, text) {

		// titre
		if (title.length > 0) {
			this.a = document.createElement('h1');
			this.a.appendChild(document.createTextNode(title));
			this.t2.appendChild(this.a);
		}

		// contenu
		this.a = document.createElement('div');
		this.a.setAttribute('class', 'bbcode');

		if (text[0] !== '[')
			text = '[p]' + text + '[/p]';

		this.a.innerHTML = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\[/g, '<').replace(/\]/g, '>');
		this.a.querySelectorAll('a.popup').invokeAll('addEventListener', 'click', apijs.openTab, false);

		this.t2.appendChild(this.a);
	};


	// #### Bouton Ok ###################################################### i18n ## private ### //
	// = révision : 75
	// » Met en place le bouton Ok du dialogue d'information
	// » Auto-focus différé sur le bouton Ok
	// # <div class="control">
	// #  <button type="button" onclick="...actionClose();" class="confirm">{i18n.buttonOk}</button>
	// # </div>
	this.htmlButtonOk = function () {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'control');

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('onclick', 'apijs.dialog.actionClose();');
			this.b.setAttribute('class', 'confirm');
			this.b.appendChild(apijs.i18n.nodeTranslate('buttonOk'));

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);
	};


	// #### Boutons Annuler/Valider ######################################## i18n ## private ### //
	// = révision : 95
	// » Met en place les boutons Annuler et Valider des dialogues de confirmation, d'options et d'upload
	// » Auto-focus différé sur le bouton Valider du dialogue de confirmation et sur le champ fichier du dialogue d'upload
	// # <div class="control">
	// #  <button type="{type}" class="confirm" [onclick="...actionConfirm();"]>{i18n.buttonConfirm}</button>
	// #  <button type="button" class="cancel" onclick="...actionClose();">{i18n.buttonCancel}</button>
	// # </div>
	this.htmlButtonConfirm = function (type) {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'control');

			this.b = document.createElement('button');
			this.b.setAttribute('type', type);
			this.b.setAttribute('class', 'confirm');

			if (type !== 'submit')
				this.b.setAttribute('onclick', 'apijs.dialog.actionConfirm();');

			this.b.appendChild(apijs.i18n.nodeTranslate('buttonConfirm'));

		this.a.appendChild(this.b);

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('class', 'cancel');
			this.b.setAttribute('onclick', 'apijs.dialog.actionClose();');
			this.b.appendChild(apijs.i18n.nodeTranslate('buttonCancel'));

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);
	};


	// #### Boutons Précédent/Suivant ###################################### i18n ## private ### //
	// = révision : 56
	// » Met en place les boutons Précédent et Suivant des dialogues photo et vidéo
	// » À savoir un bouton à gauche et un bouton à droite de la boîte de dialogue
	// » Boutons au format image ou texte en fonction de la configuration
	// # <div class="navigation">
	// #  <button type="button" disabled="disabled" onclick="...actionPrev();" class="prev" id="apijsPrev">
	// #   <span>{i18n.buttonPrev}</span>
	// #  </button>
	// #  <button type="button" disabled="disabled" onclick="...actionNext();" class="next" id="apijsNext">
	// #   <span>{i18n.buttonNext}</span>
	// #  </button>
	// # </div>
	this.htmlButtonNavigation = function () {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'navigation');

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('disabled', 'disabled');
			this.b.setAttribute('onclick', 'apijs.slideshow.actionPrev();');
			this.b.setAttribute('class', 'prev');
			this.b.setAttribute('id', 'apijsPrev');

				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.nodeTranslate('buttonPrev'));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('disabled', 'disabled');
			this.b.setAttribute('onclick', 'apijs.slideshow.actionNext();');
			this.b.setAttribute('class', 'next');
			this.b.setAttribute('id', 'apijsNext');

				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.nodeTranslate('buttonNext'));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);
	};


	// #### Bouton Fermer ################################################## i18n ## private ### //
	// = révision : 104
	// » Met en place le bouton Fermer des dialogues photo et vidéo
	// » À savoir un bouton dans le coin en haut à droite de la boîte de dialogue
	// » Bouton au format image ou texte en fonction de la configuration
	// # <div class="close">
	// #  <button type="button" onclick="...actionClose();" class="close">
	// #   <span>{i18n.buttonClose}</span>
	// #  </button>
	// # </div>
	this.htmlButtonClose = function () {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'close');

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('onclick', 'apijs.dialog.actionClose();');
			this.b.setAttribute('class', 'close');

				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.nodeTranslate('buttonClose'));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);
	};


	// #### Lien différé ######################################## timeout ## i18n ## private ### //
	// = révision : 85
	// » Appel différé dans le temps comme son nom ne le suggère pas
	// » Met en place le lien différé des dialogues de confirmation, d'options et d'attente
	// # <p class="reload">{i18n.operationTooLong} <a href="{location.href}">{i18n.reloadLink}</a>.
	// # <br />{i18n.warningLostChange}</p>
	this.htmlLinkReload = function () {

		var that = apijs.dialog;

		that.a = document.createElement('p');
		that.a.setAttribute('class', 'reload');
		that.a.appendChild(apijs.i18n.nodeTranslate('operationTooLong'));

			that.b = document.createElement('a');
			that.b.setAttribute('href', 'javascript:location.reload();');
			that.b.appendChild(apijs.i18n.nodeTranslate('reloadLink'));

		that.a.appendChild(that.b);
		that.a.appendChild(document.createTextNode('.'));

			that.b = document.createElement('br');

		that.a.appendChild(that.b);
		that.a.appendChild(apijs.i18n.nodeTranslate('warningLostChange'));

		that.t2.appendChild(that.a);
	};


	// #### Formulaire d'envoi de fichier ################################## i18n ## private ### //
	// = révision : 177
	// » Met en place le contenu du formulaire du dialogue d'upload
	// » Bascule automatiquement le focus entre le bouton/label fichier et le bouton Valider
	// » [Firefox 4/10] Le champ fichier n'est pas en 'display:none' mais en 'width:0; visibility:hidden;' car sinon il ne fonctionne pas
	// # <div class="control upload">
	// #  [<input type="hidden" name="{config.upload.tokenName}" value="{config.upload.tokenValue}" />]
	// #   <input type="file" name="{inputname}" onchange="..." id="apijsFile" />
	// #   <button type="button" onclick="..." class="browse">{i18n.buttonBrowse}</button>
	// #   <span class="filename"></span>
	// #   <div class="status"></div>
	// # </div>
	this.htmlFormUpload = function (inputname) {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'control upload');

			if (typeof apijs.config.upload.tokenValue === 'string') {

				this.b = document.createElement('input');
				this.b.setAttribute('type', 'hidden');
				this.b.setAttribute('name', apijs.config.upload.tokenName);
				this.b.setAttribute('value', apijs.config.upload.tokenValue);

				this.a.appendChild(this.b);
			}

			this.b = document.createElement('input');
			this.b.setAttribute('type', 'file');
			this.b.setAttribute('name', inputname);
			this.b.setAttribute('onchange', "apijs.html('button.confirm').focus(); apijs.html('span.filename').innerHTML = this.files[0].name");
			this.b.setAttribute('id', 'apijsFile');

		this.a.appendChild(this.b);

			// Élément button (parcourir)
			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('onclick', "apijs.html('#File').click();");
			this.b.setAttribute('class', 'browse');
			this.b.appendChild(apijs.i18n.nodeTranslate('buttonBrowse'));

		this.a.appendChild(this.b);

			this.b = document.createElement('span');
			this.b.setAttribute('class', 'filename');

		this.a.appendChild(this.b);

			this.b = document.createElement('div');
			this.b.setAttribute('class', 'status');
			this.b.appendChild(document.createTextNode(''));

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);
	};


	// #### Barre de progression ################################################### private ### //
	// = révision : 74
	// » Met en place le graphique SVG du dialogue de progression
	// » Utilise une image SVG inline et un span pour les informations
	// # <svg xmlns="http://www.w3.org/2000/svg" id="apijsProgress">
	// #  <rect class="auto" />
	// # </svg>
	// # <span class="info"></span>
	this.htmlProgressBar = function () {

		//this.a = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.a = document.createElement('svg');
		this.a.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		this.a.setAttribute('id', 'apijsProgress');

			this.b = document.createElement('rect');
			this.b.setAttribute('class', 'auto');

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);

		this.a = document.createElement('span');
		this.a.setAttribute('class', 'info');
		this.t2.appendChild(this.a);
	};


	// #### Média et légende ####################################################### private ### //
	// = révision : 204
	// » Met en place la photo ou vidéo (le média) et la légende du dialogue photo ou vidéo
	// » Extrait les sources de la vidéo à partir de l'adresse de la vidéo (par exemple ./video.webm?get=1#ogv,mp4)
	// # <dl class="media">
	// #  <dt>
	// #   [<img alt="{legend}" id="apijsMedia" />]
	// #   [<video controls="controls" preload="metadata" id="apijsMedia">
	// #      <source src="..." type="video/..." />
	// #   </video>]
	// #  </dt>
	// #  <dd>
	// #   [<span>{fileid/name} ({date})</span>] {legend}
	// #  </dd>
	// # </dl>
	this.htmlMedia = function (url, name, date, legend) {

		var i, fileid = url.slice(url.lastIndexOf('/') + 1),
		    arr, ext, src, mimes = { ogv: 'video/ogg', webm: 'video/webm', mp4: 'video/mp4', m4v: 'video/mp4' };

		this.a = document.createElement('dl');
		this.a.setAttribute('class', 'media');

			this.b = document.createElement('dt');

			// traitement très différent entre une photo et une vidéo
			// affichage d'une image dans la balise IMG ou affichage d'une vidéo dans la balise VIDÉO
			if (this.styles.has('photo')) {

				this.media = document.createElement('img');
				this.media.setAttribute('alt', legend.replace('"', ''));
				this.media.imageData = new Image();
				this.media.imageData.src = url;
				this.media.imageData.onload = apijs.dialog.mediaReady;
				this.media.imageData.onerror = apijs.dialog.mediaReady;
			}
			else {
				this.media = document.createElement('video');
				this.media.setAttribute('controls', 'controls');
				this.media.setAttribute('preload', 'metadata');

				// recherche des extensions de la vidéo
				// une balise source par extension
				// 3./video.webm?get=1#ogv,mp4  3./video.webm#ogv,mp4  1./video.webm?get=1  1./video.webm
				//         .webm?get=1#ogv,mp4  |       .webm#ogv,mp4  |       .webm?get=1  |       .webm
				//         .webm      #ogv,mp4  |       .webm#ogv,mp4  |       .webm?get=1  |       .webm
				//         .webm      #ogv,mp4  |       .webm#ogv,mp4  |       .webm        |       .webm
				//         .webm      .ogv.mp4  |       .webm.ogv.mp4  |       .webm        |       .webm
				arr = url.slice(url.lastIndexOf('.') + 1);
				arr = ((arr.indexOf('?') > 0) && (arr.indexOf('#') > 0)) ? arr.slice(0, arr.indexOf('?')) + arr.slice(arr.indexOf('#')) : arr;
				arr = ((arr.indexOf('?') > 0) && (arr.indexOf('#') < 0)) ? arr.slice(0, arr.indexOf('?')) : arr;
				arr = arr.replace('#', '.').replace(',', '.').split('.');

				for (i = 0; i < arr.length; i++) {

					ext = arr[i];

					// reconstruction de l'adresse de la vidéo
					// 3./video.webm?get=1#ogv,mp4  3./video.webm#ogv,mp4  1./video.webm?get=1  1./video.webm
					//  ./video.XXXX                 ./video.XXXX           ./video.XXXX         ./video.XXXX
					//  ./video.XXXX?get=1           ./video.XXXX           ./video.XXXX         ./video.XXXX
					//  ./video.XXXX                 ./video.XXXX           ./video.XXXX?get=1   ./video.XXXX
					src = url.slice(0, url.lastIndexOf('.') + 1) + ext;
					src = ((url.indexOf('?') > 0) && (url.indexOf('#') > 0)) ? src + url.slice(url.indexOf('?'), url.indexOf('#')) : src;
					src = ((url.indexOf('?') > 0) && (url.indexOf('#') < 0)) ? src + url.slice(url.indexOf('?')) : src;

					this.c = document.createElement('source');
					this.c.setAttribute('src', src);
					this.c.setAttribute('type', (mimes.hasOwnProperty(ext)) ? mimes[ext] : 'video/unknown');

					this.media.appendChild(this.c);
				}

				this.media.ondurationchange = apijs.dialog.mediaReady;
				this.media.onerror = apijs.dialog.mediaReady; // pour le boulet IE (11? et Edge?), déclenché par Chrome/Chromium
				this.c.onerror = apijs.dialog.mediaReady; // this.c (le dernier source) et non this.media !!
			}

			this.media.setAttribute('id', 'apijsMedia');
			this.b.appendChild(this.media);

		this.a.appendChild(this.b);

			this.b = document.createElement('dd');

			if ((name !== 'false') || (date !== 'false')) {

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

			this.b.appendChild(document.createTextNode((legend.length > 0) ? legend : '\u00A0'));

		this.a.appendChild(this.b);
		this.t2.appendChild(this.a);
	};


	// #### Aide à la navigation ########################################### i18n ## private ### //
	// = révision : 19
	// » Affiche la liste des commandes disponibles
	// » Pour les diaporamas : ↖|Fin début/fin ; ←|→ précédent/suivant
	// » Pour les vidéos : ↓|↑ reculer/avancer ; -|+ baisser/augmenter le volume ; m couper le son ; p lecture/pause
	// » Pour tous : F11 plein écran ; Échap quitter
	// # <ul class="kbd">
	// #  <li>
	// #   [<kbd>X</kbd> [<kbd>X</kbd>] {i18n.xxx}]
	// #    [<kbd class="X" title="X"></kbd> [<kbd>X</kbd>] {i18n.xxx}]
	// #  </li>
	// # </ul>
	this.htmlHelp = function (slideshow, video) {

		var i, j, tmp, total, data = [];

		// préparation de la liste des contrôles
		if (slideshow) {
			data.push(['start;↖', 'ctrlKeyEnd', 'ctrlSlideshowFirstLast']);
			data.push(['left;←', 'right;→', 'ctrlSlideshowNextPrev']);
		}
		if (video) {
			data.push(['bottom;↓', 'top;↑', 'ctrlVideoTime']);
			data.push(['minus;-', 'plus;+', 'ctrlVideoSound']);
			data.push(['m', 'ctrlVideoMute']);
			data.push(['p', 'ctrlVideoPause']);
		}
		data.push(['f11', 'ctrlDialogFullscreen']);
		data.push(['ctrlKeyEsc', 'ctrlDialogQuit']);

		// génération des éléments
		this.a = document.createElement('ul');
		this.a.setAttribute('class', 'kbd');

		for (i = 0; i < data.length; i++) {

			total = data[i].length - 1;
			this.b = document.createElement('li');

			for (j = 0; j < total; j++) {

				this.c = document.createElement('kbd');

				if (data[i][j].indexOf(';') > 0) {
					tmp = data[i][j].split(';');
					this.c.setAttribute('class', tmp[0]);
					this.c.setAttribute('title', tmp[1]);
				}
				else {
					this.c.appendChild(apijs.i18n.nodeTranslate(data[i][j]));
				}

				this.b.appendChild(this.c);
			}

			this.b.appendChild(apijs.i18n.nodeTranslate(data[i][total]));
			this.a.appendChild(this.b);
		}

		this.t2.appendChild(this.a);
	};
};

apijs.core.styles = function () {

	"use strict";
	this.data = [];

	this.init = function (type, icon) {
		this.data.push('start');
		this.data.push(type);
		if (typeof icon === 'string')
			this.data = this.data.concat(icon.split(' '));
	};

	this.add = function (value) {
		if (!this.data.hasOwnProperty(value))
			this.data.push(value);
		this.update();
		return this;
	};

	this.toggle = function (search, replace) {
		if (this.has(search))
			this.remove(search);
		if (!this.has(replace))
			this.add(replace);
		this.update();
		return this;
	};

	this.remove = function () {
		var arg, args = Array.prototype.slice.call(arguments, 0);
		for (arg in args) if (args.hasOwnProperty(arg))
			this.data.splice(this.data.indexOf(args[arg]), 1);
		this.update();
		return this;
	};

	this.has = function () {
		return this.data.has(Array.prototype.slice.call(arguments, 0));
	};

	this.toString = function () {
		return this.data.join(' ');
	};

	this.update = function () {
		// il n'est pas question de mettre à jour les attributs class sans l'une des 3 classes de base !
		if (this.has('start', 'ready', 'end')) {
			if (apijs.dialog.t1)
				apijs.dialog.t1.setAttribute('class', this.toString());
			if (apijs.dialog.t2)
				apijs.dialog.t2.setAttribute('class', this.toString());
		}
	};
};