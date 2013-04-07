/**
 * Created D/12/04/2009
 * Updated V/05/04/2013
 * Version 135
 *
 * Copyright 2008-2013 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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

	// définition des attributs
	this.classNames = null;

	this.image = null;
	this.imageSize = null;
	this.videoPlaying = false;

	this.timer = null;
	this.timerbis = null;
	this.callback = null;
	this.callbackParam = null;

	this.fragment = null;
	this.elemA = null;
	this.elemB = null;
	this.elemC = null;
	this.elemD = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES BOITES DE DIALOGUE

	// #### Dialogue d'information ################################# i18n ## debug ## public ### //
	// = révision : 76
	// » Permet d'afficher un message d'information à l'intention de l'utilisateur
	// » Composé d'un titre, d'un paragraphe et d'un bouton de dialogue
	// » Fermeture par bouton Ok ou touche Échap
	// » Auto-focus sur le bouton Ok
	this.dialogInformation = function (title, text, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.setupDialog('information', icon);

			this.htmlParent(false);
			this.htmlTitle(title);
			this.htmlText(text);
			this.htmlButtonOk();

			this.showDialog();
			document.getElementById('box').lastChild.firstChild.focus();
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogInformation[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue de confirmation ############################### i18n ## debug ## public ### //
	// = révision : 89
	// » Permet de demander une confirmation à l'utilisateur
	// » Composé d'un titre, d'un paragraphe et de deux boutons de dialogue
	// » Par la suite peut également être composé d'un lien différé de 10 secondes
	// » Fermeture par bouton Annuler ou touche Échap tant que le dialogue n'est pas validé
	// » Appel la fonction callback avec son paramètre callbackParam après la validation du dialogue
	// » Auto-focus sur le bouton Valider
	this.dialogConfirmation = function (title, text, callback, callbackParam, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof callback === 'function')) {

			this.setupDialog('confirmation', icon);

			this.htmlParent(false);
			this.htmlTitle(title);
			this.htmlText(text);
			this.htmlButtonConfirm('button');

			this.callback = callback;
			this.callbackParam = callbackParam;

			this.showDialog();
			document.getElementById('box').lastChild.firstChild.focus();
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogConfirmation[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (function) callback : ' + callback + '[br]➩ (mixed) callbackParam : ' + callbackParam + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue d'options ##################################### i18n ## debug ## public ### //
	// = révision : 25
	// » Permet à l'utilisateur de modifier des options
	// » Composé d'un formulaire, d'un titre, d'un paragraphe et de deux boutons de dialogue
	// » Par la suite peut également être composé d'un lien différé de 10 secondes
	// » Validation du formulaire uniquement si l'appel de la fonction callback avec son paramètre callbackParam renvoie true
	// » Fermeture par bouton Annuler ou touche Échap tant que le formulaire n'est pas validé
	this.dialogFormOptions = function (title, text, action, callback, callbackParam, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof action === 'string') && (typeof callback === 'function')) {

			this.setupDialog('options', icon);

			this.htmlFormParent(action);
			this.htmlTitle(title);
			this.htmlText(text);
			this.htmlButtonConfirm('submit');

			this.callback = callback;
			this.callbackParam = callbackParam;

			this.showDialog();
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogFormOptions[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (string) action : ' + action + '[br]➩ (function) callback : ' + callback + '[br]➩ (mixed) callbackParam : ' + callbackParam + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue d'upload ###################################### i18n ## debug ## public ### //
	// = révision : 89
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Composé d'un formulaire, d'un titre, d'un paragraphe, d'un champ fichier et de deux boutons de dialogue
	// » Fermeture par bouton Annuler ou touche Échap tant que le formulaire n'est pas validé
	// » Auto-focus sur le champ fichier
	this.dialogFormUpload = function (title, text, inputname, uploadkey, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof uploadkey === 'string') && (typeof inputname === 'string')) {

			this.setupDialog('upload', icon);

			this.htmlFormParent(apijs.config.dialog.fileUpload, 'multipart/form-data', 'iframeUpload.' + uploadkey);
			this.htmlTitle(title);
			this.htmlText(text);
			this.htmlFormUpload(inputname, uploadkey);
			this.htmlButtonConfirm('submit');

			this.showDialog();
			window.setTimeout(function () { document.getElementById('box').getElementsByTagName('input')[1].focus(); }, 10);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogFormUpload[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (string) inputname : ' + inputname + '[br]➩ (string) uploadkey : ' + uploadkey + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue de progression ################################ i18n ## debug ## public ### //
	// = révision : 94
	// » Permet de faire patienter l'utilisateur en affichant une barre de progression
	// » Composé d'un titre, d'un paragraphe et d'une barre de progression
	// » Fermeture automatique ou pas et touches CTRL+Q, CTRL+W, CTRL+R, CTRL+F4, CTRL+F5, ALT+F4, Échap et F5 désactivées
	this.dialogProgress = function (title, text, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.setupDialog('progress', icon);

			this.htmlParent(false);
			this.htmlTitle(title);
			this.htmlText(text);
			this.htmlProgressBar();

			this.showDialog();
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogProgress[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue d'attente ##################################### i18n ## debug ## public ### //
	// = révision : 82
	// » Permet de faire patienter l'utilisateur en affichant un message d'attente
	// » Composé d'un titre, d'un paragraphe et d'un lien différé de 10 secondes ou plus si time est un nombre et si nolink est différent de false
	// » Fermeture automatique ou pas et touches CTRL+Q, CTRL+W, CTRL+R, CTRL+F4, CTRL+F5, ALT+F4, Échap et F5 désactivées
	this.dialogWaiting = function (title, text, time, nolink, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.setupDialog('waiting', icon);

			this.htmlParent(false);
			this.htmlTitle(title);
			this.htmlText(text);

			this.showDialog();

			if (nolink !== false)
				this.timer = window.setTimeout(apijs.dialog.htmlLinkReload.bind(this), (typeof time === 'number') ? time : 10000);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogWaiting[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (number) time : ' + time + '[br]➩ (boolean) nolink : ' + nolink + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue photo ######################################### i18n ## debug ## public ### //
	// = révision : 117
	// » Permet d'afficher une photo en plein écran au premier plan
	// » Composé d'une photo, d'une définition et de trois boutons de dialogue
	// » Fermeture par bouton Fermer ou touche Échap
	this.dialogPhoto = function (width, height, url, name, date, legend, slideshow) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof width === 'number') && (typeof height === 'number') && (typeof url === 'string') && (typeof name === 'string') && (typeof date === 'string') && (typeof legend === 'string')) {

			if ((typeof slideshow === 'string') && (slideshow.length > 0)) {
				this.setupDialog('photo slideshow');
				this.htmlParent(slideshow);
			}
			else {
				this.setupDialog('photo');
				this.htmlParent(false);
			}

			this.htmlPhoto(width, height, url, name, date, legend);
			this.htmlButtonClose();
			this.htmlButtonNavigation();

			this.showDialog();
			this.loadImage(width, height, url);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogPhoto[br]➩ (number) width : ' + width + '[br]➩ (number) height : ' + height + '[br]➩ (string) url : ' + url + '[br]➩ (string) name : ' + name + '[br]➩ (string) date : ' + date + '[br]➩ (string) legend : ' + legend + '[/pre]');
		}
	};


	// #### Dialogue vidéo ######################################### i18n ## debug ## public ### //
	// = révision : 76
	// » Permet d'afficher une vidéo en plein écran au premier plan
	// » Composé d'une vidéo, d'une définition et de trois boutons de dialogue
	// » Fermeture par bouton Fermer ou touche Échap
	this.dialogVideo = function (url, name, date, legend, slideshow) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof url === 'string') && (typeof name === 'string') && (typeof legend === 'string') && (typeof legend === 'string')) {

			if ((typeof slideshow === 'string') && (slideshow.length > 0)) {
				this.setupDialog('video slideshow');
				this.htmlParent(slideshow);
			}
			else {
				this.setupDialog('video');
				this.htmlParent(false);
			}

			this.htmlVideo(url, name, date, legend);
			this.htmlButtonClose();
			this.htmlButtonNavigation();

			this.showDialog();
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogVideo[br]➩ (string) url : ' + url + '[br]➩ (string) name : ' + name + '[br]➩ (string) date : ' + date + '[br]➩ (string) legend : ' + legend + '[/pre]');
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES ACTIONS DES BOUTONS, DES TOUCHES DU CLAVIER ET DU NAVIGATEUR

	// #### Action de fermeture ##################################################### public ### //
	// = révision : 43
	// » Supprime la boite de dialogue
	// » Affiche le site internet sur demande
	this.actionClose = function (all) {

		if (all) {
			apijs.dialog.deleteDialog(true);
			apijs.dialog.showPage();
		}
		else {
			apijs.dialog.deleteDialog(false);
		}
	};


	// #### Action de fermeture ############################################ event ## public ### //
	// = révision : 8
	// » Supprime la boite de dialogue lors d'un clic
	// » Affiche le site internet lorsque possible (clic sur la div id=dialog et dialogue non verrouillé)
	this.actionCloseOnClic = function (ev) {

		var classNames = apijs.dialog.classNames.split(' ');

		if ((ev.target.getAttribute('id') === 'dialog') && !in_array(['waiting', 'progress', 'lock'], classNames)) {
			apijs.dialog.deleteDialog(true);
			apijs.dialog.showPage();
		}
	};


	// #### Action du bouton Valider ##################### i18n ## debug ## event ## private ### //
	// = révision : 125
	// » Désactive l'action de la touche Échap
	// » Pour le dialogue de confirmation, appel la fonction de rappel (appel différé d'au moins 500 millisecondes)
	// » Pour le dialogue d'options, appel la fonction de rappel avant de soumettre le formulaire (envoi différé d'au moins 500 millisecondes)
	// » Pour le dialogue d'upload, appel la fonction actionConfirm de [TheUpload]
	this.actionConfirm = function () {

		var result = false;

		// *** Dialogue de confirmation ************************* //
		if (this.classNames.indexOf('confirmation') > -1) {

			this.classNames += ' lock';

			// gestion du dialogue (validation dans tous les cas)
			if (!apijs.config.dialog.savingDialog) {

				this.elemA = document.createElement('p');
				this.elemA.setAttribute('class', 'saving');
				this.elemA.appendChild(document.createTextNode(apijs.i18n.translate('operationInProgress')));

				document.getElementById('box').removeChild(document.getElementById('box').lastChild);
				document.getElementById('box').lastChild.setAttribute('class', 'novisible');
				document.getElementById('box').appendChild(this.elemA);

				this.timer = window.setTimeout(apijs.dialog.htmlLinkReload.bind(this), 10000);
			}
			else {
				this.dialogWaiting(
					document.getElementById('box').querySelector('h1').firstChild.nodeValue,
					apijs.i18n.translate('operationInProgress'),
					true, true, this.classNames.replace('confirmation', '').replace('lock', '')
				);
			}

			// fonction de rappel différée ou immédiate
			if (apijs.config.dialog.savingTime > 500) {

				this.timerbis = window.setTimeout(function () {
					if (typeof this.callback === 'function') {
						this.classNames = this.classNames.replace('lock', '');
						this.callback(this.callbackParam);
					}
				}.bind(this), apijs.config.dialog.savingTime);
			}
			else {
				this.classNames = this.classNames.replace('lock', '');
				this.callback(this.callbackParam);
			}

			result = true;
		}

		// *** Dialogue d'options ******************************* //
		else if (this.classNames.indexOf('options') > -1) {

			if (this.callback(this.callbackParam) === true) {

				// gestion du dialogue (en cas de validation)
				this.classNames += ' lock';

				this.elemA = document.createElement('p');
				this.elemA.setAttribute('class', 'saving');
				this.elemA.appendChild(document.createTextNode(apijs.i18n.translate('operationInProgress')));

				document.getElementById('box').removeChild(document.getElementById('box').lastChild);
				document.getElementById('box').lastChild.setAttribute('class', 'novisible');
				document.getElementById('box').appendChild(this.elemA);

				this.timer = window.setTimeout(apijs.dialog.htmlLinkReload.bind(this), 10000);

				// envoi du formulaire différé ou immédiat
				if (apijs.config.dialog.savingTime > 500) {

					this.timerbis = window.setTimeout(function () {
						if (document.getElementById('box') && (document.getElementById('box').nodeName.toLowerCase() === 'form')) {
							this.classNames = this.classNames.replace('lock', '');
							document.getElementById('box').submit();
						}
					}.bind(this), apijs.config.dialog.savingTime);
				}
				else {
					result = true;
				}
			}
		}

		// *** Dialogue d'upload ******************************** //
		else if (this.classNames.indexOf('upload') > -1) {

			if ((apijs.upload.extensions instanceof Array) && (apijs.upload.actionConfirm() === true)) {
				this.classNames += ' lock';
				result = true;
			}
			else if (!(apijs.upload.extensions instanceof Array) && apijs.config.debug) {
				this.dialogInformation(apijs.i18n.translate('debugInvalidUse'), '[pre]TheDialog » actionConfirm[br]➩ ' + apijs.i18n.translate('debugBadUse') + '[/pre]');
			}
		}

		return result;
	};


	// #### Action des touches du clavier ################ i18n ## debug ## event ## private ### //
	// = révision : 93
	// » Ferme le dialogue lors de l'appui sur la touche Échap sauf pour les dialogues d'attente et de progression ainsi que ceux ayant un verrou
	// » En mode diaporama demande l'affichage du média précédent ou suivant lors de l'appui sur les touches gauche ou droite
	// » En mode diaporama demande l'affichage du premier ou du dernier média lors de l'appui sur les touches début ou fin
	// » Bloque certaines touches du clavier et empèche la fermeture pour les dialogues ayant un verrou
	this.actionKey = function (ev) {

		var classNames = apijs.dialog.classNames.split(' ');

		if (apijs.config.debugkey) {
			ev.preventDefault();
			apijs.dialog.dialogInformation(apijs.i18n.translate('debugKeyDetected'), '[pre]TheDialog » actionKey[br]' + apijs.i18n.translate('debugKeyCode', ev.keyCode) + '[/pre]');
		}

		else if (in_array('slideshow', classNames)) {

			if (ev.keyCode === 27) {
				ev.preventDefault();
				apijs.dialog.actionClose(true);
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

		else if (in_array(['waiting', 'progress', 'lock'], classNames)) {
			// ctrl + q | ctrl + w | ctrl + r | ctrl + f4 | ctrl + f5
			// alt + f4
			// échap | f5
			if ((ev.ctrlKey && ((ev.keyCode === 81) || (ev.keyCode === 87) || (ev.keyCode === 82) || (ev.keyCode === 115) || (ev.keyCode === 116))) ||
			    (ev.altKey && (ev.keyCode === 115)) ||
			    (ev.keyCode === 27) || (ev.keyCode === 116))
				ev.preventDefault();
		}

		else if (ev.keyCode === 27) {
			ev.preventDefault();
			apijs.dialog.actionClose(true);
		}
	};

	this.actionCloseBrowser = function (ev) {

		var classNames = apijs.dialog.classNames.split(' ');

		if (apijs.config.debugkey) {
			ev.preventDefault();
			apijs.dialog.dialogInformation(apijs.i18n.translate('debugKeyDetected'), '[pre]TheDialog » actionCloseBrowser[br]' + apijs.i18n.translate('debugKeyCode', ev.keyCode) + '[/pre]');
		}

		if (in_array(['waiting', 'progress', 'lock'], classNames)) {
			ev.preventDefault();
			ev.stopPropagation();
			return '';
		}
	};


	// #### Action de redimensionnement de la fenêtre ##################### event ## private ### //
	// = révision : 9
	// » Redimensionne les dialogues photos et vidéos en fonction de la taille de la fenêtre
	// » S'assure de mettre à jour toutes les dimensions et de ne pas dépasser la taille de la photo/vidéo source
	this.actionResizeBrowser = function () {

		// *** Préparation ************************************** //
		var infoWindow = {}, infoMedia = {}, imageSize = apijs.dialog.imageSize;

		infoMedia.width = parseInt(document.getElementById('topho').getAttribute('width'), 10);
		infoMedia.height = parseInt(document.getElementById('topho').getAttribute('height'), 10);

		infoWindow.width = Math.round(window.innerWidth - window.innerWidth * apijs.config.dialog.margin / 100);
		infoWindow.height = Math.round(window.innerHeight - window.innerHeight * apijs.config.dialog.margin / 100);

		// *** Calcul des dimensions **************************** //
		// largeur de l'image supérieure/inférieure à la largeur de la fenêtre
		if ((infoMedia.width > infoWindow.width) || (infoMedia.width < infoWindow.width)) {

			infoMedia.width = infoWindow.width;
			infoMedia.height = Math.round(infoMedia.width / imageSize.ratio);

			if (infoMedia.height > infoWindow.height) {
				infoMedia.height = infoWindow.height;
				infoMedia.width = Math.round(infoMedia.height * imageSize.ratio);
			}
		}

		// hauteur de l'image supérieure/inférieure à la hauteur de la fenêtre
		else if ((infoMedia.height > infoWindow.height) || (infoMedia.height < infoWindow.height)) {

			infoMedia.height = infoWindow.height;
			infoMedia.width = Math.round(infoMedia.height * imageSize.ratio);

			if (infoMedia.width > infoWindow.width) {
				infoMedia.width = infoWindow.width;
				infoMedia.height = Math.round(infoMedia.width / imageSize.ratio);
			}
		}

		// *** Taille maximale ********************************** //
		if ((infoMedia.width > imageSize.width) || isNaN(infoMedia.width) || (infoMedia.width < 1)) {
			infoMedia.width = imageSize.width;
			infoMedia.height = imageSize.height;
		}
		else if ((infoMedia.height > imageSize.height) || isNaN(infoMedia.height) || (infoMedia.height < 1)) {
			infoMedia.width = imageSize.width;
			infoMedia.height = imageSize.height;
		}

		// *** Mise à jour du dialogue ************************** //
		document.getElementById('box').style.width = infoMedia.width + 'px';
		document.getElementById('box').style.marginLeft = Math.round(-(infoMedia.width + 20) / 2) + 'px';
		document.getElementById('box').style.marginTop  = Math.round(-(infoMedia.height + 66) / 2) + 'px';

		document.getElementById('topho').setAttribute('width', infoMedia.width);
		document.getElementById('topho').setAttribute('height', infoMedia.height);

		if (document.getElementById('topho').querySelector('div.bbcode'))
			document.getElementById('topho').querySelector('div.bbcode').style.height = infoMedia.height + 'px';
	};


	// #### Mise en pause de la vidéo ##################################### event ## private ### //
	// = révision : 8
	// » Met en pause la vidéo lorsque la page n'est plus visible (API page visibility)
	// » http://www.alsacreations.com/article/lire/1519-html-api-page-visibility.html
	this.actionPauseVideo = function () {

		var hidden;

		if (typeof document.hidden === 'boolean')
			hidden = document.hidden;
		else if (typeof document.mozHidden === 'boolean')
			hidden = document.mozHidden;
		else if (typeof document.msHidden === 'boolean')
			hidden = document.msHidden;
		else if (typeof document.webkitHidden === 'boolean')
			hidden = document.webkitHidden;

		if (hidden) {
			apijs.dialog.videoPlaying = !document.getElementById('topho').paused;
			document.getElementById('topho').pause();
		}
		else {
			if (apijs.dialog.videoPlaying)
				document.getElementById('topho').play();
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'INTERACTION ENTRE LE NAVIGATEUR ET LES DIALOGUES

	// #### Restriction de la navigation au clavier ####################### event ## private ### //
	// = révision : 10
	// » Empêche la navigation au clavier avec la touche tab de quitter la boite de dialogue
	// » http://www.w3schools.com/tags/att_global_tabindex.asp
	this.restrictNavigation = function (lock) {

		var tags = 'a,area,button,input,object,select,textarea,iframe', elems = document.querySelectorAll(tags), elem;

		if (lock) {
			for (elem = 0; elem < elems.length; elem++)
				elems[elem].setAttribute('tabindex', '-1');
		}
		else {
			for (elem = 0; elem < elems.length; elem++)
				elems[elem].removeAttribute('tabindex');
		}
	};


	// #### Recherche la taille idéale du dialogue ################################# private ### //
	// = révision : 38
	// » Vérifie si la largeur de la boite de dialogue ne dépassera pas la largeur de la fenêtre
	// » Vérifie si la hauteur de la boite de dialogue ne dépassera pas la hauteur de la fenêtre
	// » Adapte la taille du dialogue et de son contenu en conséquence
	this.updateWindowSize = function (width, height, url) {

		// *** Préparation des variables ************************ //
		var infoMedia = { width: width, height: height, id: url.slice((url.lastIndexOf('/') + 1), url.lastIndexOf('.')) },
		    infoWindow = { width: window.innerWidth, height: window.innerHeight };

		this.imageSize = { width: width, height: height, ratio: width/height };

		// *** Calcul des dimensions **************************** //
		if ((width >= Math.round(window.innerWidth - window.innerWidth * apijs.config.dialog.margin / 100)) ||
		    (height >= Math.round(window.innerHeight - window.innerHeight * apijs.config.dialog.margin / 100))) {

			infoWindow.width -= Math.round(window.innerWidth * apijs.config.dialog.margin / 100);
			infoWindow.height -= Math.round(window.innerHeight * apijs.config.dialog.margin / 100);

			// largeur de l'image supérieure à la largeur de la fenêtre
			if (infoMedia.width > infoWindow.width) {

				infoMedia.width = infoWindow.width;
				infoMedia.height = Math.round(infoMedia.width / this.imageSize.ratio);

				if (infoMedia.height > infoWindow.height) {
					infoMedia.height = infoWindow.height;
					infoMedia.width = Math.round(infoMedia.height * this.imageSize.ratio);
				}
			}

			// hauteur de l'image supérieure à la hauteur de la fenêtre
			else if (infoMedia.height > infoWindow.height) {

				infoMedia.height = infoWindow.height;
				infoMedia.width = Math.round(infoMedia.height * this.imageSize.ratio);

				if (infoMedia.width > infoWindow.width) {
					infoMedia.width = infoWindow.width;
					infoMedia.height = Math.round(infoMedia.width / this.imageSize.ratio);
				}
			}
		}

		// *** Mise à jour du futur dialogue ******************** //
		this.fragment.firstChild.firstChild.style.width = infoMedia.width + 'px';
		this.fragment.firstChild.firstChild.style.marginLeft = Math.round(-(infoMedia.width + 20) / 2) + 'px';
		this.fragment.firstChild.firstChild.style.marginTop  = Math.round(-(infoMedia.height + 66) / 2) + 'px';

		return infoMedia;
	};


	// #### Recherche le type mime du fichier ###################################### private ### //
	// = révision : 3
	// » Renvoie le type mime d'un fichier image ou vidéo
	this.searchMimeType = function (file) {

		var ext, types = {
			jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif', svg:'image/svg+xml',
			ogv:'video/ogg', webm:'video/webm', mp4:'video/mp4', m4v:'video/mp4'
		};

		ext = file.slice(file.lastIndexOf('.') + 1, (file.lastIndexOf('#') > 0) ? file.lastIndexOf('#') : file.length);
		return (types.hasOwnProperty(ext)) ? types[ext] : '';
	};


	// #### Chargement de la photo ################################################# private ### //
	// = révision : 15
	// » Définie l'attribut src de la balise img du dialogue photo
	// » Prend soin d'attendre le temps que la photo soit intégralement chargée avant de l'afficher
	this.loadImage = function (width, height, url) {

		if (apijs.config.navigator && apijs.config.dialog.showLoader) {

			this.image = new Image(width, height);
			this.image.src = url;

			// eventListener:load
			this.image.addEventListener('load', function () {
				if (document.getElementById('topho')) {
					document.getElementById('topho').removeAttribute('class');
					document.getElementById('topho').setAttribute('src', apijs.dialog.image.src);
				}
			}.bind(this), false);

			// eventListener:error
			this.image.addEventListener('error', function () {

				window.setTimeout(function () {
					if (document.getElementById('topho')) {

						// suppression des éléments a et span (photo redimensionnée)
						if (document.getElementById('topho').getAttribute('class').indexOf('resized') > -1) {
							var img = document.getElementById('topho').cloneNode(true);
							document.getElementById('topho').parentNode.parentNode.removeChild(document.getElementById('topho').parentNode);
							document.getElementById('box').firstChild.firstChild.appendChild(img);
						}

						// suppression du lien de téléchargement
						if (apijs.config.dialog.savePhoto)
							document.getElementById('box').firstChild.lastChild.removeChild(document.getElementById('box').firstChild.lastChild.lastChild);

						document.getElementById('topho').setAttribute('class', document.getElementById('topho').getAttribute('class').replace('loading', 'error') + ' ' + apijs.config.lang);
					}
				}, 750);
			}.bind(this), false);
		}
		else {
			document.getElementById('topho').removeAttribute('class');
			document.getElementById('topho').setAttribute('src', url);
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DES CONTENEURS PARENTS

	// #### Prépare le terrain ##################################################### private ### //
	// = révision : 81
	// » Supprime l'ancien dialogue
	// » Prend en compte la configuration de [TheSlideshow] si besoin
	// » Met en place l'écoute des touches du clavier
	this.setupDialog = function (type, icon) {

		// supprime l'ancien dialogue
		if (this.classNames !== null) {
			this.deleteDialog(false);
		}

		// active l'écoute des touches
		if (apijs.config.navigator) {

			document.addEventListener('keydown', apijs.dialog.actionKey, true);
			window.addEventListener('beforeunload', apijs.dialog.actionCloseBrowser, true);

			this.restrictNavigation(true);
		}

		// préparation du dialogue
		this.classNames = (typeof icon === 'string') ? (type + ' ' + icon) : type;
		this.fragment = document.createDocumentFragment();
	};


	// #### Affiche le dialogue #################################################### private ### //
	// = révision : 19
	// » Accroche le fragment DOM au document HTML
	// » Permet une transition lors de la mise en place d'un tout nouveau dialogue, donc lorsqu'il n'y en avait pas juste avant
	// » Afin de permettre les transitions CSS la modification de l'attribut class est différée dans le temps (1 milliseconde)
	this.showDialog = function () {

		var classNames = this.classNames.split(' ');

		// pas de transitions
		if (document.getElementById('dialog')) {
			this.fragment.firstChild.setAttribute('class', this.fragment.firstChild.getAttribute('class').replace('init', 'actif'));
			document.getElementById('dialog').appendChild(this.fragment.firstChild.firstChild);
		}
		// transitions non supportées
		else if (!apijs.config.transition || in_array('notransition', classNames)) {
			this.fragment.firstChild.setAttribute('class', this.fragment.firstChild.getAttribute('class').replace('init', 'actif'));
			document.body.appendChild(this.fragment);
		}
		// transitions supportées
		else {
			document.body.appendChild(this.fragment);
			window.setTimeout(function () {
				document.getElementById('dialog').setAttribute('class', document.getElementById('dialog').getAttribute('class').replace('init', 'actif'));
			}, 1);
		}

		// fermeture des popups au clic
		if (apijs.config.navigator) {

			if (apijs.config.dialog.closeOnClic && !in_array(['waiting', 'progress', 'lock'], classNames))
				document.addEventListener('click', apijs.dialog.actionCloseOnClic, false);

			// adapatation de la taille des photos et vidéos
			if (in_array(['photo','video'], classNames))
				window.addEventListener('resize', apijs.dialog.actionResizeBrowser, false);

			// mise en pause de la vidéo
			if (in_array('video', classNames)) {

				if (typeof document.hidden === 'boolean')
					document.addEventListener('visibilitychange', apijs.dialog.actionPauseVideo, false);
				else if (typeof document.mozHidden === 'boolean')
					document.addEventListener('mozvisibilitychange', apijs.dialog.actionPauseVideo, false);
				else if (typeof document.msHidden === 'boolean')
					document.addEventListener('msvisibilitychange', apijs.dialog.actionPauseVideo, false);
				else if (typeof document.webkitHidden === 'boolean')
					document.addEventListener('webkitvisibilitychange', apijs.dialog.actionPauseVideo, false);
			}
		}
	};


	// #### Supprime le dialogue ################################################### private ### //
	// = révision : 103
	// » Supprime totalement ou pas la boite de dialogue avec ou sans transitions
	// » Afin de permettre les transitions CSS la suppression totale est différée dans le temps
	// » Dégage le timer du lien différé et annule les gestionnaires d'événements du dialogue
	// » Pour terminer, réinitialise la plupart des variables
	this.deleteDialog = function (total) {

		var classNames = this.classNames.split(' '), video = document.getElementById('topho');

		// *** Prépare la suppression du dialogue *************** //
		if (this.timer)
			clearTimeout(this.timer);

		if (apijs.config.navigator) {

			document.removeEventListener('keydown', apijs.dialog.actionKey, true);
			window.removeEventListener('beforeunload', apijs.dialog.actionCloseBrowser, true);

			this.restrictNavigation(false);

			if (video && (typeof video.pause === 'function'))
				video.pause();

			// fermeture des popups au clic
			if (apijs.config.dialog.closeOnClic && !in_array(['waiting', 'progress', 'lock'], classNames))
				document.removeEventListener('click', apijs.dialog.actionCloseOnClic, false);

			// adapatation de la taille des photos et vidéos
			if (in_array(['photo','video'], classNames))
				window.removeEventListener('resize', apijs.dialog.actionResizeBrowser, false);

			// mise en pause de la vidéo
			if (in_array('video', classNames)) {

				if (typeof document.hidden === 'boolean')
					document.removeEventListener('visibilitychange', apijs.dialog.actionPauseVideo, false);
				else if (typeof document.mozHidden === 'boolean')
					document.removeEventListener('mozvisibilitychange', apijs.dialog.actionPauseVideo, false);
				else if (typeof document.msHidden === 'boolean')
					document.removeEventListener('msvisibilitychange', apijs.dialog.actionPauseVideo, false);
				else if (typeof document.webkitHidden === 'boolean')
					document.removeEventListener('webkitvisibilitychange', apijs.dialog.actionPauseVideo, false);
			}
		}

		// *** Supprime le dialogue ***************************** //
		if (total && (!apijs.config.transition || in_array('notransition', classNames))) {
			document.getElementById('dialog').parentNode.removeChild(document.getElementById('dialog'));
		}
		else if (total) {

			document.getElementById('dialog').setAttribute('class', document.getElementById('dialog').getAttribute('class').replace('actif', 'deleting'));

			if ((typeof document.getElementById('dialog').style.transitionDuration === 'string') ||
			    (typeof document.getElementById('dialog').style.MozTransitionDuration === 'string')) {
				document.getElementById('dialog').addEventListener('transitionend', function () {
					if (document.getElementById('dialog'))
						document.getElementById('dialog').parentNode.removeChild(document.getElementById('dialog'));
				}, false);
			}
			else if (typeof document.getElementById('dialog').style.OTransitionDuration === 'string') {
				document.getElementById('dialog').addEventListener('OTransitionEnd', function () {
					if (document.getElementById('dialog'))
						document.getElementById('dialog').parentNode.removeChild(document.getElementById('dialog'));
				}, false);
			}
			else if (typeof document.getElementById('dialog').style.webkitTransitionDuration === 'string') {
				document.getElementById('dialog').addEventListener('webkitTransitionEnd', function () {
					if (document.getElementById('dialog'))
						document.getElementById('dialog').parentNode.removeChild(document.getElementById('dialog'));
				}, false);
			}
		}
		else {
			document.getElementById('box').parentNode.removeChild(document.getElementById('box'));
		}

		// *** Réinitialise les variables *********************** //
		this.classNames = null;

		this.image = null;
		this.imageSize = null;
		this.videoPlaying = false;

		this.timer = null;

		this.fragment = null;
		this.elemA = null;
		this.elemB = null;
		this.elemC = null;
		this.elemD = null;
	};


	// #### Affiche le site ######################################################## private ### //
	// = révision : 96
	// » Supprime l'iframe du formulaire d'upload lorsque nécessaire
	// » Réinitialise les dernières variables
	this.showPage = function () {

		// supprime l'éventuelle iframe
		if (document.getElementById('iframeUpload'))
			document.getElementById('iframeUpload').parentNode.removeChild(document.getElementById('iframeUpload'));

		// réinitialise les variables
		if (this.timerbis)
			clearTimeout(this.timerbis);

		this.timerbis = null;
		this.callback = null;
		this.callbackParam = null;
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DU CONTENU DES BOITES DE DIALOGUE

	// #### Éléments parents ####################################################### private ### //
	// = révision : 75
	// » Crée le conteneur parent
	// » Crée le conteneur du contenu du dialogue (div ou form)
	// » Met en place le gestionnaire d'évènement du formulaire (eventListener:submit)
	// # <div class="init [slideshow {slideshow}]" id="dialog">
	// #  <div class="{this.classNames}" id="box"></div>
	// # </div>
	this.htmlParent = function (slideshow) {

		// *** Élément div (dialogue) *************************** //
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', (typeof slideshow === 'string') ? ('init ' + slideshow) : 'init');
		this.elemA.setAttribute('id', 'dialog');

		// *** Élément div (box) ******************************** //
		this.elemB = document.createElement('div');
		this.elemB.setAttribute('class', this.classNames);
		this.elemB.setAttribute('id', 'box');

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.appendChild(this.elemA);
	};

	// # <div class="init" id="dialog">
	// #  <form action="{action}" method="post" [enctype="{enctype}"] [target="{target}"]
	// #   onsubmit="return apijs.dialog.actionConfirm();" class="{this.classNames}" id="box"></form>
	// # </div>
	this.htmlFormParent = function (action, enctype, target) {

		// *** Élément div (dialogue) *************************** //
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', 'init');
		this.elemA.setAttribute('id', 'dialog');

		// *** Élément form (box) ******************************* //
		this.elemB = document.createElement('form');
		this.elemB.setAttribute('action', action);
		this.elemB.setAttribute('method', 'post');

		if (typeof enctype === 'string')
			this.elemB.setAttribute('enctype', enctype);

		if (typeof target === 'string')
			this.elemB.setAttribute('target', target);

		this.elemB.setAttribute('onsubmit', 'return apijs.dialog.actionConfirm();');
		this.elemB.setAttribute('class', this.classNames);
		this.elemB.setAttribute('id', 'box');

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.appendChild(this.elemA);
	};


	// #### Titre ################################################################## private ### //
	// = révision : 53
	// » Met en place le titre du dialogue
	// # <h1>{title}</h1>
	this.htmlTitle = function (title) {

		this.elemA = document.createElement('h1');
		this.elemA.appendChild(document.createTextNode(title));

		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};


	// #### Texte ################################################################## private ### //
	// = révision : 68
	// » Met en place le paragraphe du dialogue
	// » Prend en charge le bbcode grâce à [bbcode]
	// # <div>{data}</div>
	this.htmlText = function (data) {

		var bbcode = new apijs.core.bbcode();
		bbcode.init(data, apijs.config.dialog.emotes);

		this.fragment.firstChild.firstChild.appendChild(bbcode.getFragment());
	};


	// #### Bouton Ok ###################################################### i18n ## private ### //
	// = révision : 66
	// » Met en place le bouton ok du dialogue d'information
	// » Auto-focus différé sur le bouton ok
	// # <div class="control">
	// #  <button type="button" onclick="apijs.dialog.actionClose(true);" class="confirm">{i18n.buttonOk}</button>
	// # </div>
	this.htmlButtonOk = function () {

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', 'control');

			// Élément button (Ok)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('onclick', 'apijs.dialog.actionClose(true);');
			this.elemB.setAttribute('class', 'confirm');
			this.elemB.appendChild(document.createTextNode(apijs.i18n.translate('buttonOk')));

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};


	// #### Boutons Annuler/Valider ######################################## i18n ## private ### //
	// = révision : 86
	// » Met en place les boutons annuler et valider des dialogues de confirmation, d'options et d'upload
	// » Auto-focus différé sur le bouton valider du dialogue de confirmation ou sur le champ fichier du dialogue d'upload
	// # <div class="control">
	// #  <button type="button" class="cancel" onclick="apijs.dialog.actionClose(true);">{i18n.buttonCancel}</button>
	// #  <button type="{type}" class="confirm" [onclick="apijs.dialog.actionConfirm();"]>{i18n.buttonConfirm}</button>
	// # </div>
	this.htmlButtonConfirm = function (type) {

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', 'control');

			// Élément button (Valider)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', type);
			this.elemB.setAttribute('class', 'confirm');

			if (type !== 'submit')
				this.elemB.setAttribute('onclick', 'apijs.dialog.actionConfirm();');

			this.elemB.appendChild(document.createTextNode(apijs.i18n.translate('buttonConfirm')));

		this.elemA.appendChild(this.elemB);

			// Élément button (Annuler)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('class', 'cancel');
			this.elemB.setAttribute('onclick', 'apijs.dialog.actionClose(true);');
			this.elemB.appendChild(document.createTextNode(apijs.i18n.translate('buttonCancel')));

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};


	// #### Boutons Précédent/Suivant ###################################### i18n ## private ### //
	// = révision : 31
	// » Met en place les boutons précédent et suivant des dialogues photo et vidéo
	// » À savoir un bouton à gauche et un bouton à droite de la boite de dialogue
	// » Bouton au format image ou texte en fonction de la configuration
	// # <div class="navigation [txt|img]">
	// #  <button type="button" disabled="disabled" onclick="apijs.slideshow.actionPrev();" id="prev">
	// #    [<img src="{config.dialog.imagePrev.src}" width="{config.dialog.imagePrev.width}" height="{config.dialog.imagePrev.height}"
	// #     alt="{i18n.buttonPrev}" />][{i18n.buttonPrev}]
	// #  </button>
	// #  <button type="button" disabled="disabled" onclick="apijs.slideshow.actionNext();" id="next">
	// #    [<img src="{config.dialog.imageNext.src}" width="{config.dialog.imageNext.width}" height="{config.dialog.imageNext.height}"
	// #     alt="{i18n.buttonNext}" />][{i18n.buttonNext}]
	// #  </button>
	// # </div>
	this.htmlButtonNavigation = function () {

		var txtimg = ((apijs.config.dialog.imagePrev === null) || (apijs.config.dialog.imageNext === null)) ? true : false;

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', (txtimg) ? 'navigation txt' : 'navigation img');

			// *** Élément button (Précédent) ****************** //
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('disabled', 'disabled');
			this.elemB.setAttribute('onclick', 'apijs.slideshow.actionPrev();');
			this.elemB.setAttribute('id', 'prev');

			if (txtimg) {
				this.elemB.appendChild(document.createTextNode(apijs.i18n.translate('buttonPrev')));
			}
			else {
				// Élément img
				this.elemC = document.createElement('img');
				this.elemC.setAttribute('src', apijs.config.dialog.imagePrev.src);
				this.elemC.setAttribute('width', apijs.config.dialog.imagePrev.width);
				this.elemC.setAttribute('height', apijs.config.dialog.imagePrev.height);
				this.elemC.setAttribute('alt', apijs.i18n.translate('buttonPrev'));

				this.elemB.appendChild(this.elemC);
			}

		this.elemA.appendChild(this.elemB);

			// *** Élément button (Suivant) ******************** //
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('disabled', 'disabled');
			this.elemB.setAttribute('onclick', 'apijs.slideshow.actionNext();');
			this.elemB.setAttribute('id', 'next');

			if (txtimg) {
				this.elemB.appendChild(document.createTextNode(apijs.i18n.translate('buttonNext')));
			}
			else {
				// Élément img
				this.elemC = document.createElement('img');
				this.elemC.setAttribute('src', apijs.config.dialog.imageNext.src);
				this.elemC.setAttribute('width', apijs.config.dialog.imageNext.width);
				this.elemC.setAttribute('height', apijs.config.dialog.imageNext.height);
				this.elemC.setAttribute('alt', apijs.i18n.translate('buttonNext'));

				this.elemB.appendChild(this.elemC);
			}

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};


	// #### Bouton Fermer ################################################## i18n ## private ### //
	// = révision : 91
	// » Met en place le bouton fermer des dialogues photo et vidéo
	// » À savoir un bouton dans le coin en haut à droite de la boite de dialogue
	// » Bouton au format image ou texte en fonction de la configuration
	// # <div class="close [txt|img]">
	// #  <button type="button" onclick="apijs.dialog.actionClose(true);" class="close">
	// #    [<img src="{config.dialog.imageClose.src}" width="{config.dialog.imageClose.width}" height="{config.dialog.imageClose.height}"
	// #     alt="{i18n.buttonClose}" />][{i18n.buttonClose}]
	// #  </button>
	// # </div>
	this.htmlButtonClose = function () {

		var txtimg = (apijs.config.dialog.imageClose === null) ? true : false;

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', (txtimg) ? 'close txt' : 'close img');

			// Élément button (Fermer)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('onclick', 'apijs.dialog.actionClose(true);');
			this.elemB.setAttribute('class', 'close');

			if (txtimg) {
				this.elemB.appendChild(document.createTextNode(apijs.i18n.translate('buttonClose')));
			}
			else {
				// Élément img
				this.elemC = document.createElement('img');
				this.elemC.setAttribute('src', apijs.config.dialog.imageClose.src);
				this.elemC.setAttribute('width', apijs.config.dialog.imageClose.width);
				this.elemC.setAttribute('height', apijs.config.dialog.imageClose.height);
				this.elemC.setAttribute('alt', apijs.i18n.translate('buttonClose'));

				this.elemB.appendChild(this.elemC);
			}

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};


	// #### Lien différé ######################################## i18n ## timeout ## private ### //
	// = révision : 73
	// » Met en place le lien différé des dialogues de confirmation, d'options et d'attente
	// » Appel différé dans le temps comme son nom ne le suggère pas
	// # <p class="reload">{i18n.operationTooLong} <a href="{location.href}">{i18n.reloadLink}</a>.
	// # <br />{i18n.warningLostChange}</p>
	this.htmlLinkReload = function () {

		// Élément p
		this.elemA = document.createElement('p');
		this.elemA.setAttribute('class', 'reload');
		this.elemA.appendChild(document.createTextNode(apijs.i18n.translate('operationTooLong')));

			// Élément a (lien recharger)
			this.elemB = document.createElement('a');
			this.elemB.setAttribute('href', location.href);
			this.elemB.appendChild(document.createTextNode(apijs.i18n.translate('reloadLink')));

		this.elemA.appendChild(this.elemB);
		this.elemA.appendChild(document.createTextNode('.'));

			// Élément br
			this.elemB = document.createElement('br');

		this.elemA.appendChild(this.elemB);
		this.elemA.appendChild(document.createTextNode(apijs.i18n.translate('warningLostChange')));

		// mise à jour du document
		document.getElementById('box').appendChild(this.elemA);
	};


	// #### Formulaire d'envoi de fichier ########################################## private ### //
	// = révision : 143
	// » Met en place le contenu du formulaire du dialogue d'upload
	// » Composé d'un champ fichier et d'un champ caché pour l'extension APC de PHP ou pour PHP 5.4+
	// » Composé également d'une iframe qui sera détruite lors de l'affichage du site
	// » En profite par la même occasion pour pré-charger le graphique SVG du dialogue de progression
	// » Basculement automatique du focus entre le champ fichier et le bouton valider du formulaire
	// » À noter qu'il est obligatoire d'utiliser un nom d'iframe unique
	// # <iframe [src="{config.dialog.imageUpload.src}"] sandbox="allow-forms allow-same-origin"
	// #  name="iframeUpload.{uploadkey}" style="display:none;" id="iframeUpload" />
	// # <div>
	// #  <input type="hidden" name="UPLOAD_PROGRESS" value="{uploadkey}" />
	// #  <input type="file" name="{inputname}" onchange="document.getElementById('box').lastChild.firstChild.focus();" />
	// # </div>
	this.htmlFormUpload = function (inputname, uploadkey) {

		// *** Élément iframe *********************************** //
		this.elemA = document.createElement('iframe');

		if (apijs.config.navigator)
			this.elemA.setAttribute('src', apijs.config.dialog.imageUpload.src);

		this.elemA.setAttribute('sandbox', 'allow-forms allow-same-origin');
		this.elemA.setAttribute('name', 'iframeUpload.' + uploadkey);
		this.elemA.setAttribute('style', 'display:none;');
		this.elemA.setAttribute('id', 'iframeUpload');

		document.body.appendChild(this.elemA);

		// *** Élément div ************************************** //
		this.elemA = document.createElement('div');

			// Élément input (clef)
			this.elemB = document.createElement('input');
			this.elemB.setAttribute('type', 'hidden');
			this.elemB.setAttribute('name', 'UPLOAD_PROGRESS');
			this.elemB.setAttribute('value', uploadkey);

		this.elemA.appendChild(this.elemB);

			// Élément input (fichier)
			this.elemB = document.createElement('input');
			this.elemB.setAttribute('type', 'file');
			this.elemB.setAttribute('name', inputname);
			this.elemB.setAttribute('onchange', "document.getElementById('box').lastChild.firstChild.focus();");

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};


	// #### Barre de progression ################################################### private ### //
	// = révision : 56
	// » Met en place le graphique SVG du dialogue de progression
	// » Rien ne s'affiche lorsque le format SVG n'est pas géré par le navigateur ou lorsque le fichier est introuvable
	// # <object data="{config.dialog.imageUpload.src}" type="image/svg+xml"
	// #  width="{config.dialog.imageUpload.width}" height="{config.dialog.imageUpload.height}" id="progressbar" />
	this.htmlProgressBar = function () {

		// élément object
		if (apijs.config.navigator) {

			// Élément object (graphique SVG)
			this.elemA = document.createElement('object');
			this.elemA.setAttribute('data', apijs.config.dialog.imageUpload.src);
			this.elemA.setAttribute('type', 'image/svg+xml');
			this.elemA.setAttribute('width', apijs.config.dialog.imageUpload.width);
			this.elemA.setAttribute('height', apijs.config.dialog.imageUpload.height);
			this.elemA.setAttribute('id', 'progressbar');

			// sauvegarde de l'élément
			this.fragment.firstChild.firstChild.appendChild(this.elemA);
		}

		// élément embed
		// requiert l'extension SVG Viewer http://www.adobe.com/svg/viewer/install
		// page de test http://granite.sru.edu/~ddailey/svg/TestObject.html
		else if (!apijs.config.navigator) {

			// Élément object (graphique SVG)
			this.elemA = document.createElement('embed');
			this.elemA.setAttribute('src', apijs.config.dialog.imageUpload.src);
			this.elemA.setAttribute('type', 'image/svg+xml');
			this.elemA.setAttribute('wmode', 'transparent');
			this.elemA.setAttribute('width', apijs.config.dialog.imageUpload.width);
			this.elemA.setAttribute('height', apijs.config.dialog.imageUpload.height);
			this.elemA.setAttribute('id', 'progressbar');

			// sauvegarde de l'élément
			this.fragment.firstChild.firstChild.appendChild(this.elemA);
		}
	};


	// #### Photo et légende ############################################### i18n ## private ### //
	// = révision : 147
	// » Met en place la photo et la légende du dialogue photo
	// » Redimensionne la photo en fonction de la taille de la fenêtre lorsque nécessaire
	// » Affiche une icône au survol si la photo est redimensionnée lors de son affichage et si la configuration le permet
	// » Affiche un lien pour télécharger la photo si la configuration le permet
	// # <dl>
	// #  <dt>
	// #    [<a href="{url}" onclick="window.open(this.href); this.blur(); return false;">]
	// #      <img width="{media.width}" height="{media.height}" alt="" class="loading [svg] [resized]" id="topho" />
	// #      [<span />]
	// #    [</a>]
	// #  </dt>
	// #  <dd>
	// #    [<span>{media.id/name} ({date})</span>] {legend}
	// #    [<a href="{config.dialog.filePhoto}?id={media.id}" type="{mimetype}" class="download">{i18n.downloadLink}</a>]
	// #  </dd>
	// # </dl>
	this.htmlPhoto = function (width, height, url, name, date, legend) {

		var media = this.updateWindowSize(width, height, url);

		// Élément dl
		this.elemA = document.createElement('dl');

			// *** Élément dt (terme) ************************** //
			this.elemB = document.createElement('dt');

				// Éléments a img span (photo redimensionnée)
				// # <a href="{url}" onclick="window.open(this.href); this.blur(); return false;">
				// #  <img width="{media.width}" height="{media.height}" alt="" class="loading [svg] resized" id="topho" />
				// #  <span />
				// # </a>
				if (apijs.config.dialog.showFullsize && ((media.width !== width) || (media.height !== height))) {

					this.elemC = document.createElement('a');
					this.elemC.setAttribute('href', url);
					this.elemC.setAttribute('onclick', 'window.open(this.href); this.blur(); return false;');

						this.elemD = document.createElement('img');
						this.elemD.setAttribute('width', media.width);
						this.elemD.setAttribute('height', media.height);
						this.elemD.setAttribute('alt', '');

						if (document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'))
							this.elemD.setAttribute('class', 'loading svg resized');
						else
							this.elemD.setAttribute('class', 'loading resized');

						this.elemD.setAttribute('id', 'topho');

					this.elemC.appendChild(this.elemD);
					this.elemC.appendChild(document.createElement('span'));
				}
				// Élément img
				// # <img width="{media.width}" height="{media.height}" alt="" class="loading [svg]" id="topho" />
				else {
					this.elemC = document.createElement('img');
					this.elemC.setAttribute('width', media.width);
					this.elemC.setAttribute('height', media.height);
					this.elemC.setAttribute('alt', '');

					if (document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1'))
						this.elemC.setAttribute('class', 'loading svg');
					else
						this.elemC.setAttribute('class', 'loading');

					this.elemC.setAttribute('id', 'topho');
				}

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

			// *** Élément dd (définition) ********************* //
			this.elemB = document.createElement('dd');

				// Élément span
				// # <span>{media.id/name} ({date})</span>
				if ((name !== 'false') || (date !== 'false')) {

					this.elemC = document.createElement('span');

					// name + date
					if ((name !== 'false') && (name !== 'auto') && (date !== 'false'))
						this.elemC.appendChild(document.createTextNode(name + ' (' + date + ')'));

					// name
					else if ((name !== 'false') && (name !== 'auto'))
						this.elemC.appendChild(document.createTextNode(name));

					// auto name + date
					else if ((name === 'auto') && (date !== 'false'))
						this.elemC.appendChild(document.createTextNode(media.id + ' (' + date + ')'));

					// auto name
					else if (name === 'auto')
						this.elemC.appendChild(document.createTextNode(media.id));

					// date
					else if (date !== 'false')
						this.elemC.appendChild(document.createTextNode('(' + date + ')'));

					this.elemB.appendChild(this.elemC);
				}

				// Nœud texte
				// # {legend}
				this.elemB.appendChild(document.createTextNode(' ' + legend + ' '));

				// Élément a (lien télécharger)
				// # <a href="{config.dialog.filePhoto}?id={media.id}" type="{mimetype}" class="download">{i18n.downloadLink}</a>
				if (apijs.config.dialog.savePhoto) {

					this.elemC = document.createElement('a');
					this.elemC.setAttribute('href', apijs.config.dialog.filePhoto + '?id=' + media.id);
					this.elemC.setAttribute('type', this.searchMimeType(url));
					this.elemC.setAttribute('class', 'download');
					this.elemC.appendChild(document.createTextNode(apijs.i18n.translate('downloadLink')));

					this.elemB.appendChild(this.elemC);
				}

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};


	// #### Vidéo et légende ############################################### i18n ## private ### //
	// = révision : 91
	// » Met en place la vidéo et la légende du dialogue vidéo
	// » Redimensionne la vidéo en fonction de la taille de la fenêtre lorsque nécessaire
	// » Un message d'information remplace la vidéo lorsque la balise vidéo du langage HTML 5 n'est pas gérée par le navigateur
	// » Affiche un lien pour télécharger la vidéo si la configuration le permet
	// # <dl>
	// #  <dt>
	// #    <video width="{media.width}" height="{media.height}" controls="controls" [autoplay="autoplay"] id="topho">
	// #      <source src="{url}" type="{mimetype}" />
	// #      [{i18n.browserNoVideo}]
	// #    </video>
	// #  </dt>
	// #  <dd>
	// #    [<span>{media.id/name} ({date})</span>] {legend}
	// #    [<a href="{config.dialog.fileVideo}?id={media.id}" type="{mimetype}" class="download">{i18n.downloadLink}</a>]
	// #  </dd>
	// # </dl>
	this.htmlVideo = function (url, name, date, legend) {

		var i, multiple, noVideo, mimetype = this.searchMimeType(url),
		    media = this.updateWindowSize(apijs.config.dialog.videoWidth, apijs.config.dialog.videoHeight, url);

		// Élément dl
		this.elemA = document.createElement('dl');

			// *** Élément dt (terme) ************************** //
			this.elemB = document.createElement('dt');

				// Élément video
				this.elemC = document.createElement('video');
				this.elemC.setAttribute('width', media.width);
				this.elemC.setAttribute('height', media.height);
				this.elemC.setAttribute('controls', 'controls');

				if (apijs.config.dialog.videoAutoplay)
					this.elemC.setAttribute('autoplay', 'autoplay');

				this.elemC.setAttribute('id', 'topho');

				if (url.indexOf('#') > 0) {

					multiple = url.slice(url.indexOf('#') + 1);
					multiple = multiple.split(',');
					multiple.unshift(url.slice(url.lastIndexOf('.') + 1, url.lastIndexOf('#')));

					for (i = 0; i < multiple.length; i++) {
						this.elemD = document.createElement('source');
						this.elemD.setAttribute('src', url.slice(0, url.lastIndexOf('.')) + '.' + multiple[i]);
						this.elemD.setAttribute('type', this.searchMimeType(multiple[i]));
						this.elemC.appendChild(this.elemD);
					}
				}
				else {
					this.elemD = document.createElement('source');
					this.elemD.setAttribute('src', url);
					this.elemD.setAttribute('type', mimetype);
					this.elemC.appendChild(this.elemD);
				}

				// Navigateurs obsolètes ou ne gérant pas le codec
				if (typeof this.elemC.pause !== 'function') {

					noVideo = new apijs.core.bbcode();
					noVideo.init(apijs.i18n.translate('browserNoVideo', BrowserDetect.browser, BrowserDetect.version, mimetype, navigator.userAgent));
					noVideo = noVideo.getFragment();
					noVideo.firstChild.setAttribute('style', 'height:' + media.height + 'px');

					this.elemC.appendChild(noVideo);
				}

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

			// *** Élément dd (définition) ********************* //
			this.elemB = document.createElement('dd');

				// Élément span
				// # <span>{media.id/name} ({date})</span>
				if ((name !== 'false') || (date !== 'false')) {

					this.elemC = document.createElement('span');

					// name + date
					if ((name !== 'false') && (name !== 'auto') && (date !== 'false'))
						this.elemC.appendChild(document.createTextNode(name + ' (' + date + ')'));

					// name
					else if ((name !== 'false') && (name !== 'auto'))
						this.elemC.appendChild(document.createTextNode(name));

					// auto name + date
					else if ((name === 'auto') && (date !== 'false'))
						this.elemC.appendChild(document.createTextNode(media.id + ' (' + date + ')'));

					// auto name
					else if (name === 'auto')
						this.elemC.appendChild(document.createTextNode(media.id));

					// date
					else if (date !== 'false')
						this.elemC.appendChild(document.createTextNode('(' + date + ')'));

					this.elemB.appendChild(this.elemC);
				}

				// Nœud texte
				// # {legend}
				this.elemB.appendChild(document.createTextNode(' ' + legend + ' '));

				// Élément a (lien télécharger)
				// # <a href="{config.dialog.fileVideo}?id={media.id}" type="{mimetype}" class="download">{i18n.downloadLink}</a>
				if (apijs.config.dialog.saveVideo) {

					this.elemC = document.createElement('a');
					this.elemC.setAttribute('href', apijs.config.dialog.fileVideo + '?id=' + media.id);
					this.elemC.setAttribute('type', mimetype);
					this.elemC.setAttribute('class', 'download');
					this.elemC.appendChild(document.createTextNode(apijs.i18n.translate('downloadLink')));

					this.elemB.appendChild(this.elemC);
				}

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};
};