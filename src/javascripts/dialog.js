"use strict";
/**
 * Created D/12/04/2009
 * Updated D/30/03/2014
 * Version 138
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

apijs.core.dialog = function () {

	this.styles = null;
	this.paused = null;
	this.image = null;

	this.timer = null;
	this.callback = null;
	this.args = null;

	this.fragment = null;
	this.elemA = null;
	this.elemB = null;
	this.elemC = null;
	this.elemD = null;

	this.tagDialog = null;
	this.tagMedia = null;
	this.tagTitle = null;
	this.tagBox = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES BOÎTES DE DIALOGUE

	// #### Dialogue d'information ######################################### debug ## public ### //
	// = révision : 86
	// » Permet d'afficher un message d'information à l'intention de l'utilisateur
	// » Composé d'un titre, d'un paragraphe et d'un bouton de dialogue (Ok)
	// » Fermeture par bouton Ok ou touche Échap
	// » Auto-focus sur le bouton Ok
	this.dialogInformation = function (title, text, icon) {

		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.initDialog('information', icon);

			this.htmlParent();
			this.htmlTitle(title);
			this.htmlContent(text);
			this.htmlButtonOk();

			this.showDialog();
			this.tagBox.querySelector('button.confirm').focus();
		}
		else {
			apijs.core.error('TheDialog.dialogInformation', 'debugInvalidCall', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue de confirmation ####################################### debug ## public ### //
	// = révision : 102
	// » Permet de demander une confirmation à l'utilisateur
	// » Composé d'un titre, d'un paragraphe et de deux boutons de dialogue (Annuler/Valider)
	// » Fermeture par bouton Annuler ou touche Échap tant que le dialogue n'est pas validé
	// » Appelle la fonction callback avec son paramètre args après la validation du dialogue [ callback(args) ]
	// » Auto-focus sur le bouton Valider
	this.dialogConfirmation = function (title, text, callback, args, icon) {

		if ((typeof title === 'string') && (typeof text === 'string') && (typeof callback === 'function')) {

			this.initDialog('confirmation', icon);

			this.htmlParent();
			this.htmlTitle(title);
			this.htmlContent(text);
			this.htmlButtonConfirm('button');

			this.callback = callback;
			this.args = args;

			this.showDialog();
			this.tagBox.querySelector('button.confirm').focus();
		}
		else {
			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.core.error('TheDialog.dialogConfirmation', 'debugInvalidCall', {
				'(string) *title': title,
				'(string) *text': text,
				'(function) *callback': callback,
				'(mixed) args': args,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue d'options ############################################# debug ## public ### //
	// = révision : 45
	// » Permet à l'utilisateur de modifier des options
	// » Composé d'un formulaire, d'un titre, d'un paragraphe et de deux boutons de dialogue (Annuler/Valider)
	// » Fermeture par bouton Annuler ou touche Échap tant que le formulaire n'est pas validé
	// » Validation du formulaire si la fonction callback avec son paramètre args renvoie true [ callback(false, args) ]
	// » Appelle la fonction callback avec ses paramètres action et args après la validation du dialogue [ callback(action, args) ]
	// » Auto-focus différé sur le premier champ du formulaire (12 ms)
	this.dialogFormOptions = function (title, text, action, callback, args, icon) {

		if ((typeof title === 'string') && (typeof text === 'string') && (typeof action === 'string') && (typeof callback === 'function')) {

			this.initDialog('options', icon);

			this.htmlParent(null, action);
			this.htmlTitle(title);
			this.htmlContent(text);
			this.htmlButtonConfirm('submit');

			this.callback = callback;
			this.args = args;

			this.showDialog();

			window.setTimeout(function () {
				apijs.dialog.tagBox.querySelector('input:not([readonly]),textarea:not([readonly]),select:not([disabled])').focus();
			}, 12);
		}
		else {
			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.core.error('TheDialog.dialogFormOptions', 'debugInvalidCall', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) *action': action,
				'(function) *callback': callback,
				'(mixed) args': args,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue d'upload ############################################## debug ## public ### //
	// = révision : 112
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Composé d'un formulaire, d'un titre, d'un paragraphe (sans émoticône), d'un champ fichier et de deux boutons de dialogue (Annuler/Valider)
	// » Fermeture par bouton Annuler ou touche Échap tant que le formulaire n'est pas validé
	// » Auto-focus différé sur le champ fichier du formulaire (12 ms)
	this.dialogFormUpload = function (title, text, action, inputname, icon) {

		if ((typeof title === 'string') && (typeof text === 'string') && (typeof action === 'string') && (typeof inputname === 'string')) {

			this.initDialog('upload', icon);

			this.htmlParent(null, action);
			this.htmlTitle(title);
			this.htmlContent(text, false);
			this.htmlFormUpload(inputname);
			this.htmlButtonConfirm('submit');

			this.showDialog();

			window.setTimeout(function () { apijs.dialog.tagBox.querySelector('button').focus(); }, 12);
		}
		else {
			apijs.core.error('TheDialog.dialogFormUpload', 'debugInvalidCall', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) *action': action,
				'(string) *inputname': inputname,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue de progression ######################################## debug ## public ### //
	// = révision : 103
	// » Permet de faire patienter l'utilisateur en affichant une barre de progression
	// » Composé d'un titre, d'un paragraphe et d'une barre de progression
	// » Fermeture automatique (ou pas) et touches CTRL+Q, CTRL+W, CTRL+R, CTRL+F4, CTRL+F5, ALT+F4, Échap et F5 désactivées
	this.dialogProgress = function (title, text, icon) {

		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.initDialog('progress', icon);

			this.htmlParent();
			this.htmlTitle(title);
			this.htmlContent(text, false);
			this.htmlProgressBar();

			this.showDialog();
		}
		else {
			apijs.core.error('TheDialog.dialogProgress', 'debugInvalidCall', {
				'(string) *title': title,
				'(string) *text': text,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue d'attente ############################################# debug ## public ### //
	// = révision : 98
	// » Permet de faire patienter l'utilisateur en affichant un message d'attente
	// » Composé d'un titre, d'un paragraphe (sans émoticône) et d'un lien différé de time secondes si time est supérieur à 5 (time * 1000 ms)
	// » Fermeture automatique (ou pas) et touches CTRL+Q, CTRL+W, CTRL+R, CTRL+F4, CTRL+F5, ALT+F4, Échap et F5 désactivées
	this.dialogWaiting = function (title, text, time, icon) {

		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.initDialog('waiting', icon);

			this.htmlParent();
			this.htmlTitle(title);
			this.htmlContent(text, false);

			this.showDialog();

			if ((typeof time === 'number') && (time > 5))
				this.timer = window.setTimeout(apijs.dialog.htmlLinkReload.bind(this), time * 1000);
		}
		else {
			apijs.core.error('TheDialog.dialogWaiting', 'debugInvalidCall', {
				'(string) *title': title,
				'(string) *text': text,
				'(number) time': time,
				'(string) icon': icon
			});
		}
	};


	// #### Dialogue photo ################################################# debug ## public ### //
	// = révision : 138
	// » Permet d'afficher une image au premier plan
	// » Composé d'une image, d'une définition et de trois boutons de dialogue (Précédent/Suivant/Fermer)
	// » Le paramètre icon n'est disponible/utilisé que {par l'intermédiaire de} et {que pour} TheSlideshow
	// » Fermeture par bouton Fermer ou touche Échap et Touche F11 pour passer en plein écran
	// » S'adapte automatiquement à la taille de la fenêtre du navigateur
	this.dialogPhoto = function (url, name, date, legend, icon) {

		if ((typeof url === 'string') && (typeof name === 'string') && (typeof date === 'string') && (typeof legend === 'string')) {

			if (typeof icon === 'string') {
				this.initDialog('photo', 'notransition slideshow');
				this.htmlParent(icon);
			}
			else {
				this.initDialog('photo', 'notransition');
				this.htmlParent();
			}

			this.htmlMedia(url, name, date, legend);
			this.htmlHelp((typeof icon === 'string'), false);
			this.htmlButtonClose();
			this.htmlButtonNavigation();

			this.showDialog();
			this.loadImage(url);
		}
		else {
			apijs.core.error('TheDialog.dialogPhoto', 'debugInvalidCall', {
				'(string) *url': url,
				'(string) *name': name,
				'(string) *date': date,
				'(string) *legend': legend
			});
		}
	};


	// #### Dialogue vidéo ################################################# debug ## public ### //
	// = révision : 98
	// » Permet d'afficher une vidéo au premier plan
	// » Composé d'une vidéo, d'une définition et de trois boutons de dialogue (Précédent/Suivant/Fermer)
	// » Le paramètre icon n'est disponible/utilisé que {par l'intermédiaire de} et {que pour} TheSlideshow
	// » S'adapte automatiquement à la taille de la fenêtre et se met en pause lors d'un changement d'onglet
	// » Fermeture par bouton Fermer ou touche Échap et Touche F11 pour passer en plein écran
	this.dialogVideo = function (url, name, date, legend, icon) {

		if ((typeof url === 'string') && (typeof name === 'string') && (typeof legend === 'string') && (typeof legend === 'string')) {

			if (typeof icon === 'string') {
				this.initDialog('video', 'notransition slideshow');
				this.htmlParent(icon);
			}
			else {
				this.initDialog('video', 'notransition');
				this.htmlParent();
			}

			this.htmlMedia(url, name, date, legend);
			this.htmlHelp((typeof icon === 'string'), true);
			this.htmlButtonClose();
			this.htmlButtonNavigation();

			this.showDialog();
			this.actionResizeMedia();
		}
		else {
			apijs.core.error('TheDialog.dialogVideo', 'debugInvalidCall', {
				'(string) *url': url,
				'(string) *name': name,
				'(string) *date': date,
				'(string) *legend': legend
			});
		}
	};


	// #### Dialogue vide ################################################## debug ## public ### //
	// = révision : 6
	// » Permet d'afficher ce que vous souhaitez
	// » Composé d'un paragraphe et d'un ou deux boutons de dialogue (Ok/Fermer)
	// » Fermeture par bouton Ok/Fermer ou touche Échap
	// » Auto-focus sur l'éventuel bouton Ok
	this.dialogEmpty = function (text, closeButton, okButton, icon) {

		if (typeof text === 'string') {

			this.initDialog('empty', icon);

			this.htmlParent();
			this.htmlContent(text);

			if (((typeof closeButton === 'boolean') && closeButton) || (okButton !== true))
				this.htmlButtonClose();

			if ((typeof okButton === 'boolean') && okButton)
				this.htmlButtonOk();

			this.showDialog();

			if ((typeof okButton === 'boolean') && okButton)
				this.tagBox.querySelector('button.confirm').focus();
		}
		else {
			apijs.core.error('TheDialog.dialogEmpty', 'debugInvalidCall', {
				'(string) *text': text,
				'(boolean) closeButton': closeButton,
				'(boolean) okButton': okButton,
				'(string) icon': icon
			});
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'INTERACTION ENTRE LE NAVIGATEUR ET LES DIALOGUES

	// #### Action de fermeture ################################## (event) ## public/private ### //
	// = révision : 53
	// » Supprime la boîte de dialogue
	// » Sur demande ou au clic mais pour certains dialogues
	this.actionClose = function (all) {

		if (document.getElementById('apijsDialog'))
			this.deleteDialog((typeof all !== 'boolean') || (all === true));
	};

	this.actionCloseOnClick = function (ev) {

		if ((ev.target.getAttribute('id') === 'apijsDialog') && !apijs.dialog.styles.has('photo', 'video', 'waiting', 'progress', 'lock'))
			apijs.dialog.deleteDialog(true);
	};


	// #### Actions du bouton Valider ############################# event ## i18n ## private ### // TODO
	// = révision : 164
	// » Sauf pour l'envoi de fichier en mode synchrone, renvoie false pour ne pas soumettre le formulaire
	// » Pour le dialogue d'upload, transfert l'appel vers la méthode actionConfirm de TheUpload (immédiat)
	//  affiche le dialogue de progression (12 ms)
	// » Pour le dialogue d'options et de confirmation,
	//  vérifie le dialogue d'options (arrêt du traitement si c'est pas bon)
	//  verrouille le dialogue, masque les boutons et le texte du dialogue, met en place le texte d'attente, active le lien différé (7000 ms)
	//  appelle la fonction de rappel (ne déverrouille pas le dialogue) (1000 ms)
	this.actionConfirm = function () {

		// validation du dialogue d'upload
		if (this.styles.has('upload')) {

			if (apijs.upload.actionConfirm(this.tagBox.getAttribute('action'))) {

				// affiche le dialogue de progression (12 ms)
				// via l'intermédiaire de [TheUpload]
				window.setTimeout(apijs.upload.showProgress, 12);
				return true;
			}
		}

		// gestion des dialogues d'options et de confirmation
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
			this.tagBox.querySelector('div.control').style.visibility = 'hidden';
			this.tagBox.querySelector('div.bbcode').style.visibility = 'hidden';

			// met en place le texte d'attente
			this.elemA = document.createElement('p');
			this.elemA.setAttribute('class', 'saving');
			this.elemA.appendChild(apijs.i18n.nodeTranslate('operationInProgress'));
			this.tagBox.appendChild(this.elemA);

			// active le lien différé (7000 ms)
			this.timer = window.setTimeout(apijs.dialog.htmlLinkReload.bind(this), 7000);

			// appelle la fonction de rappel
			// ne déverrouille pas le dialogue
			window.setTimeout(function () {
				if ((this.tagBox) && (this.tagBox.nodeName === 'FORM'))
					this.callback(this.tagBox.getAttribute('action'), this.args);
				else if (this.tagBox)
					this.callback(this.args);
			}.bind(this), 1000);
		}

		return false;
	};


	// #### Actions du clavier et du navigateur ################# (event) ## i18n ## private ### //
	// = révision : 125
	// » Gère les actions des touches en fonction des dialogues
	// » Empêche la fermeture du navigateur pour les dialogues ayant un verrou
	// » Empèche le défilement de la page dès qu'un dialogue est présent
	// » Nombreuses combinaisons possibles
	this.actionKey = function (ev) {

		var styles = apijs.dialog.styles, media = apijs.dialog.tagMedia;

		// * dialogues d'attente et de progresssion, ou tout autre dialogue verrouillé
		// empèche la fermeture de l'onglet et donc du navigateur
		// touches : ctrl + q | ctrl + w | ctrl + r | ctrl + f4 | ctrl + f5 // alt + f4 | échap | f5
		if (styles.has('waiting', 'progress', 'lock')) {

			if ((ev.ctrlKey && ((ev.keyCode === 81) || (ev.keyCode === 87) || (ev.keyCode === 82) || (ev.keyCode === 115) || (ev.keyCode === 116))) ||
			    (ev.altKey && (ev.keyCode === 115)) || (ev.keyCode === 27) || (ev.keyCode === 116)) {
				ev.preventDefault();
			}
		}
		// * dialogues photo et vidéo du diaporama
		// ferme le dialogue, ou affiche le premier ou dernier média, ou affiche le média précédent ou suivant
		// touches : échap // fin // début // gauche // droite
		else if (styles.has('slideshow')) {

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
		// * tout le monde sauf les dialogues précédents
		// ferme le dialogue
		// touche : échap
		else if (ev.keyCode === 27) {
			ev.preventDefault();
			apijs.dialog.actionClose(true);
		}

		// dialogue vidéo
		// touches : espace | p // haut | page haut // bas | page bas // + // - // m
		if (styles.has('video') && !isNaN(media.duration)) {

			if ((ev.keyCode === 32) || (ev.keyCode === 80)) {
				ev.preventDefault();
				if (media.paused) { media.play(); } else { media.pause(); }
			}
			else if ((ev.keyCode === 38) || (ev.keyCode === 33)) {
				ev.preventDefault();
				if (media.currentTime < (media.duration - 15))
					media.currentTime += 10;
			}
			else if ((ev.keyCode === 40) || (ev.keyCode === 34)) {
				ev.preventDefault();
				media.currentTime -= 10;
			}
			else if (ev.keyCode === 107) {
				ev.preventDefault();
				if (media.volume < 1)
					media.volume += 0.2;
			}
			else if (ev.keyCode === 109) {
				ev.preventDefault();
				if (media.volume > 0.2)
					media.volume -= 0.2;
			}
			else if (ev.keyCode === 77) {
				ev.preventDefault();
				media.muted = (media.muted) ? false : true;
			}
		}

		// défilement de la page pour tous (renvoi sur ..actionScrollBrowser)
		// touches : espace | page haut | page bas | fin | début // haut | bas
		// SAUF lorsque ces touches (sauf page haut, page bas) sont dans un formulaire
		if ((ev.keyCode === 32) || (ev.keyCode === 33) || (ev.keyCode === 34) || (ev.keyCode === 35) || (ev.keyCode === 36) ||
		    (ev.keyCode === 38) || (ev.keyCode === 40)) {

			var inputText = (ev.target.nodeName === 'INPUT'),
			    inputTextarea = (ev.target.nodeName === 'TEXTAREA'),
			    inputSelect = (ev.target.nodeName === 'SELECT');

			if ((!inputText && !inputTextarea && !inputSelect) || (ev.keyCode === 33) || (ev.keyCode === 34))
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
		ev.preventDefault();
		ev.stopPropagation();
	};


	// #### Action de redimensionnement de la fenêtre ##################### event ## private ### //
	// = révision : 14
	// » Redimensionne le contenu du dialogue en fonction de la taille de la fenêtre
	// » Affiche la photo (ou l'image) au centre (center) ou au mieux (contain)
	// » Empèche la vidéo de dépasser la taille de la fenêtre
	this.actionResizeMedia = function () {

		var image = apijs.dialog.image, bis = false;

		// mode d'affichage de la photo
		// si la largeur ou la hauteur est supérieur de l'image est supérieur à la taille de l'affichage disponible (=bis)
		if (image !== null) {
			if ((image.width > Math.round(apijs.dialog.tagMedia.offsetWidth)) || (image.height > Math.round(apijs.dialog.tagMedia.offsetHeight)))
				bis = true;
		}
		// mode d'affichage de la vidéo
		// si la largeur de la vidéo dans l'affichage disponible est supérieur à la largeur de la fenêtre (=bis)
		else {
			apijs.dialog.tagMedia.setAttribute('class', apijs.dialog.tagMedia.getAttribute('class').replace('bis', 'default'));
			if (Math.round(apijs.dialog.tagMedia.offsetWidth) > (window.innerWidth - window.innerWidth * 12 / 100))
				bis = true;
			apijs.dialog.tagMedia.setAttribute('class', apijs.dialog.tagMedia.getAttribute('class').replace('default', 'bis'));
		}

		apijs.dialog.tagMedia.setAttribute('class', apijs.dialog.tagMedia.getAttribute('class').replace((bis) ? 'default' : 'bis', (bis) ? 'bis' : 'default'));
	};


	// #### Mise en pause de la vidéo ################################### (event) ## private ### //
	// = révision : 15
	// » Met en pause la vidéo lorsque la page n'est plus visible
	// » Utilise l'API JavaScript PageVisibility
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
			apijs.dialog.paused = apijs.dialog.tagMedia.paused;
			apijs.dialog.tagMedia.pause();
		}
		else if (!apijs.dialog.paused) {
			apijs.dialog.tagMedia.play();
		}
	};


	// #### Chargement de la photo ######################################### i18n ## private ### //
	// = révision : 36
	// » Définie l'arrière plan de la fausse balise image du dialogue photo
	// » Prend soin d'attendre le temps que la photo soit intégralement chargée avant de l'afficher
	// » Ne supprime pas (plus) le lien de téléchargement en cas d'erreur si celui-ci est présent
	this.loadImage = function (url) {

		this.image = new Image();
		this.image.src = url;

		// eventListener:load
		this.image.addEventListener('load', function () {
			this.tagMedia.setAttribute('class', this.tagMedia.getAttribute('class').replace('loading', 'default'));
			this.tagMedia.setAttribute('style', 'background-image:url("' + this.image.src + '");');
			this.actionResizeMedia();
		}.bind(this), false);

		// eventListener:error
		this.image.addEventListener('error', function () {
			this.tagMedia.setAttribute('class', this.tagMedia.getAttribute('class').replace(/loading|default/, 'error'));
			this.tagMedia.firstChild.appendChild(apijs.i18n.nodeTranslate('error404'));
		}.bind(this), false);
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DES CONTENEURS PARENTS

	// #### Prépare le terrain ##################################################### private ### //
	// = révision : 102
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
		this.fragment = document.createDocumentFragment();

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
	// = révision : 49
	// » Accroche le fragment DOM au document HTML (sur body ou sur #apijsDialog)
	// » Diffère le changement de la classe CSS de start vers ready pour permettre les transitions CSS lorsque nécessaire (12 ms)
	// » Met en place les gestionnaires d'événements du contenu du dialogue (+click, +resize, +visibilitychange)
	this.showDialog = function () {

		// sans transitions CSS ou avec transitions CSS
		if (document.getElementById('apijsDialog') || this.styles.has('notransition')) {

			this.tagDialog.setAttribute('class', this.tagDialog.getAttribute('class').replace('start', 'ready'));
			this.tagBox.setAttribute('class', this.tagBox.getAttribute('class').replace('start', 'ready'));

			if (document.getElementById('apijsDialog')) {
				document.getElementById('apijsDialog').appendChild(this.tagBox);
				this.tagDialog = document.getElementById('apijsDialog'); // important
			}
			else {
				document.body.appendChild(this.fragment);
			}
		}
		else {
			document.body.appendChild(this.fragment);

			window.setTimeout(function () {
				this.tagDialog.setAttribute('class', this.tagDialog.getAttribute('class').replace('start', 'ready'));
				this.tagBox.setAttribute('class', this.tagBox.getAttribute('class').replace('start', 'ready'));
			}.bind(this), 12);
		}

		// fermeture des popups au clic
		if (apijs.config.dialog.closeOnClick && !this.styles.has('waiting', 'progress', 'lock'))
			document.addEventListener('click', apijs.dialog.actionCloseOnClick, false);

		// adapatation de la taille du média
		if (this.styles.has('photo', 'video'))
			window.addEventListener('resize', apijs.dialog.actionResizeMedia, false);

		// mise en pause de la vidéo
		if (this.styles.has('video')) {

			if (typeof document.hidden === 'boolean')
				document.addEventListener('visibilitychange', apijs.dialog.actionPauseVideo, false);
			else if (typeof document.mozHidden === 'boolean')
				document.addEventListener('mozvisibilitychange', apijs.dialog.actionPauseVideo, false);
			else if (typeof document.msHidden === 'boolean')
				document.addEventListener('msvisibilitychange', apijs.dialog.actionPauseVideo, false);
			else if (typeof document.webkitHidden === 'boolean')
				document.addEventListener('webkitvisibilitychange', apijs.dialog.actionPauseVideo, false);
		}
	};


	// #### Supprime le dialogue ################################################### private ### //
	// = révision : 152
	// » Supprime la boîte de dialogue (totalement ou pas)
	// » Annule les gestionnaires d'événements du dialogue (-keydown, -beforeunload, -DOMMouseScroll, -mousewheel, -touchmove)
	// » Annule les gestionnaires d'événements du contenu du dialogue (-click, -resize, -visibilitychange)
	// » Utilise l'évnement qui détecte la fin des transitions (+transitionend ou +webkitTransitionEnd)
	// » Réinitialise la plupart des variables
	this.deleteDialog = function (all) {

		// *** Prépare la suppression du dialogue *************** //
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
			document.removeEventListener('click', apijs.dialog.actionCloseOnClick, false);

		// adapatation de la taille du média (depuis showDialog)
		if (this.styles.has('photo', 'video'))
			window.removeEventListener('resize', apijs.dialog.actionResizeMedia, false);

		// mise en pause de la vidéo (depuis showDialog)
		if (this.styles.has('video')) {

			if (typeof this.tagMedia.pause === 'function') {

				this.tagMedia.pause();

				// pour au moins Chrome/Chromium 30 et Opera 17, pour la raison suivante : la vidéo plante au deuxième chargement sans lecture
				// 1) l'utilisateur est là, il clic sur une vidéo
				// 2) le programme crée le dialogue et l'affiche
				// 3) la première image de la vidéo s'affiche tout de suite
				// 4) l'utilisateur, n'a plus envie, il appuie sur le bouton fermer
				// 5) le programme supprime le dialogue
				// 6) l'utilisateur est là, il reclic sur la même vidéo
				// 7) le programme crée le dialogue et l'affiche
				// 8) la première image de la vidéo ne s'affiche pas
				this.tagMedia.setAttribute('src', '');
			}

			if (typeof document.hidden === 'boolean')
				document.removeEventListener('visibilitychange', apijs.dialog.actionPauseVideo, false);
			else if (typeof document.mozHidden === 'boolean')
				document.removeEventListener('mozvisibilitychange', apijs.dialog.actionPauseVideo, false);
			else if (typeof document.msHidden === 'boolean')
				document.removeEventListener('msvisibilitychange', apijs.dialog.actionPauseVideo, false);
			else if (typeof document.webkitHidden === 'boolean')
				document.removeEventListener('webkitvisibilitychange', apijs.dialog.actionPauseVideo, false);
		}

		// *** Supprime le dialogue ***************************** //
		this.tagDialog = document.getElementById('apijsDialog');
		this.tagBox = document.getElementById('apijsBox');

		if (all) {
			// avec ou sans transitions CSS
			// ici on s'assure que les transitions fonctionnent (style CSS, valeur calculée)
			// il serait dommage qu'une boîte de dialogue invisible reste affichée et porte préjudice
			var styles = window.getComputedStyle(this.tagBox, null),
			    event = (typeof this.tagBox.style.webkitTransition === 'string') ? 'webkitTransitionEnd' : 'transitionend';

			if (!this.styles.has('notransition') && (styles.transitionDuration !== '0s') && (styles.transitionDuration !== undefined)) {

				this.tagDialog.setAttribute('class', this.tagDialog.getAttribute('class').replace('ready', 'end'));
				this.tagBox.setAttribute('class', this.tagBox.getAttribute('class').replace('ready', 'end'));

				this.tagDialog.addEventListener(event, function () {
					if (document.getElementById('apijsDialog'))
						document.body.removeChild(document.getElementById('apijsDialog'));
				}, false);
			}
			else {
				document.body.removeChild(document.getElementById('apijsDialog'));
			}
		}
		else if (this.tagBox) {
			this.tagBox.parentNode.removeChild(this.tagBox);
		}

		// *** Réinitialise les variables *********************** //
		this.styles = null;
		this.paused = null;
		this.image = null;

		this.timer = null;
		if (all) {
			this.callback = null;
			this.args = null;
		}

		this.fragment = null;
		this.elemA = null;
		this.elemB = null;
		this.elemC = null;
		this.elemD = null;

		this.tagDialog = null;
		this.tagMedia = null;
		this.tagTitle = null;
		this.tagBox = null;
	};


	// #### Recherche le type mime du fichier ###################################### private ### //
	// = révision : 10
	// » Renvoie le type mime d'un ou plusieurs fichier(s) image ou vidéo
	// » Recherche dans le nom du fichier avec son chemin
	// # types[0][0] = types[0]['ogv']
	// # types[0][1] = types[0]['video/ogg']
	this.searchTypes = function (url) {

		var types = [], i, list, all = {
			jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', svg:'image/svg+xml',
			ogv:'video/ogg', webm:'video/webm', mp4:'video/mp4', m4v:'video/mp4'
		};

		url = url.slice(url.lastIndexOf('.') + 1);
		list = url.replace('#', '.').replace(',', '.').split('.');

		for (i = 0; i < list.length; i++)
			types.push(all.hasOwnProperty(list[i]) ? [ list[i], all[list[i]] ] : [ list[i], list[i] ]);

		return types;
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DU CONTENU DES BOÎTES DE DIALOGUE

	// #### Éléments parents ####################################################### private ### //
	// = révision : 99
	// » Crée le conteneur parent et le conteneur du contenu du dialogue
	// » Le paramètre icon n'est disponible/utilisé que {par l'intermédiaire de} et {que pour} TheSlideshow
	// # <div class="start [{icon}]" id="apijsDialog">
	// #  [<div class="start {this.styles}" id="apijsBox"></div>]
	// #  [<form action="{action}" method="post" enctype="multipart/form-data" onsubmit="return..actionConfirm();"
	// #    class="start {this.styles}" id="apijsBox"></form>]
	// # </div>
	this.htmlParent = function (icon, action) {

		// Élément div (apijsDialog)
		this.tagDialog = document.createElement('div');
		this.tagDialog.setAttribute('class', (typeof icon === 'string') ? 'start ' + icon : 'start');
		this.tagDialog.setAttribute('id', 'apijsDialog');

			// Élément div ou form (apijsBox)
			if (typeof action !== 'string') {
				this.tagBox = document.createElement('div');
			}
			else {
				this.tagBox = document.createElement('form');
				this.tagBox.setAttribute('action', action);
				this.tagBox.setAttribute('method', 'post');
				this.tagBox.setAttribute('enctype', 'multipart/form-data');
				this.tagBox.setAttribute('onsubmit', 'return apijs.dialog.actionConfirm();');
			}

			this.tagBox.setAttribute('class', 'start ' + this.styles.toString()); // .toString() pour IE
			this.tagBox.setAttribute('id', 'apijsBox');

		this.tagDialog.appendChild(this.tagBox);

		// sauvegarde des éléments
		this.fragment.appendChild(this.tagDialog);
	};


	// #### Titre ################################################################## private ### //
	// = révision : 55
	// » Met en place le titre du dialogue
	// # <h1>{title}</h1>
	this.htmlTitle = function (title) {

		this.tagTitle = document.createElement('h1');
		this.tagTitle.appendChild(document.createTextNode(title));

		this.tagBox.appendChild(this.tagTitle);
	};


	// #### Texte ################################################################## private ### //
	// = révision : 89
	// » Met en place le paragraphe du dialogue
	// » Prend en charge le bbcode via innerHTML ainsi que les émoticônes
	// » Ouvre les liens ayant la classe CSS popup dans un nouvel onglet
	// # <div class="bbcode [config.dialog.emotes/allowEmotes]">
	// #  [<p>]{data}[</p>]
	// # </div>
	this.htmlContent = function (data, allowEmotes) {

		allowEmotes = (typeof allowEmotes === 'boolean') ? allowEmotes : true;

		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', (apijs.config.dialog.emotes) ? 'bbcode emotes' : 'bbcode');

		// ajout d'un éventuel paragraphe
		if (data[0] !== '[')
			data = '[p]' + data + '[/p]';

		// http://icomoon.io/app/
		// avec le fichier de session ../fonts/icomoon.json
		if (apijs.config.dialog.emotes && allowEmotes) {

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

		// interprétation du texte... enfin des données
		this.elemA.innerHTML = data.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\[/g, '<').replace(/\]/g, '>');

		// ouverture des liens dans un nouvel onglet
		var link, links = this.elemA.querySelectorAll('a.popup');
		for (link = 0; link < links.length; link++)
			links[link].addEventListener('click', apijs.openTab, false);

		// sauvegarde des éléments
		this.tagBox.appendChild(this.elemA);
	};


	// #### Bouton Ok ###################################################### i18n ## private ### //
	// = révision : 70
	// » Met en place le bouton Ok du dialogue d'information
	// » Auto-focus différé sur le bouton Ok
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
			this.elemB.appendChild(apijs.i18n.nodeTranslate('buttonOk'));

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.tagBox.appendChild(this.elemA);
	};


	// #### Boutons Annuler/Valider ######################################## i18n ## private ### //
	// = révision : 90
	// » Met en place les boutons Annuler et Valider des dialogues de confirmation, d'options et d'upload
	// » Auto-focus différé sur le bouton Valider du dialogue de confirmation et sur le champ fichier du dialogue d'upload
	// # <div class="control">
	// #  <button type="{type}" class="confirm" [onclick="apijs.dialog.actionConfirm();"]>{i18n.buttonConfirm}</button>
	// #  <button type="button" class="cancel" onclick="apijs.dialog.actionClose(true);">{i18n.buttonCancel}</button>
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

			this.elemB.appendChild(apijs.i18n.nodeTranslate('buttonConfirm'));

		this.elemA.appendChild(this.elemB);

			// Élément button (Annuler)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('class', 'cancel');
			this.elemB.setAttribute('onclick', 'apijs.dialog.actionClose(true);');
			this.elemB.appendChild(apijs.i18n.nodeTranslate('buttonCancel'));

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.tagBox.appendChild(this.elemA);
	};


	// #### Boutons Précédent/Suivant ###################################### i18n ## private ### //
	// = révision : 48
	// » Met en place les boutons Précédent et Suivant des dialogues photo et vidéo
	// » À savoir un bouton à gauche et un bouton à droite de la boîte de dialogue
	// » Boutons au format image ou texte en fonction de la configuration
	// # <div class="navigation [txt|img]">
	// #  <button type="button" disabled="disabled" onclick="apijs.slideshow.actionPrev();" class="prev" id="apijsPrev">
	// #   [<img src="{config.dialog.imagePrev.src}" width="{config.dialog.imagePrev.width}" height="{config.dialog.imagePrev.height}"
	// #    alt="{i18n.buttonPrev}" />][<span>{i18n.buttonPrev}</span>]
	// #  </button>
	// #  <button type="button" disabled="disabled" onclick="apijs.slideshow.actionNext();" class="next" id="apijsNext">
	// #   [<img src="{config.dialog.imageNext.src}" width="{config.dialog.imageNext.width}" height="{config.dialog.imageNext.height}"
	// #    alt="{i18n.buttonNext}" />][<span>{i18n.buttonNext}</span>]
	// #  </button>
	// # </div>
	this.htmlButtonNavigation = function () {

		var txt = ((apijs.config.dialog.imagePrev === null) || (apijs.config.dialog.imageNext === null));

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', (txt) ? 'navigation txt' : 'navigation img');

			// Élément button (Précédent)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('disabled', 'disabled');
			this.elemB.setAttribute('onclick', 'apijs.slideshow.actionPrev();');
			this.elemB.setAttribute('class', 'prev');
			this.elemB.setAttribute('id', 'apijsPrev');

			// Élément span ou Élément img
			if (txt) {
				this.elemC = document.createElement('span');
				this.elemC.appendChild(apijs.i18n.nodeTranslate('buttonPrev'));
			}
			else {
				this.elemC = document.createElement('img');
				this.elemC.setAttribute('src', apijs.config.dialog.imagePrev.src);
				this.elemC.setAttribute('width', apijs.config.dialog.imagePrev.width);
				this.elemC.setAttribute('height', apijs.config.dialog.imagePrev.height);
				this.elemC.setAttribute('alt', apijs.i18n.translate('buttonPrev'));
			}

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

			// Élément button (Suivant)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('disabled', 'disabled');
			this.elemB.setAttribute('onclick', 'apijs.slideshow.actionNext();');
			this.elemB.setAttribute('class', 'next');
			this.elemB.setAttribute('id', 'apijsNext');

			// Élément span ou Élément img
			if (txt) {
				this.elemC = document.createElement('span');
				this.elemC.appendChild(apijs.i18n.nodeTranslate('buttonNext'));
			}
			else {
				this.elemC = document.createElement('img');
				this.elemC.setAttribute('src', apijs.config.dialog.imageNext.src);
				this.elemC.setAttribute('width', apijs.config.dialog.imageNext.width);
				this.elemC.setAttribute('height', apijs.config.dialog.imageNext.height);
				this.elemC.setAttribute('alt', apijs.i18n.translate('buttonNext'));
			}

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.tagBox.appendChild(this.elemA);
	};


	// #### Bouton Fermer ################################################## i18n ## private ### //
	// = révision : 98
	// » Met en place le bouton Fermer des dialogues photo et vidéo
	// » À savoir un bouton dans le coin en haut à droite de la boîte de dialogue
	// » Bouton au format image ou texte en fonction de la configuration
	// # <div class="close [txt|img]">
	// #  <button type="button" onclick="apijs.dialog.actionClose(true);" class="close">
	// #   [<img src="{config.dialog.imageClose.src}" width="{config.dialog.imageClose.width}" height="{config.dialog.imageClose.height}"
	// #    alt="{i18n.buttonClose}" />][{i18n.buttonClose}]
	// #  </button>
	// # </div>
	this.htmlButtonClose = function () {

		var txt = (apijs.config.dialog.imageClose === null);

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', (txt) ? 'close txt' : 'close img');

			// Élément button (Fermer)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('onclick', 'apijs.dialog.actionClose(true);');
			this.elemB.setAttribute('class', 'close');

			// Nœud texte ou Élément img
			if (txt) {
				this.elemB.appendChild(apijs.i18n.nodeTranslate('buttonClose'));
			}
			else {
				this.elemC = document.createElement('img');
				this.elemC.setAttribute('src', apijs.config.dialog.imageClose.src);
				this.elemC.setAttribute('width', apijs.config.dialog.imageClose.width);
				this.elemC.setAttribute('height', apijs.config.dialog.imageClose.height);
				this.elemC.setAttribute('alt', apijs.i18n.translate('buttonClose'));
				this.elemB.appendChild(this.elemC);
			}

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.tagBox.appendChild(this.elemA);
	};


	// #### Lien différé ######################################## timeout ## i18n ## private ### //
	// = révision : 79
	// » Appel différé dans le temps comme son nom ne le suggère pas
	// » Met en place le lien différé des dialogues de confirmation, d'options et d'attente
	// # <p class="reload">{i18n.operationTooLong} <a href="{location.href}">{i18n.reloadLink}</a>.
	// # <br />{i18n.warningLostChange}</p>
	this.htmlLinkReload = function () {

		// Élément p
		this.elemA = document.createElement('p');
		this.elemA.setAttribute('class', 'reload');
		this.elemA.appendChild(apijs.i18n.nodeTranslate('operationTooLong'));

			// Élément a (lien recharger)
			this.elemB = document.createElement('a');
			this.elemB.setAttribute('href', 'javascript:location.reload();');
			this.elemB.appendChild(apijs.i18n.nodeTranslate('reloadLink'));

		this.elemA.appendChild(this.elemB);
		this.elemA.appendChild(document.createTextNode('.'));

			// Élément br
			this.elemB = document.createElement('br');

		this.elemA.appendChild(this.elemB);
		this.elemA.appendChild(apijs.i18n.nodeTranslate('warningLostChange'));

		// mise à jour du document
		this.tagBox.appendChild(this.elemA);
	};


	// #### Formulaire d'envoi de fichier ################################## i18n ## private ### //
	// = révision : 167
	// » Met en place le contenu du formulaire du dialogue d'upload
	// » Bascule automatiquement le focus entre le champ fichier et le bouton Valider
	// ! [Firefox 4/10] Le champ fichier n'est pas en 'display:none' mais en 'width:0; visibility:hidden;' car sinon il ne fonctionne pas
	// ! [IE 9/10] Le input.click() ne fonctionne pas d'où le style CSS pour afficher le champ fichier à la place du bouton
	// ! [IE 9] Le this.files ne fonctionne pas d'où le this.value
	// # <div class="control online">
	// #  <input type="file" name="{inputname}" onchange="apijs..button..focus(); apijs..span..=..;" [style="..."] />
	// #  <button type="button" class="browse" onclick="apijs..input..click();" [style="..."]>{i18n.buttonBrowse}</button>
	// #  <span class="filename"></span>
	// #  <div class="status"></div>
	// # </div>
	this.htmlFormUpload = function (inputname) {

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', 'control online');

			// Élément input (fichier)
			this.elemB = document.createElement('input');
			this.elemB.setAttribute('type', 'file');
			this.elemB.setAttribute('name', inputname);
			this.elemB.setAttribute('onchange', "apijs.dialog.tagBox.querySelector('button.confirm').focus(); apijs.dialog.tagBox.querySelector('span').innerHTML = (this.files) ? this.files[0].name : this.value.slice(12);");

			if (navigator.userAgent.indexOf('MSIE') > 0)
				this.elemB.setAttribute('style', 'width:auto; visibility:visible;');

		this.elemA.appendChild(this.elemB);

			// Élément button (parcourir)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('class', 'browse');
			this.elemB.setAttribute('onclick', "apijs.dialog.tagBox.querySelector('input').click();");
			this.elemB.appendChild(apijs.i18n.nodeTranslate('buttonBrowse'));

			if (navigator.userAgent.indexOf('MSIE') > 0)
				this.elemB.setAttribute('style', 'display:none;');

		this.elemA.appendChild(this.elemB);

			// Élément span (nom du fichier)
			this.elemB = document.createElement('span');
			this.elemB.setAttribute('class', 'filename');

		this.elemA.appendChild(this.elemB);

			// Élément div
			this.elemB = document.createElement('div');
			this.elemB.setAttribute('class', 'status');
			this.elemB.appendChild(document.createTextNode(''));

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.tagBox.appendChild(this.elemA);
	};


	// #### Barre de progression ################################################### private ### //
	// = révision : 65
	// » Met en place le graphique SVG du dialogue de progression
	// » Rien ne s'affiche lorsque le format SVG n'est pas géré par le navigateur
	// # <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="apijsProgress">
	// #  <rect class="auto" />
	// #  <text> </text>
	// # </svg>
	this.htmlProgressBar = function () {

		// Élément svg
		this.elemA = document.createElement('svg');
		this.elemA.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		this.elemA.setAttribute('version', '1.1');
		this.elemA.setAttribute('id', 'apijsProgress');

			// Élément rect
			this.elemB = document.createElement('rect');
			this.elemB.setAttribute('class', 'auto');

		this.elemA.appendChild(this.elemB);

			// Élément text
			this.elemB = document.createElement('text');
			this.elemB.appendChild(document.createTextNode('\u00A0'));

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.tagBox.appendChild(this.elemA);
	};


	// #### Média et légende ############################################### i18n ## private ### //
	// = révision : 179
	// » Met en place la photo ou vidéo (le média) et la légende du dialogue photo ou vidéo
	// » Affiche un lien pour télécharger le média si la configuration le permet
	// » Rien ne s'affiche lorsque la balise vidéo n'est pas gérée par le navigateur
	// # <dl class="media">
	// #  <dt>
	// #   [<div class="img loading|error|default|bis" id="apijsMedia">]
	// #    [<span />]
	// #   [</div>]
	// #   [<video controls="controls" class="default|bis" id="apijsMedia">]
	// #     [<source src="{url}.{types[i][0]}" type="{types[i][1]}" />]
	// #   [</video>]
	// #  </dt>
	// #  <dd>
	// #   [<span>{fileid/name} ({date})</span>] {legend}
	// #  </dd>
	// # </dl>
	this.htmlMedia = function (url, name, date, legend) {

		var types = this.searchTypes(url), fileid = url.slice((url.lastIndexOf('/') + 1), url.lastIndexOf('.')), i;

		// Élément dl (média et légende)
		this.elemA = document.createElement('dl');
		this.elemA.setAttribute('class', 'media');

			// Élément dt (terme)
			this.elemB = document.createElement('dt');

			if (types[0][1].indexOf('image') > -1) {
				// Élément div (et non img...)
				// # <div class="img loading|error|default|bis" id="apijsMedia" />
				this.tagMedia = document.createElement('div');
				this.tagMedia.setAttribute('class', 'img loading');
				this.tagMedia.setAttribute('id', 'apijsMedia');

				// Élement span
				// # <span />
				this.elemD = document.createElement('span');
				this.tagMedia.appendChild(this.elemD);
			}
			else {
				// Élément video
				// # <video controls="controls" class="default|bis" id="apijsMedia">
				this.tagMedia = document.createElement('video');
				this.tagMedia.setAttribute('controls', 'controls');
				this.tagMedia.setAttribute('class', 'default');
				this.tagMedia.setAttribute('id', 'apijsMedia');

				// Élément(s) source
				// 1: video.ogv - 3: video.ogv#mp4,webm
				// # <source src="{url}.{types[i][0]}" type="{types[i][1]}" />
				for (i = 0; i < types.length; i++) {

					this.elemD = document.createElement('source');
					this.elemD.setAttribute('src', url.slice(0, url.lastIndexOf('.')) + '.' + types[i][0]);
					this.elemD.setAttribute('type', types[i][1]);

					this.tagMedia.appendChild(this.elemD);
				}
			}

			this.elemB.appendChild(this.tagMedia);

		this.elemA.appendChild(this.elemB);

			// Élément dd (définition)
			this.elemB = document.createElement('dd');

			if ((name !== 'false') || (date !== 'false')) {

				// Élément span
				// # <span>{fileid/name} ({date})</span>
				this.elemC = document.createElement('span');

				// name + date
				if ((name !== 'false') && (name !== 'auto') && (date !== 'false'))
					this.elemC.appendChild(document.createTextNode(name + ' (' + date + ')'));
				// name
				else if ((name !== 'false') && (name !== 'auto'))
					this.elemC.appendChild(document.createTextNode(name));
				// auto name + date
				else if ((name === 'auto') && (date !== 'false'))
					this.elemC.appendChild(document.createTextNode(fileid + ' (' + date + ')'));
				// auto name
				else if (name === 'auto')
					this.elemC.appendChild(document.createTextNode(fileid));
				// date
				else if (date !== 'false')
					this.elemC.appendChild(document.createTextNode('(' + date + ')'));

				this.elemB.appendChild(this.elemC);
			}

			// Nœud texte
			// # {legend}
			this.elemB.appendChild(document.createTextNode(' ' + legend + ' '));

		this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.tagBox.appendChild(this.elemA);
	};


	// #### Aide à la navigation ########################################### i18n ## private ### //
	// = révision : 10
	// » Affiche la liste des commandes disponibles
	// » Pour tous : F11 plein écran ; Échap quitter
	// » Pour les diaporamas : ↖|Fin début/fin ; ←|→ suivant/précédent
	// » Pour les vidéos : p lecture/pause ; ↑|↓ avancer/reculer ; +|- augmenter/baisser le volume ; m couper le son
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

		if (slideshow) {
			data.push(['start;↖', 'ctrlKeyEnd', 'ctrlSlideshowFirstLast']);
			data.push(['left;←', 'right;→', 'ctrlSlideshowNextPrev']);
		}
		if (video) {
			data.push(['p', 'ctrlVideoPause']);
			data.push(['top;↑', 'bot;↓', 'ctrlVideoTime']);
			data.push(['more;+', 'less;-', 'ctrlVideoSound']);
			data.push(['m', 'ctrlVideoMute']);
		}
		data.push(['F11', 'ctrlDialogFullscreen']);
		data.push(['ctrlKeyEsc', 'ctrlDialogQuit']);

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', 'kbd');

			// Élément ul
			this.elemB = document.createElement('ul');

				// Éléments li et kbd
				for (i = 0; i < data.length; i++) {

					total = data[i].length - 1;
					this.elemC = document.createElement('li');

					for (j = 0; j < total; j++) {

						this.elemD = document.createElement('kbd');

						if (data[i][j].indexOf(';') > 0) {
							tmp = data[i][j].split(';');
							this.elemD.setAttribute('class', tmp[0]);
							this.elemD.setAttribute('title', tmp[1]);
						}
						else {
							this.elemD.appendChild(apijs.i18n.nodeTranslate(data[i][j]));
						}

						this.elemC.appendChild(this.elemD);
					}

					this.elemC.appendChild(apijs.i18n.nodeTranslate(data[i][total]));
					this.elemB.appendChild(this.elemC);
				}

			this.elemA.appendChild(this.elemB);

		// sauvegarde des éléments
		this.tagBox.appendChild(this.elemA);
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
		return (this.data !== null) ? apijs.inArray(this.data, Array.prototype.slice.call(arguments, 0)) : false;
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