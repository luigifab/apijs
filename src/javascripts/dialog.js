/**
 * Created D/12/04/2009
 * Updated D/31/05/2015
 * Version 153
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

apijs.core.dialog = function () {

	this.styles = null;
	this.media  = null;
	this.player = null;
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

	this.tDialog = null; // div id=apijsDialog
	this.tBox = null;    // div/form id=apijsBox
	this.tTitle = null;  // h1


	// DÉFINITION DES 8 BOÎTES DE DIALOGUE

	// #### Dialogue d'information ################################################## public ### //
	// = révision : 90
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
			this.tBox.querySelector('button.confirm').focus();
		}
		else {
			apijs.error('TheDialog.dialogInformation', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue de confirmation ################################################ public ### //
	// = révision : 106
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
			this.tBox.querySelector('button.confirm').focus();
		}
		else {
			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.error('TheDialog.dialogConfirmation', {
				'(string) *title': title,
				'(string) *text': text,
				'(function) *callback': callback,
				'(mixed) args': args,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue d'options ###################################################### public ### //
	// = révision : 50
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
				apijs.dialog.tBox.querySelector('input:not([readonly]),textarea:not([readonly]),select:not([disabled])').focus();
			}, 12);
		}
		else {
			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.error('TheDialog.dialogFormOptions', {
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
	// = révision : 122
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Composé d'un formulaire, d'un titre, d'un paragraphe (sans émoticône), d'un champ fichier et de deux boutons de dialogue (Annuler/Valider)
	// » Fermeture par bouton Annuler ou touche Échap tant que le formulaire n'est pas validé
	// » Auto-focus différé sur le champ fichier du formulaire (12 ms)
	this.dialogFormUpload = function (title, text, action, inputname, icon) {

		if ((typeof title === 'string') && (typeof text === 'string') && (typeof action === 'string') && (typeof inputname === 'string')) {

			this.initDialog('upload', icon);

			this.htmlParent(action);
			this.htmlContent(title, text);
			this.htmlFormUpload(inputname);
			this.htmlButtonConfirm('submit');

			this.showDialog();

			window.setTimeout(function () {
				apijs.dialog.tBox.querySelector('.browse').focus();
			}, 12);
		}
		else {
			apijs.error('TheDialog.dialogFormUpload', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) *action': action,
				'(string) *inputname': inputname,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue de progression ################################################# public ### //
	// = révision : 107
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
			apijs.error('TheDialog.dialogProgress', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue d'attente ###################################################### public ### //
	// = révision : 104
	// » Permet de faire patienter l'utilisateur en affichant un message d'attente
	// » Composé d'un titre, d'un paragraphe (sans émoticône) et d'un lien différé de time secondes si time est supérieur à 5 (time * 1000 ms)
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
			apijs.error('TheDialog.dialogWaiting', {
				'(string) *title': title,
				'(string) *text': text,
				'(number) time': time,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue photo ########################################################## public ### //
	// = révision : 146
	// » Permet d'afficher une image au premier plan
	// » Composé d'une image, d'une définition et de trois boutons de dialogue (Précédent/Suivant/Fermer)
	// » Fermeture par bouton Fermer ou touche Échap et Touche F11 pour passer en plein écran
	// » S'adapte automatiquement à la taille de la fenêtre du navigateur
	this.dialogPhoto = function (url, name, date, legend, slideshow) {

		if ((typeof url === 'string') && (typeof name === 'string') && (typeof date === 'string') && (typeof legend === 'string')) {

			if (typeof slideshow === 'string') {
				this.initDialog('photo', 'notransition slideshow');
				this.htmlParent(slideshow);
			}
			else {
				this.initDialog('photo', 'notransition');
				this.htmlParent();
			}

			this.htmlMedia(url, name, date, legend);
			this.htmlHelp((typeof slideshow === 'string'), false);
			this.htmlButtonClose();
			this.htmlButtonNavigation();

			this.showDialog();

			// chargement de l'image
			// redéfini temporairement this.media
			// enregistre la taille de l'image sur this.media pour actionResizeMedia
			// utilise this.a pour enregistrer l'url pour le background-image
			this.media = new Image();
			this.media.src = this.a = url;

			this.media.onload = function (width, height) {

				width = this.media.width;
				height = this.media.height;

				this.media = document.getElementById('apijsMedia');

				if (this.media) {
					this.media.width = width;
					this.media.height = height;
					this.media.setAttribute('class', 'img default');
					this.media.setAttribute('style', 'background-image:url("' + this.a + '");');
					this.actionResizeMedia();
				}
			}.bind(this);

			this.media.onerror = function () {

				this.media = document.getElementById('apijsMedia');

				if (this.media) {
					this.media.setAttribute('class', 'img error');
					this.media.firstChild.appendChild(apijs.i18n.nodeTranslate('imageError404'));
				}
			}.bind(this);
		}
		else {
			apijs.error('TheDialog.dialogPhoto', {
				'(string) *url': url,
				'(string) *name': name,
				'(string) *date': date,
				'(string) *legend': legend
			});
		}
	};


	// #### Dialogue vidéo ########################################################## public ### //
	// = révision : 110
	// » Permet d'afficher une vidéo au premier plan
	// » Composé d'une vidéo, d'une définition et de trois boutons de dialogue (Précédent/Suivant/Fermer)
	// » S'adapte automatiquement à la taille de la fenêtre et se met en pause lors d'un changement d'onglet
	// » Fermeture par bouton Fermer ou touche Échap et Touche F11 pour passer en plein écran
	this.dialogVideo = function (url, name, date, legend, slideshow) {

		if ((typeof url === 'string') && (typeof name === 'string') && (typeof legend === 'string') && (typeof legend === 'string')) {

			if (typeof slideshow === 'string') {
				this.initDialog('video', 'notransition slideshow');
				this.htmlParent(slideshow);
			}
			else {
				this.initDialog('video', 'notransition');
				this.htmlParent();
			}

			this.htmlMedia(url, name, date, legend);
			this.htmlHelp((typeof slideshow === 'string'), true);
			this.htmlButtonClose();
			this.htmlButtonNavigation();
			this.htmlPlayer();

			this.showDialog();

			// chargement du lecteur
			if (apijs.config.dialog.player) {
				this.player = new apijs.core.player();
				this.player.init(this.media, this.a); // ici, et seulement ici, a = div class player
			}
		}
		else {
			apijs.error('TheDialog.dialogVideo', {
				'(string) *url': url,
				'(string) *name': name,
				'(string) *date': date,
				'(string) *legend': legend
			});
		}
	};



	// GESTION DES INTERACTIONS ENTRE LE MONDE ET LES DIALOGUES

	// #### Action de fermeture ############################################ event ## public ### //
	// = révision : 62
	// » Supprime la boîte de dialogue
	// » Sur demande ou au clic mais pour certains dialogues
	// » Supprime aussi l'éventuelle ancre du mode diaporama
	this.actionClose = function (ev) {

		if (new RegExp('#(' + apijs.config.slideshow.ids + '(?:-|\\.)[0-9]+(?:-|\\.)[0-9]+)').test(location.href)) {
			if (apijs.config.slideshow.anchor && (typeof history.pushState === 'function'))
				history.pushState({}, '', location.href.slice(0, location.href.indexOf('#')));
		}

		if (typeof ev === 'object') {
			if ((ev.target.getAttribute('id') === 'apijsDialog') && !apijs.dialog.styles.has('photo', 'video', 'waiting', 'progress', 'lock'))
				apijs.dialog.deleteDialog(true);
		}
		else {
			if (document.getElementById('apijsDialog'))
				this.deleteDialog((typeof ev !== 'boolean') ? true : ev);
		}
	};


	// #### Action du clavier et du navigateur #################### event ## i18n ## private ### //
	// = révision : 145
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
		if (styles.has('waiting', 'progress', 'lock')) {

			if ((ev.ctrlKey && [81, 87, 82, 115, 116].has(ev.keyCode)) ||
			    (ev.altKey && ev.keyCode === 115) || [27, 116].has(ev.keyCode))
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
		// empèche la fermeture de l'onglet et donc du navigateur
		if (apijs.dialog.styles.has('waiting', 'progress', 'lock')) {
			ev.preventDefault();
			ev.stopPropagation();
			return apijs.i18n.translate('userLeavePage') + '\n' + apijs.i18n.translate('warningLostChange');
		}
	};

	this.actionScrollBrowser = function (ev) {

		// dialogues du diaporama
		// passe au média suivant ou précédent
		if (apijs.dialog.styles.has('slideshow') && ['DOMMouseScroll','mousewheel'].has(ev.type)) {

			var time = new Date().getTime() / 1000;

			if ((apijs.dialog.scrollTime < 1) || (time > apijs.dialog.scrollTime + 2)) {

				apijs.dialog.scrollTime = time;

				if ((ev.detail > 0) || (ev.wheelDelta < 0))
					apijs.slideshow.actionNext();
				else
					apijs.slideshow.actionPrev();
			}
		}

		// empèche le défilement
		// dans tous les cas
		ev.preventDefault();
		ev.stopPropagation();
	};


	// #### Action du bouton Valider ############################## event ## i18n ## private ### // TODO
	// = révision : 171
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
			this.styles.add('lock');

			// masque les boutons et le texte du dialogue
			this.tBox.querySelector('div.control').style.visibility = 'hidden';
			this.tBox.querySelector('div.bbcode').style.visibility = 'hidden';

			// met en place le texte d'attente
			this.a = document.createElement('p');
			this.a.setAttribute('class', 'saving');
			this.a.appendChild(apijs.i18n.nodeTranslate('operationInProgress'));
			this.tBox.appendChild(this.a);

			// active le lien différé (7000 ms)
			this.timer = window.setTimeout(apijs.dialog.htmlLinkReload, 7000);

			// appelle la fonction de rappel
			// ne déverrouille pas le dialogue
			window.setTimeout(function () {
				if ((this.tBox) && (this.tBox.nodeName === 'FORM'))
					this.callback(this.tBox.getAttribute('action'), this.args);
				else if (this.tBox)
					this.callback(this.args);
			}.bind(this), 1000);
		}
		else if (this.styles.has('upload')) {
			apijs.upload.actionConfirm(this.tBox.getAttribute('action'));
		}

		return false;
	};


	// #### Redimensionnement de la fenêtre ############################### event ## private ### //
	// = révision : 25
	// » Affiche la photo (ou l'image) au centre (center=default) ou au mieux (contain=bis)
	// » Positionne les contrôles de la vidéo juste en dessous de celle-ci (attribut style)
	this.actionResizeMedia = function () {

		var that = apijs.dialog, media = that.media, bis = false, width = 0, height = 0, top = 0;

		// mode d'affichage de la photo (DIV et non IMG)
		if (media.nodeName === 'DIV') {

			if ((media.width > media.offsetWidth) || (media.height > media.offsetHeight))
				bis = true;

			// img.default { background-position:center; } - img.bis { background-size:contain; }
			media.setAttribute('class', media.getAttribute('class').replace((bis) ? 'default' : 'bis', (bis) ? 'bis' : 'default'));
		}
		// positionnement des contrôles de la vidéo
		else if (media.nodeName === 'VIDEO') {

			if ((media.videoWidth > 0) && (media.videoHeight > 0) && (media.duration > 0)) {

				if ((media.videoWidth / media.videoHeight) <= (media.offsetWidth / media.offsetHeight)) {
					width  = media.videoWidth / (media.videoHeight / media.offsetHeight);
					height = media.offsetHeight;
				}
				else {
					width  = media.offsetWidth;
					height = media.videoHeight / (media.videoWidth / media.offsetWidth);
					top = (media.offsetHeight - height) / 2;
				}
			}
			else {
				width  = media.offsetHeight * 0.9 * 1.33333;
				height = media.offsetHeight * 0.9;
				top = (media.offsetHeight - media.offsetHeight * 0.9) / 2;
			}

			that.tBox.querySelector('div.player').setAttribute('style', 'width:' + parseInt(width, 10) + 'px;');
			that.tBox.querySelector('div.player div').setAttribute('style', 'margin-top:' + parseInt(top, 10) +
				'px; height:' + parseInt(height, 10) + 'px; line-height:' + parseInt(height, 10) + 'px;');
		}
	};


	// #### Plein écran ou document caché ################################# event ## private ### //
	// = révision : 4
	// » Met en pause la vidéo lorsque la page n'est plus visible (utilise l'API JavaScript Page Visibility)
	// » Entre en mode plein écran pour les dialogues photo et vidéo (utilise l'API JavaScript full screen)
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

		var elem = apijs.dialog.tDialog;

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
	// = révision : 103
	// » Supprime l'ancien dialogue
	// » Empêche la navigation au clavier avec la touche TAB de quitter la boîte de dialogue
	// » Met en place les gestionnaires d'événements du dialogue (+keydown, +beforeunload, +DOMMouseScroll, +mousewheel, +touchmove)
	this.initDialog = function (type, icon) {

		// préparation
		if (this.styles !== null)
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
		if (apijs.config.dialog.restrictNavigation) {

			var elem, elems = document.querySelectorAll('a,area,button,input,object,select,textarea,iframe');
			for (elem = 0; elem < elems.length; elem++) {
				if (typeof elems[elem] === 'object')
					elems[elem].setAttribute('tabindex', '-1');
			}
		}
	};


	// #### Affiche le dialogue #################################################### private ### //
	// = révision : 54
	// » Accroche le fragment DOM au document HTML (sur body ou sur #apijsDialog)
	// » Diffère le changement de la classe CSS de start vers ready pour permettre les transitions CSS lorsque nécessaire (12 ms)
	// » Met en place les gestionnaires d'événements du contenu du dialogue (+click, +resize, +visibilitychange)
	this.showDialog = function () {

		// si un dialogue en cours de transition existe, on le dégage de suite
		// il serait dommage qu'une boîte de dialogue invisible reste affichée et porte préjudice
		if (document.getElementById('apijsDialog') && (document.getElementById('apijsDialog').getAttribute('class') === 'end'))
			document.body.removeChild(document.getElementById('apijsDialog'));

		// sans transitions CSS ou avec transitions CSS
		if (document.getElementById('apijsDialog') || this.styles.has('notransition')) {

			this.tDialog.setAttribute('class', this.tDialog.getAttribute('class').replace('start', 'ready'));
			this.tBox.setAttribute('class', this.tBox.getAttribute('class').replace('start', 'ready'));

			if (document.getElementById('apijsDialog')) {
				document.getElementById('apijsDialog').appendChild(this.tBox);
				this.tDialog = document.getElementById('apijsDialog'); // important
			}
			else {
				document.body.appendChild(this.frag);
			}
		}
		else {
			document.body.appendChild(this.frag);

			window.setTimeout(function () {
				this.tDialog.setAttribute('class', this.tDialog.getAttribute('class').replace('start', 'ready'));
				this.tBox.setAttribute('class', this.tBox.getAttribute('class').replace('start', 'ready'));
			}.bind(this), 12);
		}

		// fermeture des popups au clic
		if (apijs.config.dialog.closeOnClick && !this.styles.has('waiting', 'progress', 'lock'))
			document.addEventListener('click', apijs.dialog.actionClose, false);

		// adaptation de la taille du média
		if (this.styles.has('photo', 'video'))
			window.addEventListener('resize', apijs.dialog.actionResizeMedia, false);

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
	// = révision : 171
	// » Supprime la boîte de dialogue totalement ou pas
	// » Annule les gestionnaires d'événements du dialogue (-keydown, -beforeunload, -DOMMouseScroll, -mousewheel, -touchmove)
	// » Annule les gestionnaires d'événements du contenu du dialogue (-click, -resize, -visibilitychange)
	// » Utilise l'évnement qui détecte la fin des transitions (+webkitTransitionEnd ou +transitionend)
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
		if (apijs.config.dialog.restrictNavigation) {

			var elem, elems = document.querySelectorAll('a,area,button,input,object,select,textarea,iframe');
			for (elem = 0; elem < elems.length; elem++) {
				if (typeof elems[elem] === 'object')
					elems[elem].removeAttribute('tabindex');
			}
		}

		// fermeture des popups au clic (depuis showDialog)
		if (apijs.config.dialog.closeOnClick)
			document.removeEventListener('click', apijs.dialog.actionClose, false);

		// adaptation de la taille du média (depuis showDialog)
		if (this.styles.has('photo', 'video'))
			window.removeEventListener('resize', apijs.dialog.actionResizeMedia, false);

		// mise en pause de la vidéo (depuis showDialog)
		if (this.styles.has('video')) {

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
		this.tDialog = document.getElementById('apijsDialog');
		this.tBox = document.getElementById('apijsBox');

		if (all) {
			// avec ou sans transitions CSS
			// ici on s'assure que les transitions fonctionnent (style CSS, valeur calculée)
			// il serait dommage qu'une boîte de dialogue invisible reste affichée et porte préjudice
			var styles = window.getComputedStyle(this.tBox, null),
			    event = (typeof this.tBox.style.webkitTransition === 'string') ? 'webkitTransitionEnd' : 'transitionend';

			if (!this.styles.has('notransition') && (styles.transitionDuration !== '0s') && (typeof styles.transitionDuration === 'string')) {

				this.tDialog.setAttribute('class', this.tDialog.getAttribute('class').replace('ready', 'end'));
				this.tBox.setAttribute('class', this.tBox.getAttribute('class').replace('ready', 'end'));

				this.tDialog.addEventListener(event, function () {
					if (document.getElementById('apijsDialog'))
						document.body.removeChild(document.getElementById('apijsDialog'));
				}, false);
			}
			else {
				document.body.removeChild(document.getElementById('apijsDialog'));
			}
		}
		else if (this.tBox) {
			this.tBox.parentNode.removeChild(this.tBox);
		}

		// réinitialise les variables
		// toutes ou presque SAUF timer
		this.styles = null;
		this.media  = null;
		this.player = null;
		this.paused = true;

		if (all) {
			this.scrollTime = 0;
			this.callback = null;
			this.args = null;
		}

		this.frag = null;
		this.a = null;
		this.b = null;
		this.c = null;
		this.d = null;
		this.e = null;

		this.tDialog = null; // div id=apijsDialog
		this.tBox = null;    // div/form id=apijsBox
		this.tTitle = null;  // h1
	};



	// CONTENU DES BOÎTES DE DIALOGUE

	// #### Éléments parents ####################################################### private ### //
	// = révision : 109
	// » Crée le conteneur parent et le conteneur du contenu du dialogue
	// » Met en place le titre du dialogue
	// # <div class="start [{data}]" id="apijsDialog">
	// #  [<div class="start {this.styles}" id="apijsBox"></div>]
	// #  [<form action="{data}" method="post" enctype="multipart/form-data"
	// #    onsubmit="return apijs.dialog.actionConfirm();" class="start {this.styles}" id="apijsBox"></form>]
	// # </div>
	this.htmlParent = function (data) {

		this.tDialog = document.createElement('div');
		this.tDialog.setAttribute('class', (this.styles.has('slideshow')) ? 'start ' + data : 'start');
		this.tDialog.setAttribute('id', 'apijsDialog');

			if (!this.styles.has('options', 'upload')) {
				this.tBox = document.createElement('div');
			}
			else {
				this.tBox = document.createElement('form');
				this.tBox.setAttribute('action', data);
				this.tBox.setAttribute('method', 'post');
				this.tBox.setAttribute('enctype', 'multipart/form-data');
				this.tBox.setAttribute('onsubmit', 'return apijs.dialog.actionConfirm();');
			}

			this.tBox.setAttribute('class', 'start ' + this.styles.toString()); // .toString() pour IE
			this.tBox.setAttribute('id', 'apijsBox');

		this.tDialog.appendChild(this.tBox);
		this.frag.appendChild(this.tDialog);
	};


	// #### Texte ################################################################## private ### //
	// = révision : 98
	// » Met en place le titre et le paragraphe du dialogue
	// » Prend en charge le bbcode via innerHTML ainsi que les émoticônes
	// » Ouvre les liens ayant la classe CSS popup dans un nouvel onglet
	// # [<h1>{title}</h1>]
	// #  <div class="bbcode">
	// #   [<p>]{data}[</p>]
	// #  </div>
	this.htmlContent = function (title, data) {

		// titre
		if (title.length > 0) {

			this.tTitle = document.createElement('h1');
			this.tTitle.appendChild(document.createTextNode(title));

			this.tBox.appendChild(this.tTitle);
		}

		// contenu
		this.a = document.createElement('div');
		this.a.setAttribute('class', 'bbcode');

		if (data[0] !== '[')
			data = '[p]' + data + '[/p]';

		// http://icomoon.io/app/
		// avec le fichier de session fonts/icomoon.json
		if (apijs.config.dialog.emotes) {

			data = data.replace(/ (\(L\))/g,  '`$1`00¤')
				.replace(/ (\(u\))/ig, '`$1`01¤')
				.replace(/ (\(y\))/ig, '`$1`02¤')
				.replace(/ (\(n\))/ig, '`$1`03¤')
				.replace(/ (:D)/ig,    '`$1`04¤')
				.replace(/ (:\))/g,    '`$1`05¤')
				.replace(/ (:p)/ig,    '`$1`06¤')
				.replace(/ (:\()/g,    '`$1`07¤')
				.replace(/ (;\))/g,    '`$1`08¤')
				.replace(/ (:lol)/ig,  '`$1`09¤')
				.replace(/ (8\))/g,    '`$1`0a¤')
				.replace(/ (:@)/g,     '`$1`0b¤')
				.replace(/ (\(6\))/g,  '`$1`0c¤')
				.replace(/ (:o)/ig,    '`$1`0d¤')
				.replace(/ (\(\!\))/g, '`$1`0e¤')
				.replace(/ (\(\?\))/g, '`$1`0f¤')
				.replace(/ (:s)/ig,    '`$1`10¤')
				.replace(/ (:\|)/g,    '`$1`11¤')
				.replace(/ (:\/)/g,    '`$1`12¤')
				.replace(/ (\(i\))/ig, '`$1`13¤')
				.replace(/`(.{2,4})`([0-9a-f]{2})¤/g, ' [span title="$1" class="ico"]&#xe6$2;[/span]');
		}

		this.a.innerHTML = data.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\[/g, '<').replace(/\]/g, '>');

		// liens dans un nouvel onglet
		var link, links = this.a.querySelectorAll('a.popup');
		for (link = 0; link < links.length; link++)
			links[link].addEventListener('click', apijs.openTab, false);

		this.tBox.appendChild(this.a);
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
		this.tBox.appendChild(this.a);
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
		this.tBox.appendChild(this.a);
	};


	// #### Boutons Précédent/Suivant ###################################### i18n ## private ### //
	// = révision : 55
	// » Met en place les boutons Précédent et Suivant des dialogues photo et vidéo
	// » À savoir un bouton à gauche et un bouton à droite de la boîte de dialogue
	// » Boutons au format image ou texte en fonction de la configuration
	// # <div class="navigation [txt|img]">
	// #  <button type="button" disabled="disabled" onclick="...actionPrev();" class="prev" id="apijsPrev">
	// #   [<img src="{config.dialog.imagePrev.src}" width="{config.dialog.imagePrev.width}" height="{config.dialog.imagePrev.height}"
	// #    alt="{i18n.buttonPrev}" />]
	// #   [<span>{i18n.buttonPrev}</span>]
	// #  </button>
	// #  <button type="button" disabled="disabled" onclick="...actionNext();" class="next" id="apijsNext">
	// #   [<img src="{config.dialog.imageNext.src}" width="{config.dialog.imageNext.width}" height="{config.dialog.imageNext.height}"
	// #    alt="{i18n.buttonNext}" />]
	// #   [<span>{i18n.buttonNext}</span>]
	// #  </button>
	// # </div>
	this.htmlButtonNavigation = function () {

		var txt = ((apijs.config.dialog.imagePrev === null) || (apijs.config.dialog.imageNext === null));

		this.a = document.createElement('div');
		this.a.setAttribute('class', (txt) ? 'navigation txt' : 'navigation img');

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('disabled', 'disabled');
			this.b.setAttribute('onclick', 'apijs.slideshow.actionPrev();');
			this.b.setAttribute('class', 'prev');
			this.b.setAttribute('id', 'apijsPrev');

			if (txt) {
				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.nodeTranslate('buttonPrev'));
			}
			else {
				this.c = document.createElement('img');
				this.c.setAttribute('src', apijs.config.dialog.imagePrev.src);
				this.c.setAttribute('width', apijs.config.dialog.imagePrev.width);
				this.c.setAttribute('height', apijs.config.dialog.imagePrev.height);
				this.c.setAttribute('alt', apijs.i18n.translate('buttonPrev'));
			}

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('disabled', 'disabled');
			this.b.setAttribute('onclick', 'apijs.slideshow.actionNext();');
			this.b.setAttribute('class', 'next');
			this.b.setAttribute('id', 'apijsNext');

			if (txt) {
				this.c = document.createElement('span');
				this.c.appendChild(apijs.i18n.nodeTranslate('buttonNext'));
			}
			else {
				this.c = document.createElement('img');
				this.c.setAttribute('src', apijs.config.dialog.imageNext.src);
				this.c.setAttribute('width', apijs.config.dialog.imageNext.width);
				this.c.setAttribute('height', apijs.config.dialog.imageNext.height);
				this.c.setAttribute('alt', apijs.i18n.translate('buttonNext'));
			}

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);
		this.tBox.appendChild(this.a);
	};


	// #### Bouton Fermer ################################################## i18n ## private ### //
	// = révision : 103
	// » Met en place le bouton Fermer des dialogues photo et vidéo
	// » À savoir un bouton dans le coin en haut à droite de la boîte de dialogue
	// » Bouton au format image ou texte en fonction de la configuration
	// # <div class="close [txt|img]">
	// #  <button type="button" onclick="...actionClose();" class="close">
	// #   [<img src="{config.dialog.imageClose.src}" width="{config.dialog.imageClose.width}" height="{config.dialog.imageClose.height}"
	// #    alt="{i18n.buttonClose}" />][{i18n.buttonClose}]
	// #  </button>
	// # </div>
	this.htmlButtonClose = function () {

		var txt = (apijs.config.dialog.imageClose === null);

		this.a = document.createElement('div');
		this.a.setAttribute('class', (txt) ? 'close txt' : 'close img');

			this.b = document.createElement('button');
			this.b.setAttribute('type', 'button');
			this.b.setAttribute('onclick', 'apijs.dialog.actionClose();');
			this.b.setAttribute('class', 'close');

			if (txt) {
				this.b.appendChild(apijs.i18n.nodeTranslate('buttonClose'));
			}
			else {
				this.c = document.createElement('img');
				this.c.setAttribute('src', apijs.config.dialog.imageClose.src);
				this.c.setAttribute('width', apijs.config.dialog.imageClose.width);
				this.c.setAttribute('height', apijs.config.dialog.imageClose.height);
				this.c.setAttribute('alt', apijs.i18n.translate('buttonClose'));
				this.b.appendChild(this.c);
			}

		this.a.appendChild(this.b);
		this.tBox.appendChild(this.a);
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

		that.tBox.appendChild(that.a);
	};


	// #### Formulaire d'envoi de fichier ################################## i18n ## private ### //
	// = révision : 174
	// » Met en place le contenu du formulaire du dialogue d'upload
	// » Bascule automatiquement le focus entre le bouton/label fichier et le bouton Valider
	// » [Firefox 4/10] Le champ fichier n'est pas en 'display:none' mais en 'width:0; visibility:hidden;' car sinon il ne fonctionne pas
	// » [IE 9/10] Le input.click() ne fonctionne pas d'où le label à la place du bouton [touche entrée sans effet sur le label]
	// » [IE 9] Le this.files ne fonctionne pas d'où le this.value
	// # <div class="control upload">
	// #  [<input type="hidden" name="{config.upload.tokenName}" value="{config.upload.tokenValue}" />]
	// #   <input type="file" name="{inputname}" id="apijsFile" onchange="..." />
	// #  [<label for="apijsFile" tabindex="1" class="browse">{i18n.buttonBrowse}</label>]
	// #  [<button type="button" onclick="..." class="browse">{i18n.buttonBrowse}</button>]
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
			this.b.setAttribute('id', 'apijsFile');
			this.b.setAttribute('onchange', "apijs.dialog.tBox.querySelector('button.confirm').focus(); apijs.dialog.tBox.querySelector('span').innerHTML = (this.files) ? this.files[0].name : this.value.slice(12);");

		this.a.appendChild(this.b);

			// Élément label (parcourir) pour IE 9/10 ou Élément button (parcourir)
			// un bouton sur IE9/10 = access denied
			if (navigator.userAgent.indexOf('MSIE') > 0) {
				this.b = document.createElement('label');
				this.b.setAttribute('for', 'apijsFile');
				this.b.setAttribute('tabindex', '1');
			}
			else {
				this.b = document.createElement('button');
				this.b.setAttribute('type', 'button');
				this.b.setAttribute('onclick', "document.getElementById('apijsFile').click();");
			}
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
		this.tBox.appendChild(this.a);
	};


	// #### Barre de progression ################################################### private ### //
	// = révision : 73
	// » Met en place le graphique SVG du dialogue de progression
	// » Utilise une image SVG inline
	// # <svg xmlns="http://www.w3.org/2000/svg" id="apijsProgress">
	// #  <rect class="auto" />
	// # </svg>
	this.htmlProgressBar = function () {

		this.a = document.createElement('svg');
		this.a.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		this.a.setAttribute('id', 'apijsProgress');

			this.b = document.createElement('rect');
			this.b.setAttribute('class', 'auto');

		this.a.appendChild(this.b);
		this.tBox.appendChild(this.a);
	};


	// #### Média et légende ####################################################### private ### //
	// = révision : 194
	// » Met en place la photo ou vidéo (le média) et la légende du dialogue photo ou vidéo
	// » La balise image n'est pas utilisée pour le dialogue photo (utilise à la place l'arrière plan d'une div)
	// » Extrait les sources de vidéo à partir de l'adresse de la vidéo (par exemple ./video.webm?get=1#ogv,mp4)
	// # <dl class="media">
	// #  <dt>
	// #   [<div class="img loading" id="apijsMedia">
	// #     <span />
	// #    </div>]
	// #   [<video controls="controls" preload="metadata" onloadstart="...actionResizeMedia();" id="apijsMedia">
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

			// traitement très très différent entre une photo et une vidéo
			// affichage d'une image dans une balise DIV (et non IMG) ou affichage d'une vidéo dans la balise VIDÉO
			if (this.styles.has('photo')) {

				this.media = document.createElement('div');
				this.media.setAttribute('class', 'img loading');

				this.d = document.createElement('span');
				this.media.appendChild(this.d);
			}
			else {
				this.media = document.createElement('video');
				this.media.setAttribute('controls', 'controls');
				this.media.setAttribute('preload', 'metadata');
				this.media.setAttribute('onloadstart', 'apijs.dialog.actionResizeMedia();');

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
					if (mimes.hasOwnProperty(ext))
						this.c.setAttribute('type', mimes[ext]);

					this.media.appendChild(this.c);
				}
			}

			this.media.setAttribute('id', 'apijsMedia');
			this.b.appendChild(this.media);

		this.a.appendChild(this.b);

			this.b = document.createElement('dd');

			if ((name !== 'false') || (date !== 'false')) {

				this.c = document.createElement('span');

				// name + date
				if ((name !== 'false') && (name !== 'auto') && (date !== 'false'))
					this.c.appendChild(document.createTextNode(name + ' (' + date + ')'));
				// name
				else if ((name !== 'false') && (name !== 'auto'))
					this.c.appendChild(document.createTextNode(name));
				// auto name + date
				else if ((name === 'auto') && (date !== 'false'))
					this.c.appendChild(document.createTextNode(fileid + ' (' + date + ')'));
				// auto name
				else if (name === 'auto')
					this.c.appendChild(document.createTextNode(fileid));
				// date
				else if (date !== 'false')
					this.c.appendChild(document.createTextNode('(' + date + ')'));

				this.b.appendChild(this.c);
			}

			this.b.appendChild(document.createTextNode(' ' + legend + ' '));

		this.a.appendChild(this.b);
		this.tBox.appendChild(this.a);
	};


	// #### Lecteur vidéo ################################################## i18n ## private ### //
	// = révision : 12
	// » Met en place les contrôles du lecteur vidéo
	// » Utilise des images SVG inline
	// # <div class="player">
	// #  <div onclick="...actionStartVideo();">
	// #   <span class="run">▶</span>
	// #  </div>
	// #  <div>
	// #   <span class="play" onclick="...actionKey(80);">▶</span>  // 80 = P
	// #   <span class="bar">
	// #    <svg xmlns="http://www.w3.org/2000/svg" class="bar" onclick="...actionPositionVideo(event);">
	// #     <rect />
	// #    </svg>
	// #   </span>
	// #   <span class="time">00:00 / 00:00</span>
	// #   <span class="vol">
	// #    <svg xmlns="http://www.w3.org/2000/svg" class="vol" onclick="...actionVolumeVideo(event);">
	// #     <rect />
	// #    </svg>
	// #   </span>
	// #   <span class="full" title="{i18n.ctrlDialogFullscreen}" onclick="...actionKey(122);">+</span>  // 122 = F11
	// #  </div>
	// # </div>
	this.htmlPlayer = function () {

		this.a = document.createElement('div');
		this.a.setAttribute('class', 'player');

			this.b = document.createElement('div');
			this.b.setAttribute('onclick', 'apijs.dialog.actionKey(80);');

				this.c = document.createElement('span');
				this.c.setAttribute('class', 'run');
				this.c.appendChild(document.createTextNode('▶'));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);

			this.b = document.createElement('div');

				this.c = document.createElement('span');
				this.c.setAttribute('class', 'play');
				this.c.setAttribute('onclick', 'apijs.dialog.actionKey(80);');
				this.c.appendChild(document.createTextNode('▶'));

			this.b.appendChild(this.c);

				this.c = document.createElement('span');
				this.c.setAttribute('class', 'bar');

					this.d = document.createElement('svg');
					this.d.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
					this.d.setAttribute('class', 'bar');
					this.d.setAttribute('onclick', 'apijs.dialog.player.actionPositionVideo(event);');

						this.e = document.createElement('rect');

					this.d.appendChild(this.e);

				this.c.appendChild(this.d);

			this.b.appendChild(this.c);

				this.c = document.createElement('span');
				this.c.setAttribute('class', 'time');
				this.c.appendChild(document.createTextNode('00:00 / 00:00'));

			this.b.appendChild(this.c);

				this.c = document.createElement('span');
				this.c.setAttribute('class', 'vol');

					this.d = document.createElement('svg');
					this.d.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
					this.d.setAttribute('class', 'vol');
					this.d.setAttribute('onclick', 'apijs.dialog.player.actionVolumeVideo(event);');

						this.e = document.createElement('rect');

					this.d.appendChild(this.e);

				this.c.appendChild(this.d);

			this.b.appendChild(this.c);

				this.c = document.createElement('span');
				this.c.setAttribute('class', 'full');
				this.c.setAttribute('title', apijs.i18n.translate('ctrlDialogFullscreen'));
				this.c.setAttribute('onclick', 'apijs.dialog.actionKey(122);');
				this.c.appendChild(document.createTextNode('+'));

			this.b.appendChild(this.c);

		this.a.appendChild(this.b);
		this.media.parentNode.appendChild(this.a);
	};


	// #### Aide à la navigation ########################################### i18n ## private ### //
	// = révision : 17
	// » Affiche la liste des commandes disponibles
	// » Pour les diaporamas : ↖|Fin début/fin ; ←|→ précédent/suivant
	// » Pour les vidéos : ↓|↑ reculer/avancer ; -|+ baisser/augmenter le volume ; m couper le son ; p lecture/pause
	// » Pour tous : F11 plein écran ; Échap quitter
	// # <div class="kbd">
	// #  <ul>
	// #   <li>
	// #    [<kbd>X</kbd> [<kbd>X</kbd>] {i18n.xxx}]
	// #    [<kbd class="X" title="X"></kbd> [<kbd>X</kbd>] {i18n.xxx}]
	// #   </li>
	// #  </ul>
	// # </div>
	this.htmlHelp = function (slideshow, video) {

		var i, j, tmp, total, data = [];

		// préparation de la liste des contrôles
		if (slideshow) {
			data.push(['start;↖', 'ctrlKeyEnd', 'ctrlSlideshowFirstLast']);
			data.push(['left;←', 'right;→', 'ctrlSlideshowNextPrev']);
		}
		if (video) {
			data.push(['bot;↓', 'top;↑', 'ctrlVideoTime']);
			data.push(['less;-', 'more;+', 'ctrlVideoSound']);
			data.push(['m', 'ctrlVideoMute']);
			data.push(['p', 'ctrlVideoPause']);
		}
		data.push(['ctrlKeyEsc', 'ctrlDialogQuit']);

		// génération des éléments
		this.a = document.createElement('div');
		this.a.setAttribute('class', 'kbd');

			this.b = document.createElement('ul');

			for (i = 0; i < data.length; i++) {

				total = data[i].length - 1;
				this.c = document.createElement('li');

				for (j = 0; j < total; j++) {

					this.d = document.createElement('kbd');

					if (data[i][j].indexOf(';') > 0) {
						tmp = data[i][j].split(';');
						this.d.setAttribute('class', tmp[0]);
						this.d.setAttribute('title', tmp[1]);
					}
					else {
						this.d.appendChild(apijs.i18n.nodeTranslate(data[i][j]));
					}

					this.c.appendChild(this.d);
				}

				this.c.appendChild(apijs.i18n.nodeTranslate(data[i][total]));
				this.b.appendChild(this.c);
			}

		this.a.appendChild(this.b);
		this.tBox.appendChild(this.a);
	};
};

apijs.core.styles = function () {

	this.data = [];

	this.init = function (type, icon) {
		this.data.push(type);
		if (typeof icon === 'string')
			this.data = this.data.concat(icon.split(' '));
	};

	this.add = function (value) {
		if (!this.data.hasOwnProperty(value))
			this.data.push(value);
		return this.data;
	};

	this.toggle = function (search, replace) {
		if (this.has(search))
			this.remove(search);
		if (!this.has(replace))
			this.add(replace);
	};

	this.has = function () {
		return this.data.has(Array.prototype.slice.call(arguments, 0));
	};

	this.remove = function () {
		var arg, args = Array.prototype.slice.call(arguments, 0);
		for (arg in args) if (args.hasOwnProperty(arg))
			this.data.splice(this.data.indexOf(args[arg]), 1);
		return this.data;
	};

	this.toString = function () {
		return this.data.join(' ');
	};
};