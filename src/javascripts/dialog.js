/**
 * Created D/12/04/2009
 * Updated J/24/05/2012
 * Version 122
 *
 * Copyright 2008-2012 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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
	this.offset = 0;
	this.hiddenPage = false;
	this.dialogType = null;

	this.image = null;
	this.timer = null;
	this.timerbis = null;
	this.callback = null;
	this.params = null;

	this.fragment = null;
	this.elemA = null;
	this.elemB = null;
	this.elemC = null;
	this.elemD = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES BOITES DE DIALOGUE (8)

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
	// = révision : 84
	// » Permet de demander une confirmation à l'utilisateur
	// » Composé d'un titre, d'un paragraphe et de deux boutons de dialogue
	// » Par la suite peut également être composé d'un lien différé de 10 secondes
	// » Fermeture par bouton Annuler ou touche Échap tant que le dialogue n'est pas validé
	// » Appel la fonction callback après la validation du dialogue
	// » Auto-focus sur le bouton Valider
	this.dialogConfirmation = function (title, text, callback, params, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof callback === 'function') && (typeof params !== 'undefined')) {

			this.setupDialog('confirmation', icon);

			this.htmlParent(false);
			this.htmlTitle(title);
			this.htmlText(text);
			this.htmlButtonConfirm('button');

			this.callback = callback;
			this.params = params;

			this.showDialog();
			document.getElementById('box').lastChild.firstChild.focus();
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogConfirmation[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (function) callback : ' + callback + '[br]➩ (object) params : ' + params + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue d'options ##################################### i18n ## debug ## public ### //
	// = révision : 18
	// » Permet à l'utilisateur de modifier des options
	// » Composé d'un formulaire, d'un titre, d'un paragraphe et de deux boutons de dialogue
	// » Par la suite peut également être composé d'un lien différé de 10 secondes
	// » Validation du formulaire uniquement si la fonction callback renvoie true
	// » Fermeture par bouton Annuler ou touche Échap tant que le formulaire n'est pas validé
	this.dialogFormOptions = function (title, text, callback, params, action, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof callback === 'function') && (typeof params !== 'undefined') && (typeof action === 'string')) {

			this.setupDialog('options', icon);

			this.htmlFormParent(action);
			this.htmlTitle(title);
			this.htmlText(text);
			this.htmlButtonConfirm('submit');

			this.callback = callback;
			this.params = params;

			this.showDialog();
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogFormOptions[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (function) callback : ' + callback + '[br]➩ (object) params : ' + params + '[br]➩ (string) action : ' + action + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue d'upload ###################################### i18n ## debug ## public ### //
	// = révision : 87
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Composé d'un formulaire, d'un titre, d'un paragraphe, d'un champ fichier et de deux boutons de dialogue
	// » Fermeture par bouton Annuler ou touche Échap tant que le formulaire n'est pas validé
	// » Auto-focus sur le champ fichier
	this.dialogFormUpload = function (title, text, data, key, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof key === 'string') && (typeof data === 'string')) {

			this.setupDialog('upload', icon);

			this.htmlFormParent(apijs.config.dialog.fileUpload, 'multipart/form-data', 'iframeUpload.' + key);
			this.htmlTitle(title);
			this.htmlText(text);
			this.htmlFormUpload(data, key);
			this.htmlButtonConfirm('submit');

			this.showDialog();
			//document.getElementById('box').getElementsByTagName('input')[1].focus(); (ne fonctionne plus à partir de Firefox 4)
			window.setTimeout(function () { document.getElementById('box').getElementsByTagName('input')[1].focus(); }, 10);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogFormUpload[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (string) data : ' + data + '[br]➩ (string) key : ' + key + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue de progression ################################ i18n ## debug ## public ### //
	// = révision : 93
	// » Permet de faire patienter l'utilisateur en affichant une barre de progression
	// » Composé d'un titre, d'un paragraphe et d'une barre de progression
	// » Fermeture automatique ou pas et touche Échap désactivée
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
	// = révision : 80
	// » Permet de faire patienter l'utilisateur en affichant un message d'attente
	// » Composé d'un titre, d'un paragraphe et d'un lien différé de 10 secondes ou plus si time est un nombre et si nolink est différent de false
	// » Fermeture automatique ou pas et touche Échap désactivée
	this.dialogWaiting = function (title, text, time, nolink, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.setupDialog('waiting', icon);

			this.htmlParent(false);
			this.htmlTitle(title);
			this.htmlText(text);

			this.showDialog();

			if (nolink !== false)
				this.timer = window.setTimeout(apijs.dialog.htmlLinkReload, (typeof time === 'number') ? time : 10000);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			this.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheDialog » dialogWaiting[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (number) time : ' + time + '[br]➩ (boolean) nolink : ' + nolink + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue photo ######################################### i18n ## debug ## public ### //
	// = révision : 115
	// » Permet d'afficher une photo en plein écran au premier plan
	// » Composé d'une photo, d'une définition et de trois boutons de dialogue
	// » Fermeture par bouton Fermer ou touche Échap
	this.dialogPhoto = function (width, height, url, name, date, legend, slideshow) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof width === 'number') && (typeof height === 'number') && (typeof url === 'string') && (typeof name === 'string') && (typeof date === 'string') && (typeof legend === 'string')) {

			if ((typeof slideshow === 'boolean') && (slideshow === true)) {
				this.setupDialog('photo slideshow');
				this.htmlParent(true);
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
	// = révision : 74
	// » Permet d'afficher une vidéo en plein écran au premier plan
	// » Composé d'une vidéo, d'une définition et de trois boutons de dialogue
	// » Fermeture par bouton Fermer ou touche Échap
	this.dialogVideo = function (url, name, date, legend, slideshow) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof url === 'string') && (typeof name === 'string') && (typeof legend === 'string') && (typeof legend === 'string')) {

			if ((typeof slideshow === 'boolean') && (slideshow === true)) {
				this.setupDialog('video slideshow');
				this.htmlParent(true);
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
	// DÉFINITION DES ACTIONS DES BOUTONS ET DES TOUCHES DU CLAVIER (3)

	// #### Action de fermeture ############################################ event ## public ### //
	// = révision : 42
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
	// = révision : 5
	// » Supprime la boite de dialogue lors d'un clic
	// » Affiche le site internet sur demande
	this.actionCloseOnClic = function (ev) {

		if ((ev.target.getAttribute('id') === 'dialog') && !in_array(apijs.dialog.dialogType.split(' '), ['waiting', 'progress', 'lock'])) {
			apijs.dialog.deleteDialog(true);
			apijs.dialog.showPage();
		}
	};


	// #### Action du bouton Valider ##################### i18n ## debug ## event ## private ### //
	// = révision : 115
	// » Désactive l'action de la touche Échap
	// » Pour le dialogue de confirmation appel la fonction de rappel (appel différé d'au moins 500 millisecondes)
	// » Pour le dialogue d'options appel la fonction de rappel avant de soumettre le formulaire (envoi différé d'au moins 500 millisecondes)
	// » Pour le dialogue d'upload appel la fonction actionConfirm de [TheUpload]
	this.actionConfirm = function () {

		var result = false;

		// *** Dialogue de confirmation ************************* //
		if (this.dialogType.indexOf('confirmation') > -1) {

			this.dialogType += ' lock';

			// gestion du dialogue (validation dans tous les cas)
			if (!apijs.config.dialog.savingDialog) {

				this.elemA = document.createElement('p');
				this.elemA.setAttribute('class', 'saving');
				this.elemA.appendChild(document.createTextNode(apijs.i18n.translate('operationInProgress')));

				document.getElementById('box').removeChild(document.getElementById('box').lastChild);
				document.getElementById('box').lastChild.setAttribute('class', 'novisible');
				document.getElementById('box').appendChild(this.elemA);

				this.timer = window.setTimeout(apijs.dialog.htmlLinkReload, 10000);
			}
			else {
				this.dialogWaiting(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('operationInProgress'), true, true, this.dialogType.replace(/confirmation | lock/g, ''));
			}

			// fonction de rappel différée ou immédiate
			if (apijs.config.dialog.savingTime > 500) {

				this.timerbis = window.setTimeout(function () {
					if (typeof apijs.dialog.callback === 'function')
						apijs.dialog.callback(apijs.dialog.params);
				}, apijs.config.dialog.savingTime);
			}
			else {
				apijs.dialog.callback(apijs.dialog.params);
			}

			result = true;
		}

		// *** Dialogue d'options ******************************* //
		else if (this.dialogType.indexOf('options') > -1) {

			if (apijs.dialog.callback(apijs.dialog.clone(apijs.dialog.params)) === true) {

				// gestion du dialogue (en cas de validation)
				this.dialogType += ' lock';

				this.elemA = document.createElement('p');
				this.elemA.setAttribute('class', 'saving');
				this.elemA.appendChild(document.createTextNode(apijs.i18n.translate('operationInProgress')));

				document.getElementById('box').removeChild(document.getElementById('box').lastChild);
				document.getElementById('box').lastChild.setAttribute('class', 'novisible');
				document.getElementById('box').appendChild(this.elemA);

				this.timer = window.setTimeout(apijs.dialog.htmlLinkReload, 10000);

				// envoi du formulaire différé ou immédiat
				if (apijs.config.dialog.savingTime > 500) {

					this.timerbis = window.setTimeout(function () {
						if (document.getElementById('box') && (document.getElementById('box').nodeName.toLowerCase() === 'form'))
							document.getElementById('box').submit();
					}, apijs.config.dialog.savingTime);
				}
				else {
					result = true;
				}
			}
		}

		// *** Dialogue d'upload ******************************** //
		else if (this.dialogType.indexOf('upload') > -1) {

			// gestion du formulaire (validation ou pas)
			if (typeof apijs.core.upload === 'function') {

				if (apijs.upload.actionConfirm() === true) {
					this.dialogType += ' lock';
					result = true;
				}
			}

			// message de debug
			else if (apijs.config.debug) {
				this.dialogInformation(apijs.i18n.translate('debugInvalidUse'), '[pre]TheDialog » actionConfirm[br]➩ TheUpload ' + apijs.i18n.translate('debugNotExist') + '[/pre]');
			}
		}

		return result;
	};


	// #### Action des touches du clavier ################ i18n ## debug ## event ## private ### //
	// = révision : 86
	// » Ferme le dialogue lors de l'appui sur la touche Échap sauf pour les dialogues d'attente et de progression ainsi que ceux ayant un verrou
	// » En mode diaporama demande l'affichage du média précédent ou suivant lors de l'appui sur les touches gauche ou droite
	// » En mode diaporama demande l'affichage du premier ou du dernier média lors de l'appui sur les touches début ou fin
	// » Bloque toutes les touches (sauf les flèches, F6 et F11) du clavier pour les dialogues ayant un verrou
	this.actionKey = function (ev) {

		var type = apijs.dialog.dialogType;

		if (apijs.config.debugkey) {
			ev.preventDefault();
			apijs.dialog.dialogInformation(apijs.i18n.translate('debugKeyDetected'), '[pre]TheDialog » actionKey[br]' + apijs.i18n.translate('debugKeyCode', ev.keyCode) + '[/pre]');
		}

		else if (type.indexOf('slideshow') > -1) {

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

		else if (in_array(type.split(' '), ['waiting', 'progress', 'lock']) && !in_array(ev.keyCode, [37, 38, 39, 40, 117, 122])) {
			ev.preventDefault();
		}

		else if (ev.keyCode === 27) {
			ev.preventDefault();
			apijs.dialog.actionClose(true);
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DES CONTENEURS PARENTS (8)

	// #### Prépare le terrain ##################################################### private ### //
	// = révision : 73
	// » Supprime l'ancien dialogue puis cache ou affiche le site lorsque nécessaire
	// » Prend en compte la configuration de [TheSlideshow] si besoin
	// » Met en place l'écoute des touches du clavier (eventListener:keydown)
	this.setupDialog = function (type, icon) {

		// *** Gestion de l'ancien dialogue ********************* //
		var actionHidden = false, actionShow = false, id = null;

		// ancien dialogue
		if (this.dialogType !== null) {

			// ancien dialogue de TheSlideshow
			if (this.dialogType.indexOf('slideshow') > -1) {

				// nouveau dialogue de TheSlideshow
				// cas impossible car il y a eut une demande de fermeture (de TheSlideshow)

				// nouveau dialogue de TheDialog
					// site affiché / site à cacher
					if (!this.hiddenPage && apijs.config.dialog.hiddenPage)
						actionHidden = true;

					// site caché / site à afficher
					else if (this.hiddenPage && !apijs.config.dialog.hiddenPage)
						actionShow = true;
			}
			// ancien dialogue de TheDialog
			else {
				// site affiché / site à cacher
				if (!this.hiddenPage && apijs.config.dialog.hiddenPage)
					actionHidden = true;

				// site caché / site à afficher
				else if (this.hiddenPage && !apijs.config.dialog.hiddenPage)
					actionShow = true;
			}
		}
		// pas d'ancien dialogue
		else {
			// nouveau dialogue de TheSlideshow
			if (type.indexOf('slideshow') > -1) {

				// site affiché / site à cacher
				if (!this.hiddenPage && apijs.config.slideshow.hiddenPage)
					actionHidden = true;
			}
			// nouveau dialogue de TheDialog
			else {
				// site affiché / site à cacher
				if (!this.hiddenPage && apijs.config.dialog.hiddenPage)
					actionHidden = true;
			}
		}

		// *** Supprime l'ancien dialogue *********************** //
		if ((this.dialogType !== null) && (this.dialogType.indexOf('slideshow') > -1)) {
			this.deleteDialog(false);
			document.getElementById('dialog').setAttribute('class', document.getElementById('dialog').getAttribute('class').replace(' slideshow', ''));
		}
		else if (this.dialogType !== null) {
			this.deleteDialog(false);
		}

		// *** Cache ou affiche le site ************************* //
		if (actionHidden) {

			if ((window.pageYOffset > 0) || (this.offset > 0))
				this.offset = window.pageYOffset;

			for (id in apijs.config.dialog.blocks) if (apijs.config.dialog.blocks.hasOwnProperty(id))
				document.getElementById(apijs.config.dialog.blocks[id]).setAttribute('class', 'nodisplay');
		}
		else if (actionShow) {
			this.showPage();
		}

		// *** Active l'écoute des touches ********************** //
		if (apijs.config.navigator)
			document.addEventListener('keydown', apijs.dialog.actionKey, false);

		// *** Préparation du dialogue ************************** //
		this.dialogType = (typeof icon !== 'string') ? type : (type + ' ' + icon);
		this.hiddenPage = (actionHidden || this.hiddenPage) ? true : false;

		this.fragment = document.createDocumentFragment();
	};


	// #### Affiche le dialogue #################################################### private ### //
	// = révision : 9
	// » Accroche le fragment DOM au document HTML
	// » Permet une transition lors de la mise en place d'un tout nouveau dialogue, donc lorsqu'il n'y en avait pas juste avant
	// » Afin de permettre les transitions CSS la modification de l'attribut class est différée dans le temps (1 milliseconde)
	this.showDialog = function () {

		// *** Pas de transitions ******************************* //
		if (document.getElementById('dialog')) {
			this.fragment.firstChild.setAttribute('class', this.fragment.firstChild.getAttribute('class').replace('init', 'actif'));
			document.getElementById('dialog').appendChild(this.fragment.firstChild.firstChild);
		}

		// *** Transitions non supportées *********************** //
		else if (!apijs.config.transition) {
			this.fragment.firstChild.setAttribute('class', this.fragment.firstChild.getAttribute('class').replace('init', 'actif'));
			document.getElementsByTagName('body')[0].appendChild(this.fragment);
		}

		// *** Transitions supportées *************************** //
		else {
			document.getElementsByTagName('body')[0].appendChild(this.fragment);
			window.setTimeout(function () { document.getElementById('dialog').setAttribute('class', document.getElementById('dialog').getAttribute('class').replace('init', 'actif')); }, 1);
		}

		// *** Fermeture des popups au clic ********************* //
		if (apijs.config.navigator && apijs.config.dialog.closeOnClic && !in_array(apijs.dialog.dialogType.split(' '), ['waiting', 'progress', 'lock'])) {
			document.addEventListener('click', apijs.dialog.actionCloseOnClic, false);
		}
	};


	// #### Supprime le dialogue ################################################### private ### //
	// = révision : 83
	// » Dégage le timer du lien différé
	// » Annule l'écoute des touches du clavier (eventListener:keydown)
	// » Supprime totalement ou pas la boite de dialogue avec ou sans transitions
	// » Afin de permettre les transitions CSS la suppression totale est différée dans le temps (eventListener:transitionEnd)
	// » Réinitialise la plupart des variables
	this.deleteDialog = function (total) {

		// *** Prépare la suppression du dialogue *************** //
		if (this.timer)
			clearTimeout(this.timer);

		if (apijs.config.navigator)
			document.removeEventListener('keydown', apijs.dialog.actionKey, false);

		if (apijs.config.navigator && (document.getElementById('dialog').getElementsByTagName('video').length > 0)) {
			if (typeof document.getElementById('dialog').getElementsByTagName('video')[0].pause === 'function')
				document.getElementById('dialog').getElementsByTagName('video')[0].pause();
		}

		// *** Supprime le dialogue ***************************** //
		if (apijs.config.transition && total) {

			if (apijs.config.dialog.closeOnClic && !in_array(apijs.dialog.dialogType.split(' '), ['waiting', 'progress', 'lock']))
				document.removeEventListener('click', apijs.dialog.actionCloseOnClic, false);

			document.getElementById('dialog').setAttribute('class', document.getElementById('dialog').getAttribute('class').replace('actif', 'deleting lock'));

			if (typeof document.getElementById('dialog').style.transitionDuration === 'string')
				document.getElementById('dialog').addEventListener('transitionEnd', function () {
					if (document.getElementById('dialog'))
						document.getElementById('dialog').parentNode.removeChild(document.getElementById('dialog'));
				}, false);

			else if (typeof document.getElementById('dialog').style.OTransitionDuration === 'string')
				document.getElementById('dialog').addEventListener('OTransitionEnd', function () {
					if (document.getElementById('dialog'))
						document.getElementById('dialog').parentNode.removeChild(document.getElementById('dialog'));
				}, false);

			else if (typeof document.getElementById('dialog').style.MozTransitionDuration === 'string')
				document.getElementById('dialog').addEventListener('transitionend', function () {
					if (document.getElementById('dialog'))
						document.getElementById('dialog').parentNode.removeChild(document.getElementById('dialog'));
				}, false);

			else if (typeof document.getElementById('dialog').style.webkitTransitionDuration === 'string')
				document.getElementById('dialog').addEventListener('webkitTransitionEnd', function () {
					if (document.getElementById('dialog'))
						document.getElementById('dialog').parentNode.removeChild(document.getElementById('dialog'));
				}, false);
		}
		else if (total) {

			if (apijs.config.navigator && apijs.config.dialog.closeOnClic && !in_array(apijs.dialog.dialogType.split(' '), ['waiting', 'progress', 'lock']))
				document.removeEventListener('click', apijs.dialog.actionCloseOnClic, false);

			document.getElementById('dialog').parentNode.removeChild(document.getElementById('dialog'));
		}
		else {
			document.getElementById('box').parentNode.removeChild(document.getElementById('box'));
		}

		// *** Réinitialise les variables *********************** //
		this.dialogType = null;

		this.image = null;
		this.timer = null;

		this.fragment = null;
		this.elemA = null;
		this.elemB = null;
		this.elemC = null;
		this.elemD = null;
	};


	// #### Affiche le site ######################################################## private ### //
	// = révision : 91
	// » Supprime l'iframe du formulaire d'upload lorsque nécessaire
	// » Affiche le site au bon endroit si celui-ci est caché
	// » Réinitialise les dernières variables
	this.showPage = function () {

		// *** Supprime l'éventuelle iframe ********************* //
		if (document.getElementById('iframeUpload'))
			document.getElementById('iframeUpload').parentNode.removeChild(document.getElementById('iframeUpload'));

		// *** Affiche le site internet ************************* //
		if (this.hiddenPage) {

			for (var id in apijs.config.dialog.blocks) if (apijs.config.dialog.blocks.hasOwnProperty(id))
				document.getElementById(apijs.config.dialog.blocks[id]).removeAttribute('class');

			window.scrollBy(0, this.offset);
		}

		// *** Réinitialise les variables *********************** //
		this.offset = 0;
		this.hiddenPage = false;

		if (this.timerbis)
			clearTimeout(this.timerbis);

		this.timerbis = null;
		this.callback = null;
		this.params = null;
	};


	// #### Vérifie la taille de la fenêtre ######################################## private ### //
	// = révision : 14
	// » Vérifie si les dialogues photo ou vidéo peuvent être affichés sans redimensionnement
	// » Renvoie true si la photo ou vidéo doit être redimensionnée et false s'il n'y a rien à faire
	this.checkSize = function (width, height) {

		if ((width > (window.innerWidth - 150)) || (height > (window.innerHeight - 110)))
			return true;
		else
			return false;
	};


	// #### Recherche la taille idéale du dialogue ################################# private ### //
	// = révision : 25
	// » Vérifie si la largeur de la boite de dialogue ne dépassera pas la largeur de la fenêtre
	// » Vérifie si la hauteur de la boite de dialogue ne dépassera pas la hauteur de la fenêtre
	// » Adapte la taille du dialogue et de son contenu en conséquence
	// » Logique de calcul inspirée de Lytebox 3.2 (http://www.dolem.com/lytebox)
	this.updateSize = function (width, height, url) {

		// *** Préparation des variables ************************ //
		var infoMedia = null, infoWindow = null, mimeTypes = null;

		infoMedia = { width: width, height: height, id: url.slice((url.lastIndexOf('/') + 1), url.lastIndexOf('.')), mime: null };
		infoWindow = { width: window.innerWidth, height: window.innerHeight };
		mimeTypes = {
			ogv: 'video/ogg',  webm: 'video/webm',
			jpg: 'image/jpeg', jpeg: 'image/jpeg',
			png: 'image/png',   gif: 'image/gif',
			svg: 'image/svg+xml'
		};

		// *** Recherche du type mime *************************** //
		infoMedia.mime = url.slice(url.lastIndexOf('.') + 1);

		if (infoMedia.mime in mimeTypes)
			infoMedia.mime = mimeTypes[infoMedia.mime];

		// *** Calcul des dimensions **************************** //
		if (this.checkSize(width, height)) {

			infoWindow.width -= 150;
			infoWindow.height -= 110;

			// largeur de l'image supérieure à la largeur de la fenêtre
			if (infoMedia.width > infoWindow.width) {

				infoMedia.height = Math.floor(infoMedia.height * (infoWindow.width / infoMedia.width));
				infoMedia.width = infoWindow.width;

				if (infoMedia.height > infoWindow.height) {
					infoMedia.width = Math.floor(infoMedia.width * (infoWindow.height / infoMedia.height));
					infoMedia.height = infoWindow.height;
				}
			}

			// hauteur de l'image supérieure à la hauteur de la fenêtre
			else if (infoMedia.height > infoWindow.height) {

				infoMedia.width = Math.floor(infoMedia.width * (infoWindow.height / infoMedia.height));
				infoMedia.height = infoWindow.height;

				if (infoMedia.width > infoWindow.width) {
					infoMedia.height = Math.floor(infoMedia.height * (infoWindow.width / infoMedia.width));
					infoMedia.width = infoWindow.width;
				}
			}
		}

		// *** Applique les nouvelles dimensions **************** //
		this.fragment.firstChild.firstChild.style.width = infoMedia.width + 'px';
		this.fragment.firstChild.firstChild.style.marginLeft = parseInt(-(infoMedia.width + 20) / 2, 10) + 'px';
		this.fragment.firstChild.firstChild.style.marginTop  = parseInt(-(infoMedia.height + 65) / 2, 10) + 'px';

		return infoMedia;
	};


	// #### Chargement de la photo ################################################# private ### //
	// = révision : 10
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
			}, false);

			// eventListener:error
			this.image.addEventListener('error', function () {

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

					document.getElementById('topho').setAttribute('class', 'error_' + apijs.config.lang);
				}
			}, false);
		}
		else {
			document.getElementById('topho').removeAttribute('class');
			document.getElementById('topho').setAttribute('src', url);
		}
	};


	// #### Clone un objet ######################################################### private ### //
	// = révision : 6
	// » Clone une variable objet (de type object ou array)
	// » Permet ainsi de pouvoir modifier un objet sans modifier l'objet original
	// » En JavaScript, les objets sont passés par référence, ils ne sont jamais copiés
	this.clone = function (data) {

		if ((typeof data !== 'object') || (data === null))
			return data;

		var key = null, newData = new data.constructor();

		for (key in data)
			newData[key] = apijs.dialog.clone(data[key]);

		return newData;
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DU CONTENU DES BOITES DE DIALOGUE (13)

	// #### Éléments parents ####################################################### private ### //
	// = révision : 70
	// » Crée le conteneur parent
	// » Crée le conteneur du contenu du dialogue (div ou form)
	// » Met en place le gestionnaire d'évènement du formulaire (eventListener:submit)
	// # <div class="init [slideshow]" id="dialog">
	// #  <div class="{this.dialogType}" id="box"></div>
	// # </div>
	this.htmlParent = function (slideshow) {

		// *** Élément div (dialogue) *************************** //
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', ((slideshow) ? 'init slideshow' : 'init'));
		this.elemA.setAttribute('id', 'dialog');

		// *** Élément div (box) ******************************** //
		this.elemB = document.createElement('div');
		this.elemB.setAttribute('class', this.dialogType);
		this.elemB.setAttribute('id', 'box');

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.appendChild(this.elemA);
	};

	// # <div class="init" id="dialog">
	// #  <form action="{action}" method="post" [enctype="{enctype}"] [target="{target}"]
	// #   onsubmit="return apijs.dialog.actionConfirm();" class="{this.dialogType}" id="box"></form>
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
		this.elemB.setAttribute('class', this.dialogType);
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
	// = révision : 66
	// » Met en place le paragraphe du dialogue
	// » Prend en charge le bbcode grâce à [bbcode]
	// # <div>{data}</div>
	this.htmlText = function (data) {

		var bbcode = new apijs.core.bbcode();
		bbcode.init(data, apijs.config.dialog.emotes);
		bbcode.exec();

		this.fragment.firstChild.firstChild.appendChild(bbcode.get());
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
	// = révision : 29
	// » Met en place les boutons précédent et suivant des dialogues photo et vidéo
	// » À savoir un bouton à gauche et un bouton à droite de la boite de dialogue
	// » Bouton image ou texte en fonction de la configuration
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
		this.elemA.setAttribute('class', 'navigation ' + ((txtimg) ? 'txt' : 'img'));

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
	// = révision : 89
	// » Met en place le bouton fermer des dialogues photo et vidéo
	// » À savoir un bouton image dans le coin en haut à droite de la boite de dialogue
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
		this.elemA.setAttribute('class', 'close ' + ((txtimg) ? 'txt' : 'img'));

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
	// = révision : 72
	// » Met en place le lien différé des dialogues de confirmation, d'options et d'attente
	// » Appel différé dans le temps comme son nom le suggère
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
	// = révision : 138
	// » Met en place le contenu du formulaire du dialogue d'upload
	// » Composé d'un champ fichier et d'un champ caché pour l'extension APC de PHP
	// » Composé également d'une iframe qui sera détruite lors de l'affichage du site
	// » En profite par la même occasion pour pré-charger le graphique SVG du dialogue de progression
	// » Basculement automatique du focus entre le champ fichier et le bouton valider du formulaire
	// » À noter qu'il est obligatoire d'utiliser un nom d'iframe unique
	// # <iframe [src="{config.dialog.imageUpload.src}"] name="iframeUpload.{key}" id="iframeUpload" />
	// # <div>
	// #  <input type="hidden" name="UPLOAD_PROGRESS" value="{key}" />
	// #  <input type="file" name="{data}" onchange="document.getElementById('box').lastChild.firstChild.focus();" />
	// # </div>
	this.htmlFormUpload = function (data, key) {

		// *** Élément iframe *********************************** //
		this.elemA = document.createElement('iframe');

		if (apijs.config.navigator)
			this.elemA.setAttribute('src', apijs.config.dialog.imageUpload.src);

		this.elemA.setAttribute('name', 'iframeUpload.' + key);
		this.elemA.setAttribute('id', 'iframeUpload');

		document.getElementsByTagName('body')[0].appendChild(this.elemA);

		// *** Élément div ************************************** //
		this.elemA = document.createElement('div');

			// Élément input (clef)
			this.elemB = document.createElement('input');
			this.elemB.setAttribute('type', 'hidden');
			this.elemB.setAttribute('name', 'UPLOAD_PROGRESS');
			this.elemB.setAttribute('value', key);

		this.elemA.appendChild(this.elemB);

			// Élément input (fichier)
			this.elemB = document.createElement('input');
			this.elemB.setAttribute('type', 'file');
			this.elemB.setAttribute('name', data);
			this.elemB.setAttribute('onchange', "document.getElementById('box').lastChild.firstChild.focus();");

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};


	// #### Barre de progression ################################################### private ### //
	// = révision : 55
	// » Met en place le graphique SVG du dialogue de progression
	// » Rien ne s'affiche lorsque le format SVG n'est pas géré par le navigateur ou lorsque le fichier est introuvable
	// # [<object data="{config.dialog.imageUpload.src}" type="image/svg+xml"
	// #   width="{config.dialog.imageUpload.width}" height="{config.dialog.imageUpload.height}" id="progressbar" />]
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
	// = révision : 141
	// » Met en place la photo et la légende du dialogue photo
	// » Redimensionne la photo en fonction de la taille de la fenêtre lorsque nécessaire
	// » Affiche une icône zoom au survol de la photo si la photo est redimensionnée lors de son affichage
	// » Affiche un lien pour télécharger la photo si la configuration le permet
	// # <dl>
	// #  <dt>
	// #    [<a href="{url}" onclick="window.open(this.href); this.blur(); return false;">]
	// #      <img width="{infoPhoto.width}" height="{infoPhoto.height}" alt="" class="loading [resized]" id="topho" />[<span />]
	// #    [</a>]
	// #  </dt>
	// #  <dd>
	// #    [<span>{infoPhoto.id/name} ({date})</span>] {legend}
	// #    [<a href="{config.dialog.filePhoto}?id={infoPhoto.id}" type="{infoPhoto.mime}" class="download">{i18n.downloadLink}</a>]
	// #  </dd>
	// # </dl>
	this.htmlPhoto = function (width, height, url, name, date, legend) {

		// vérification des dimensions
		var infoPhoto = this.updateSize(width, height, url);

		// Élément dl
		this.elemA = document.createElement('dl');

			// *** Élément dt (terme) ************************** //
			this.elemB = document.createElement('dt');

				// Éléments a img span (photo redimensionnée)
				// # <a href="{url}" onclick="window.open(this.href); this.blur(); return false;">
				// #  <img width="{infoPhoto.width}" height="{infoPhoto.height}" alt="" class="loading resized" id="topho" />
				// #  <span />
				// # </a>
				if (apijs.config.dialog.showFullsize && this.checkSize(width, height)) {

					this.elemC = document.createElement('a');
					this.elemC.setAttribute('href', url);
					this.elemC.setAttribute('onclick', 'window.open(this.href); this.blur(); return false;');

						this.elemD = document.createElement('img');
						this.elemD.setAttribute('width', infoPhoto.width);
						this.elemD.setAttribute('height', infoPhoto.height);
						this.elemD.setAttribute('alt', '');
						this.elemD.setAttribute('class', 'loading resized');
						this.elemD.setAttribute('id', 'topho');

					this.elemC.appendChild(this.elemD);
					this.elemC.appendChild(document.createElement('span'));
				}
				// Élément img
				// # <img width="{infoPhoto.width}" height="{infoPhoto.height}" alt="" class="loading" id="topho" />
				else {
					this.elemC = document.createElement('img');
					this.elemC.setAttribute('width', infoPhoto.width);
					this.elemC.setAttribute('height', infoPhoto.height);
					this.elemC.setAttribute('alt', '');
					this.elemC.setAttribute('class', 'loading');
					this.elemC.setAttribute('id', 'topho');
				}

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

			// *** Élément dd (définition) ********************* //
			this.elemB = document.createElement('dd');

				// Élément span
				// # <span>{infoPhoto.id/name} ({date})</span>
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
						this.elemC.appendChild(document.createTextNode(infoPhoto.id + ' (' + date + ')'));

					// auto name
					else if (name === 'auto')
						this.elemC.appendChild(document.createTextNode(infoPhoto.id));

					// date
					else if (date !== 'false')
						this.elemC.appendChild(document.createTextNode('(' + date + ')'));

					this.elemB.appendChild(this.elemC);
				}

				// Nœud texte
				// # {legend}
				this.elemB.appendChild(document.createTextNode(' ' + legend + ' '));

				// Élément a (lien télécharger)
				// # <a href="{config.dialog.filePhoto}?id={infoPhoto.id}" type="{infoPhoto.mime}" class="download">{i18n.downloadLink}</a>
				if (apijs.config.dialog.savePhoto) {

					this.elemC = document.createElement('a');
					this.elemC.setAttribute('href', apijs.config.dialog.filePhoto + '?id=' + infoPhoto.id);
					this.elemC.setAttribute('type', infoPhoto.mime);
					this.elemC.setAttribute('class', 'download');
					this.elemC.appendChild(document.createTextNode(apijs.i18n.translate('downloadLink')));

					this.elemB.appendChild(this.elemC);
				}

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};


	// #### Vidéo et légende ############################################### i18n ## private ### //
	// = révision : 82
	// » Met en place la vidéo et la légende du dialogue vidéo
	// » Redimensionne la vidéo en fonction de la taille de la fenêtre lorsque nécessaire
	// » Un message d'information remplace la vidéo lorsque la balise vidéo du langage HTML 5 n'est pas gérée par le navigateur
	// » Affiche un lien pour télécharger la vidéo si la configuration le permet
	// # <dl>
	// #  <dt>
	// #    <video src="{url}" width="{infoVideo.width}" height="{infoVideo.height}" controls="controls" [autoplay="autoplay"]>
	// #      [{i18n.browserNoVideo}]
	// #    </video>
	// #  </dt>
	// #  <dd>
	// #    [<span>{infoVideo.id/name} ({date})</span>] {legend}
	// #    [<a href="{config.dialog.fileVideo}?id={infoVideo.id}" type="{infoVideo.mime}" class="download">{i18n.downloadLink}</a>]
	// #  </dd>
	// # </dl>
	this.htmlVideo = function (url, name, date, legend) {

		// vérification des dimensions
		var noVideo = null, infoVideo = this.updateSize(apijs.config.dialog.videoWidth, apijs.config.dialog.videoHeight, url);

		// Élément dl
		this.elemA = document.createElement('dl');

			// *** Élément dt (terme) ************************** //
			this.elemB = document.createElement('dt');

				// Élément video
				this.elemC = document.createElement('video');
				this.elemC.setAttribute('src', url);
				this.elemC.setAttribute('width', infoVideo.width);
				this.elemC.setAttribute('height', infoVideo.height);
				this.elemC.setAttribute('controls', 'controls');

				if (apijs.config.dialog.videoAutoplay)
					this.elemC.setAttribute('autoplay', 'autoplay');

				// Navigateurs obsolètes
				if (typeof this.elemC.pause !== 'function') {

					noVideo = new apijs.core.bbcode();
					noVideo.init(apijs.i18n.translate('browserNoVideo'));
					noVideo.exec();

					this.elemC.appendChild(noVideo.get());
					this.elemC.style.width = infoVideo.width;
					this.elemC.style.height = infoVideo.height;
				}

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

			// *** Élément dd (définition) ********************* //
			this.elemB = document.createElement('dd');

				// Élément span
				// # <span>{infoVideo.id/name} ({date})</span>
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
						this.elemC.appendChild(document.createTextNode(infoVideo.id + ' (' + date + ')'));

					// auto name
					else if (name === 'auto')
						this.elemC.appendChild(document.createTextNode(infoVideo.id));

					// date
					else if (date !== 'false')
						this.elemC.appendChild(document.createTextNode('(' + date + ')'));

					this.elemB.appendChild(this.elemC);
				}

				// Nœud texte
				// # {legend}
				this.elemB.appendChild(document.createTextNode(' ' + legend + ' '));

				// Élément a (lien télécharger)
				// # <a href="{config.dialog.fileVideo}?id={infoVideo.id}" type="{infoVideo.mime}" class="download">{i18n.downloadLink}</a>
				if (apijs.config.dialog.saveVideo) {

					this.elemC = document.createElement('a');
					this.elemC.setAttribute('href', apijs.config.dialog.fileVideo + '?id=' + infoVideo.id);
					this.elemC.setAttribute('type', infoVideo.mime);
					this.elemC.setAttribute('class', 'download');
					this.elemC.appendChild(document.createTextNode(apijs.i18n.translate('downloadLink')));

					this.elemB.appendChild(this.elemC);
				}

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.fragment.firstChild.firstChild.appendChild(this.elemA);
	};
};