/**
 * Created D/12/04/2009
 * Updated D/24/10/2010
 * Version 99
 *
 * Copyright 2008-2010 | Fabrice Creuzot (luigifab) <code~luigifab~info>
 * http://www.luigifab.info/apijs/
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

function Dialogue() {

	// définition des attributs
	this.offset = 0;
	this.page = true;
	this.timer = null;
	this.dialogue = null;
	this.image = null;

	this.elemA = null;
	this.elemB = null;
	this.elemC = null;
	this.elemD = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES BOITES DE DIALOGUE (8)

	// #### Dialogue d'information ################################# i18n ## debug ## public ### //
	// = révision : 64
	// » Permet d'afficher un message d'information à l'intention de l'utilisateur
	// » Composé d'un titre, d'un paragraphe, et d'un bouton de dialogue (Ok)
	// » Fermeture par bouton Ok ou touche Échap
	this.dialogInformation = function (title, text, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string')) {

			if (typeof icon !== 'string')
				icon = 'information';

			this.setupDialogue(icon);
			this.htmlParent();

			this.htmlTitle(title);
			this.htmlParagraph(text);
			this.htmlButtonOk();
		}

		// *** Message de debug ********************************* //
		else if (config.debug) {

			this.dialogInformation(i18n.translate('debugInvalidCall'), 'TheDialogue » dialogInformation[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (string) icon : ' + icon);
		}
	};


	// #### Dialogue de confirmation ############################### i18n ## debug ## public ### //
	// = révision : 62
	// » Permet de demander une confirmation à l'utilisateur
	// » Composé d'un titre, d'un paragraphe, et de deux boutons de dialogue (Annuler et Valider)
	// » Fermeture par bouton Annuler ou touche Échap
	this.dialogConfirmation = function (title, text, action, icon) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof action === 'string')) {

			if (typeof icon !== 'string')
				icon = 'confirmation';

			this.setupDialogue(icon);
			this.htmlParent();

			this.htmlTitle(title);
			this.htmlParagraph(text);
			this.htmlButtonConfirm(action);
		}

		// *** Message de debug ********************************* //
		else if (config.debug) {

			this.dialogInformation(i18n.translate('debugInvalidCall'), 'TheDialogue » dialogConfirmation[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (string) action : ' + action + '[br]➩ (string) icon : ' + icon);
		}
	};


	// #### Dialogue d'upload ###################################### i18n ## debug ## public ### //
	// = révision : 66
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Composé d'un titre, d'un paragraphe, d'un champ fichier, et de deux boutons de dialogue (Annuler et Valider)
	// » Fermeture par bouton Annuler ou touche Échap
	this.dialogUpload = function (title, text, data, key) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof key === 'string') && (typeof data === 'string')) {

			this.setupDialogue('upload');
			this.htmlParent();

			this.htmlTitle(title);
			this.htmlParagraph(text);
			this.htmlFormUpload(data, key);
			this.htmlButtonConfirm('upload');
		}

		// *** Message de debug ********************************* //
		else if (config.debug) {

			this.dialogInformation(i18n.translate('debugInvalidCall'), 'TheDialogue » dialogUpload[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (string) data : ' + data + '[br]➩ (string) key : ' + key);
		}
	};


	// #### Dialogue de progression ################################ i18n ## debug ## public ### //
	// = révision : 76
	// » Permet de faire patienter l'utilisateur en affichant une barre de progression
	// » Composé d'un titre, d'un paragraphe, d'une barre de progression, et d'un lien différé de 10 secondes
	// » Fermeture automatique et touche Échap désactivée
	this.dialogProgress = function (title, text) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.setupDialogue('progress');
			this.htmlParent();

			this.htmlTitle(title);
			this.htmlParagraph(text);
			this.htmlProgressBar();

			this.timer = window.setTimeout(TheDialogue.htmlLinkReload, 10000);
		}

		// *** Message de debug ********************************* //
		else if (config.debug) {

			this.dialogInformation(i18n.translate('debugInvalidCall'), 'TheDialogue » dialogProgress[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text);
		}
	};


	// #### Dialogue d'attente ##################################### i18n ## debug ## public ### //
	// = révision : 64
	// » Permet de faire patienter l'utilisateur en affichant un message d'attente
	// » Composé d'un titre, d'un paragraphe, et d'un lien différé de 4 secondes
	// » Fermeture automatique ou pas et touche Échap désactivée
	this.dialogWaiting = function (title, text) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof title === 'string') && (typeof text === 'string')) {

			this.setupDialogue('waiting');
			this.htmlParent();

			this.htmlTitle(title);
			this.htmlParagraph(text);

			this.timer = window.setTimeout(TheDialogue.htmlLinkReload, 4000);
		}

		// *** Message de debug ********************************* //
		else if (config.debug) {

			this.dialogInformation(i18n.translate('debugInvalidCall'), 'TheDialogue » dialogWaiting[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text);
		}
	};


	// #### Dialogue photo ######################################### i18n ## debug ## public ### //
	// = révision : 104
	// » Permet d'afficher une photo en plein écran au premier plan
	// » Composé d'une photo, d'une définition, et de trois boutons de dialogue (Précédent Suivant et Fermer)
	// » Fermeture par bouton Fermer ou touche Échap
	this.dialogPhoto = function (width, height, url, name, date, legend) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof width === 'number') && (typeof height === 'number') && (typeof url === 'string') && (typeof name === 'string') && (typeof date === 'string') && (typeof legend === 'string')) {

			this.setupDialogue('photo');
			this.htmlParent();

			this.htmlPhoto(width, height, url, name, date, legend);
			this.htmlButtonClose();
			this.htmlButtonNavigation();
		}

		// *** Message de debug ********************************* //
		else if (config.debug) {

			this.dialogInformation(i18n.translate('debugInvalidCall'), 'TheDialogue » dialogPhoto[br]➩ (number) width : ' + width + '[br]➩ (number) height : ' + height + '[br]➩ (string) url : ' + url + '[br]➩ (string) name : ' + name + '[br]➩ (string) date : ' + date + '[br]➩ (string) legend : ' + legend);
		}
	};


	// #### Dialogue vidéo ######################################### i18n ## debug ## public ### //
	// = révision : 63
	// » Permet d'afficher une vidéo en plein écran au premier plan
	// » Composé d'une vidéo, d'une définition, et de trois boutons de dialogue (Précédent Suivant et Fermer)
	// » Fermeture par bouton Fermer ou touche Échap
	this.dialogVideo = function (url, name, date, legend) {

		// *** Création de la boite de dialogue ***************** //
		if ((typeof url === 'string') && (typeof name === 'string') && (typeof legend === 'string') && (typeof legend === 'string')) {

			this.setupDialogue('video');
			this.htmlParent();

			this.htmlVideo(url, name, date, legend);
			this.htmlButtonClose();
			this.htmlButtonNavigation();
		}

		// *** Message de debug ********************************* //
		else if (config.debug) {

			this.dialogInformation(i18n.translate('debugInvalidCall'), 'TheDialogue » dialogVideo[br]➩ (string) url : ' + url + '[br]➩ (string) name : ' + name + '[br]➩ (string) date : ' + date + '[br]➩ (string) legend : ' + legend);
		}
	};


	// #### Dialogue automatique ################################### i18n ## debug ## public ### //
	// = révision : 6
	// » Permet d'afficher le contenu d'un élément sous forme d'une boite de dialogue
	// » Composé des sous éléments qui compose l'élément en question
	// » Fermeture par bouton Fermer ou touche Échap
	this.dialogAuto = function (id) {

		// *** Affichage de la boite de dialogue **************** //
		if ((typeof id === 'string') && document.getElementById(id)) {

			document.getElementById(id).setAttribute('class', document.getElementById(id).getAttribute('class').replace('nodisplay','dialogue'));
			document.getElementById(id + 'Cancel').setAttribute('onclick', 'TheDialogue.actionClose(true);');
			this.setupDialogue('auto ' + id);
		}

		// *** Message de debug ********************************* //
		else if (config.debug) {

			this.dialogInformation(i18n.translate('debugInvalidCall'), 'TheDialogue » dialogAuto[br]➩ (string) id : ' + id);
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES ACTIONS DES BOUTONS ET DES TOUCHES DU CLAVIER (3)

	// #### Action de fermeture ######################################### event ## protected ### //
	// = révision : 35
	// » Supprime la boite de dialogue
	// » Affiche le site en fonction du mode de fermeture
	this.actionClose = function (all) {

		if (all) {
			this.deleteDialogue();
			this.showPage();
		}
		else {
			this.deleteDialogue();
			this.dialogue = null;
			this.page = false;
		}
	};


	// #### Action du bouton Valider ##################### i18n ## debug ## event ## private ### //
	// = révision : 84
	// » Retour à l'expéditeur qui se démerde pour la suite de la gestion du dialogue
	// » Envoie le formulaire de la boite de dialogue si l'action est option
	// » En provenance des dialogues de confirmation ou d'upload
	// » Fait appel à [TheButton] ou à [TheUpload]
	this.actionConfirm = function (action) {

		// *** Formulaire d'options ***************************** //
		if (action === 'option') {
			document.getElementBydId('formOption').submit();
		}

		// *** Retour sur TheButton (confirmation) ************** //
		else if ((action === 'cancel') || (action === 'delete')) {

			if ((typeof Button === 'function') && (TheButton instanceof Button))
				TheButton.actionConfirm(action);

			else if (config.debug)
				this.dialogInformation(i18n.translate('debugInvalidUse'), 'TheDialogue » actionConfirm[br]➩ TheButton ' + i18n.translate('debugNotExist'));
		}

		// *** Retour sur TheUpload (upload) ******************** //
		else if (action === 'upload') {

			if ((typeof Upload === 'function') && (TheUpload instanceof Upload))
				TheUpload.actionConfirm();

			else if (config.debug)
				this.dialogInformation(i18n.translate('debugInvalidUse'), 'TheDialogue » actionConfirm[br]➩ TheUpload ' + i18n.translate('debugNotExist'));
		}

		// *** Message de debug ********************************* //
		else if (config.debug) {
			this.dialogInformation(i18n.translate('debugUnknownAction'), 'TheDialogue » actionConfirm[br]➩ (string) action : ' + action);
		}
	};


	// #### Action des touches du clavier ################ i18n ## debug ## event ## private ### //
	// = révision : 73
	// » Désactive l'action de la touche Échap pour les dialogues d'attente et de progression
	// » Ferme tous autres dialogues lors de l'appui sur la touche Échap
	// » En mode diaporama demande l'affichage du média suivant ou précédent lors de l'appui sur les touches droite ou gauche
	// » En mode diaporama demande l'affichage du premier ou du dernier média lors de l'appui sur les touches début ou fin
	this.actionKey = function (ev) {

		if (config.debugkey) {
			ev.preventDefault();
			TheDialogue.dialogInformation(i18n.translate('debugKeyDetected'), 'TheDialogue » actionKey[br]' + i18n.translate('debugKeyCode', ev.keyCode));
		}

		else if ((ev.keyCode === 27) && ((TheDialogue.dialogue === 'waiting') || (TheDialogue.dialogue === 'progress')) ) {
			ev.preventDefault();
		}

		else if (ev.keyCode === 27) {
			ev.preventDefault();
			TheDialogue.actionClose(true);
		}

		else if ((ev.keyCode === 35) && ((TheDialogue.dialogue === 'photo') || (TheDialogue.dialogue === 'video')) && (TheSlideshow !== null)) {
			ev.preventDefault();
			TheSlideshow.actionLast();
		}

		else if ((ev.keyCode === 36) && ((TheDialogue.dialogue === 'photo') || (TheDialogue.dialogue === 'video')) && (TheSlideshow !== null)) {
			ev.preventDefault();
			TheSlideshow.actionFirst();
		}

		else if ((ev.keyCode === 37) && ((TheDialogue.dialogue === 'photo') || (TheDialogue.dialogue === 'video')) && (TheSlideshow !== null)) {
			ev.preventDefault();
			TheSlideshow.actionPrev();
		}

		else if ((ev.keyCode === 39) && ((TheDialogue.dialogue === 'photo') || (TheDialogue.dialogue === 'video')) && (TheSlideshow !== null)) {
			ev.preventDefault();
			TheSlideshow.actionNext();
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'AFFICHAGE DES CONTENEURS PARENTS (5)

	// #### Prépare le terrain ##################################################### private ### //
	// = révision : 53
	// » Supprime l'ancienne boite de dialogue ou cache le site internet si nécessaire
	// » Prend en compte la configuration de TheSlideshow si nécessaire
	// » Met en place l'écoute des touches du clavier (eventListener:keydown)
	// » Définie le type de dialogue
	this.setupDialogue = function (icon) {

		// supprime l'ancien dialogue
		if (this.dialogue !== null)
			this.deleteDialogue();

		// cache le site internet
		if (config.dialogue.hiddenPage || ((TheSlideshow !== null) && config.slideshow.hiddenPage && icon.match(/(photo)|(video)/))) {

			if (this.page && ((window.pageYOffset > 0) || (this.offset > 0)))
				this.offset = window.pageYOffset;

			for (var id in config.dialogue.blocks) if (config.dialogue.blocks.hasOwnProperty(id)) {

				if (config.navigator)
					document.getElementById(config.dialogue.blocks[id]).setAttribute('class', 'nodisplay');
				else
					document.getElementById(config.dialogue.blocks[id]).className = 'nodisplay';
			}
		}

		// active l'écoute des touches
		if (config.navigator)
			document.addEventListener('keydown', TheDialogue.actionKey, false);

		this.dialogue = icon;
		this.page = false;
	};


	// #### Supprime la boite de dialogue ########################################## private ### //
	// = révision : 60
	// » Dégage le timer du lien différé (timeout) si nécessaire
	// » Annule l'écoute des touches du clavier (eventListener:keydown)
	// » Détruit intégralement ou cache la boite de dialogue et efface le contenu des variables
	this.deleteDialogue = function () {

		// supprime le timer et l'écoute des touches
		if (this.timer)
			clearTimeout(this.timer);

		if (config.navigator)
			document.removeEventListener('keydown', TheDialogue.actionKey, false);

		// détruit ou cache la boite de dialogue
		if (!this.dialogue.match(/auto/)) {
			document.getElementById('dialogue').parentNode.removeChild(document.getElementById('dialogue'));
		}
		else {
			document.getElementById(this.dialogue.slice(5) + 'Cancel').removeAttribute('onclick');
			document.getElementById(this.dialogue.slice(5)).setAttribute('class', document.getElementById(this.dialogue.slice(5)).getAttribute('class').replace('dialogue', 'nodisplay'));
		}

		// réinitialise les variables
		this.timer = null;
		this.image = null;
		this.elemA = null;
		this.elemB = null;
		this.elemC = null;
		this.elemD = null;
	};


	// #### Affiche le site ######################################################## private ### //
	// = révision : 70
	// » Supprime l'iframe du formulaire d'upload si nécessaire
	// » Affiche le site au bon endroit après la suppression de la boite de dialogue si nécessaire
	// » Prend en compte la configuration de TheSlideshow si nécessaire
	this.showPage = function () {

		if (document.getElementById('iframeUpload'))
			document.getElementById('iframeUpload').parentNode.removeChild(document.getElementById('iframeUpload'));

		if (config.dialogue.hiddenPage || ((TheSlideshow !== null) && config.slideshow.hiddenPage && this.dialogue.match(/(photo)|(video)/))) {

			for (var id in config.dialogue.blocks) if (config.dialogue.blocks.hasOwnProperty(id)) {

				if (config.navigator)
					document.getElementById(config.dialogue.blocks[id]).removeAttribute('class');
				else
					document.getElementById(config.dialogue.blocks[id]).className = '';
			}

			window.scrollBy(0, this.offset);
		}

		this.dialogue = null;
		this.page = true;
	};


	// #### Vérifie la taille de la fenêtre ######################################## private ### //
	// = révision : 12
	// » Vérifie si les dialogues photo ou vidéo peuvent être affichés sans redimensionnement
	// » Renvoie true si la photo ou vidéo doit être redimensionnée et false s'il n'y a rien à faire
	this.changeSize = function (width, height) {

		if ((width > (window.innerWidth - 150)) || (height > (window.innerHeight - 100)))
			return true;
		else
			return false;
	};


	// #### Recherche de la taille idéale ########################################## private ### //
	// = révision : 16
	// » Vérifie si la largeur de la boite de dialogue ne dépassera pas la largeur de la fenêtre
	// » Vérifie si la hauteur de la boite de dialogue ne dépassera pas la hauteur de la fenêtre
	// » Adapte la taille du dialogue et de son contenu en conséquence
	// » Logique de calcul de Lytebox 3.2 (http://www.dolem.com/lytebox/)
	this.setSize = function (width, height, url) {

		var infoMedia  = { width: width, height: height, id: url.slice((url.lastIndexOf('/') + 1), url.lastIndexOf('.')), mime: null };
		var infoWindow = { width: window.innerWidth, height: window.innerHeight };

		var mimeTypes = {
			ogv: 'video/ogg',  webm: 'video/webm',
			jpg: 'image/jpeg', jpeg: 'image/jpeg',
			tif: 'image/tiff', tiff: 'image/tiff',
			png: 'image/png',   svg: 'image/svg+xml'
		};

		// *** Recherche du type mime *************************** //
		infoMedia.mime = url.slice(url.lastIndexOf('.') + 1);

		if (infoMedia.mime in mimeTypes)
			infoMedia.mime = mimeTypes[infoMedia.mime];

		// *** Calcul des dimensions **************************** //
		if (this.changeSize(width, height)) {

			infoWindow.width -= 150;
			infoWindow.height -= 100;

			// largeur de l'image supérieur à la largeur de la fenêtre
			if (infoMedia.width > infoWindow.width) {

				infoMedia.height = Math.floor(infoMedia.height * (infoWindow.width / infoMedia.width));
				infoMedia.width = infoWindow.width;

				if (infoMedia.height > infoWindow.height) {
					infoMedia.width = Math.floor(infoMedia.width * (infoWindow.height / infoMedia.height));
					infoMedia.height = infoWindow.height;
				}
			}

			// hauteur de l'image supérieur à la hauteur de la fenêtre
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
		document.getElementById('box').style.width = infoMedia.width + 'px';
		document.getElementById('box').style.marginLeft = parseInt(-(infoMedia.width + 20) / 2, 10) + 'px';
		document.getElementById('box').style.marginTop  = parseInt(-(infoMedia.height + 50) / 2, 10) + 'px';

		return infoMedia;
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DU CONTENU DES BOITES DE DIALOGUE (12)

	// #### Éléments parents ####################################################### private ### //
	// = révision : 53
	// » Crée le conteneur parent du dialogue
	// » Crée le conteneur du contenu du dialogue
	// # <div id="dialogue">
	// #  <div id="boite"></div>
	// # </div>
	this.htmlParent = function () {

		// Élément div (dialogue)
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('id', 'dialogue');

			// Élément div (box)
			this.elemB = document.createElement('div');
			this.elemB.setAttribute('id', 'box');
			this.elemB.setAttribute('class', this.dialogue);

		this.elemA.appendChild(this.elemB);

		// Attache tous les éléments à body
		document.getElementsByTagName('body')[0].appendChild(this.elemA);
	};


	// #### Titre ################################################################## private ### //
	// = révision : 51
	// » Met en place le titre du dialogue
	// # <h1>{title}</h1>
	this.htmlTitle = function (title) {

		this.elemA = document.createElement('h1');
		this.elemA.appendChild(document.createTextNode(title));

		document.getElementById('box').appendChild(this.elemA);
	};


	// #### Paragraphe ############################################################# private ### //
	// = révision : 59
	// » Met en place le paragraphe du dialogue
	// » Prend en charge le BB code grâce à [bbcode]
	this.htmlParagraph = function (data) {

		var bbcode = new BBcode();
		bbcode.init('box');
		bbcode.parse(data);
	};


	// #### Bouton Ok ###################################################### i18n ## private ### //
	// = révision : 62
	// » Met en place le bouton ok du dialogue d'information
	// » Auto-focus sur le bouton ok
	// # <div class="control">
	// #  <button type="button" class="confirm" onclick="TheDialogue.actionClose(true);">{i18n.buttonOk}</button>
	// # </div>
	this.htmlButtonOk = function () {

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', 'control');

			// Élément button (Ok)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('class', 'confirm');
			this.elemB.setAttribute('onclick', 'TheDialogue.actionClose(true);');
			this.elemB.appendChild(document.createTextNode(i18n.translate('buttonOk')));

		this.elemA.appendChild(this.elemB);

		// Attache tous les éléments à la div box
		document.getElementById('box').appendChild(this.elemA);
		document.getElementById('box').lastChild.lastChild.focus();
	};


	// #### Boutons Annuler/Valider ######################################## i18n ## private ### //
	// = révision : 78
	// » Met en place les deux boutons annuler et valider des dialogues de confirmation et d'upload
	// » Auto-focus sur le bouton valider ou sur le champ fichier du dialogue d'upload
	// # <div class="control">
	// #  <button type="button" class="cancel" onclick="TheDialogue.actionClose(true);">{i18n.buttonCancel}</button>
	// #  <button type="button" class="confirm" onclick="TheDialogue.actionConfirm('{action}');">{i18n.buttonConfirm}</button>
	// # </div>
	this.htmlButtonConfirm = function (action) {

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', 'control');

			// Élément button (Annuler)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('class', 'cancel');
			this.elemB.setAttribute('onclick', 'TheDialogue.actionClose(true);');
			this.elemB.appendChild(document.createTextNode(i18n.translate('buttonCancel')));

		this.elemA.appendChild(this.elemB);

			// Élément button (Valider)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('class', 'confirm');
			this.elemB.setAttribute('onclick', "TheDialogue.actionConfirm('" + action + "');");
			this.elemB.appendChild(document.createTextNode(i18n.translate('buttonConfirm')));

		this.elemA.appendChild(this.elemB);

		// Attache tous les éléments à la div box
		document.getElementById('box').appendChild(this.elemA);

		// Gestion du focus
		if (document.getElementById('formUpload'))
			document.getElementById('formUpload').firstChild.firstChild.focus();
		else
			document.getElementById('box').lastChild.lastChild.focus();
	};


	// #### Boutons Précédent/Suivant ############################################## private ### //
	// = révision : 19
	// » Met en place les deux boutons précédent et suivant des dialogues photo et vidéo
	// » À savoir un bouton à gauche et un bouton à droite de la boite de dialogue
	// # <div class="navigation">
	// #  <button type="button" disabled="disabled" onclick="TheSlideshow.actionPrev();" id="prev">«</button>
	// #  <button type="button" disabled="disabled" onclick="TheSlideshow.actionNext();" id="next">»</button>
	// # </div>
	this.htmlButtonNavigation = function () {

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', 'navigation');

			// Élément button (Précédent)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('disabled', 'disabled');
			this.elemB.setAttribute('onclick', 'TheSlideshow.actionPrev();');
			this.elemB.setAttribute('id', 'prev');
			this.elemB.appendChild(document.createTextNode('«'));

		this.elemA.appendChild(this.elemB);

			// Élément button (Valider)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('disabled', 'disabled');
			this.elemB.setAttribute('onclick', 'TheSlideshow.actionNext();');
			this.elemB.setAttribute('id', 'next');
			this.elemB.appendChild(document.createTextNode('»'));

		this.elemA.appendChild(this.elemB);

		// Attache tous les éléments à la div box
		document.getElementById('box').appendChild(this.elemA);
	};


	// #### Bouton Fermer ################################################## i18n ## private ### //
	// = révision : 82
	// » Met en place le bouton fermer des dialogues photo et vidéo
	// » À savoir un bouton image dans le coin en haut à droite de la boite de dialogue
	// # <div class="close">
	// #  <button type="button" class="close" onclick="TheDialogue.actionClose(true);">
	// #    <img src="{config.dialogue.imageClose}" width="60" height="22" alt="{i18n.buttonClose}" />
	// #  </button>
	// # </div>
	this.htmlButtonClose = function () {

		// Élément div
		this.elemA = document.createElement('div');
		this.elemA.setAttribute('class', 'close');

			// Élément button (Fermer)
			this.elemB = document.createElement('button');
			this.elemB.setAttribute('type', 'button');
			this.elemB.setAttribute('class', 'close');
			this.elemB.setAttribute('onclick', 'TheDialogue.actionClose(true);');

				// Élément img
				this.elemC = document.createElement('img');
				this.elemC.setAttribute('src', config.dialogue.imageClose);
				this.elemC.setAttribute('width', '60');
				this.elemC.setAttribute('height', '22');
				this.elemC.setAttribute('alt', i18n.translate('buttonClose'));

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

		// Attache tous les éléments à la div box
		document.getElementById('box').appendChild(this.elemA);
	};


	// #### Lien différé ######################################## i18n ## timeout ## private ### //
	// = révision : 68
	// » Met en place le lien différé des dialogues d'attente et de progression
	// » Appel différé dans le temps comme son nom le suggère
	// # <p class="reload">{i18n.operationTooLong} <a href="{document.URL}">{i18n.reloadLink}</a>.
	// # <br />{i18n.warningLostChange}</p>
	this.htmlLinkReload = function () {

		// Élément p
		this.elemA = document.createElement('p');
		this.elemA.setAttribute('class', 'reload');
		this.elemA.appendChild(document.createTextNode(i18n.translate('operationTooLong')));

			// Élément a (lien recharger)
			this.elemB = document.createElement('a');
			this.elemB.setAttribute('href', document.URL);
			this.elemB.appendChild(document.createTextNode(i18n.translate('reloadLink')));

		this.elemA.appendChild(this.elemB);
		this.elemA.appendChild(document.createTextNode('.'));

			// Élément br
			this.elemB = document.createElement('br');

		this.elemA.appendChild(this.elemB);
		this.elemA.appendChild(document.createTextNode(i18n.translate('warningLostChange')));

		// Attache tous les éléments à la div box
		document.getElementById('box').appendChild(this.elemA);
	};


	// #### Formulaire d'envoi de fichier ########################################## private ### //
	// = révision : 122
	// » Met en place le formulaire du dialogue d'upload
	// » Composé d'un formulaire et d'une iframe qui sera détruite lors de l'affichage du site
	// » En profite par la même occasion pour pré-charger le graphique SVG du dialogue de progression
	// » Obligation d'utiliser un nom d'iframe unique entre chaque upload
	// » Basculement automatique du focus
	// # <iframe id="iframeUpload" name="iframeUpload_{key}" src="{config.dialogue.imageUpload}" />
	// # <form id="formUpload" action="{config.dialogue.fileUpload}" method="post" enctype="multipart/form-data" target="iframeUpload_{key}">
	// #  <p>
	// #    <input type="file" name="{data}" onchange="document.getElementById('box').lastChild.lastChild.focus();" />
	// #    <input type="hidden" name="APC_UPLOAD_PROGRESS" value="{key}" />
	// #  </p>
	// # </form>
	this.htmlFormUpload = function (data, key) {

		// Élément iframe (cible du formulaire)
		this.elemA = document.createElement('iframe');
		this.elemA.setAttribute('id', 'iframeUpload');
		this.elemA.setAttribute('name', 'iframeUpload_' + key);

		if (config.navigator)
			this.elemA.setAttribute('src', config.dialogue.imageUpload);

		document.getElementsByTagName('body')[0].appendChild(this.elemA);

		// Élément form (formulaire d'envoi de fichier)
		this.elemA = document.createElement('form');
		this.elemA.setAttribute('id', 'formUpload');
		this.elemA.setAttribute('action', config.dialogue.fileUpload);
		this.elemA.setAttribute('method', 'post');
		this.elemA.setAttribute('enctype', 'multipart/form-data');
		this.elemA.setAttribute('target', 'iframeUpload_' + key);

			// Élément p
			this.elemB = document.createElement('p');

				// Élément input (fichier)
				this.elemC = document.createElement('input');
				this.elemC.setAttribute('type', 'file');
				this.elemC.setAttribute('name', data);
				this.elemC.setAttribute('onchange', "document.getElementById('box').lastChild.lastChild.focus();");

			this.elemB.appendChild(this.elemC);

				// Élément input (clef)
				this.elemC = document.createElement('input');
				this.elemC.setAttribute('type', 'hidden');
				this.elemC.setAttribute('name', 'APC_UPLOAD_PROGRESS');
				this.elemC.setAttribute('value', key);

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

		// Attache tous les éléments à la div box
		document.getElementById('box').appendChild(this.elemA);
	};


	// #### Barre de progression ################################################### private ### //
	// = révision : 39
	// » Met en place le graphique SVG du dialogue de progression
	// » Dans le cas où le format SVG n'est pas géré par le navigateur ou si le fichier est introuvable rien ne s'affichera
	// # <object id="progressbar" type="image/svg+xml" data="{config.dialogue.imageUpload}" width="300" height="18" />
	this.htmlProgressBar = function () {

		// Élément object (graphique svg)
		this.elemA = document.createElement('object');
		this.elemA.setAttribute('id', 'progressbar');
		this.elemA.setAttribute('type', 'image/svg+xml');
		this.elemA.setAttribute('data', config.dialogue.imageUpload);
		this.elemA.setAttribute('width', '300');
		this.elemA.setAttribute('height', '17');

		// Attache l'élément à la div box
		document.getElementById('box').appendChild(this.elemA);
	};


	// #### Photo et légende ############################################### i18n ## private ### //
	// = révision : 130
	// » Met en place la photo et la légende du dialogue photo
	// » Redimensionne la photo en fonction de la taille de la fenêtre lorsque nécessaire
	// » Prends soin d'attendre le temps que la photo soit intégralement chargée avant de l'afficher si la config le permet
	// » Affiche un lien pour télécharger la photo originale si la config le permet
	// » Affiche une icône zoom au survol si la photo est redimensionnée lors de son affichage
	// # <dl>
	// #  <dt>
	// #    [<a href="{url}" onclick="window.open(this.href); this.blur(); return false;">]
	// #      <img src="{url}" width="{infoPhoto.width}" height="{infoPhoto.height}" class="loading [resized]" id="topho" />[<span></span>]
	// #    [</a>]
	// #  </dt>
	// #  <dd>
	// #    [<span>{infoPhoto.id/name} ({date})</span>] {legend}
	// #    [<a href="{config.dialogue.filePhoto}?id={infoPhoto.id}" type="{infoPhoto.mime}" class="download">{i18n.downloadLink}</a>]
	// #  </dd>
	// # </dl>
	this.htmlPhoto = function (width, height, url, name, date, legend) {

		// Vérification des dimensions
		var infoPhoto = this.setSize(width, height, url);

		// Élément dl
		this.elemA = document.createElement('dl');

			// *** Élément dt (terme) ********************* //
			this.elemB = document.createElement('dt');

				// Éléments a img span (photo redimensionnée)
				// # <a href="{url}" onclick="window.open(this.href); this.blur(); return false;">
				// #  <img src="{url}" width="{infoPhoto.width}" height="{infoPhoto.height}" class="loading resized" id="topho" />
				// #  <span></span>
				// # </a>
				if (this.changeSize(width, height)) {

					this.elemC = document.createElement('a');
					this.elemC.setAttribute('href', url);
					this.elemC.setAttribute('onclick', 'window.open(this.href); this.blur(); return false;');

						this.elemD = document.createElement('img');
						this.elemD.setAttribute('width', infoPhoto.width);
						this.elemD.setAttribute('height', infoPhoto.height);
						this.elemD.setAttribute('class', 'loading resized');
						this.elemD.setAttribute('id', 'topho');

					this.elemC.appendChild(this.elemD);
					this.elemC.appendChild(document.createElement('span'));
				}
				// Élément img
				// # <img src="{url}" width="{infoPhoto.width}" height="{infoPhoto.height}" class="loading" id="topho" />
				else {
					this.elemC = document.createElement('img');
					this.elemC.setAttribute('width', infoPhoto.width);
					this.elemC.setAttribute('height', infoPhoto.height);
					this.elemC.setAttribute('class', 'loading');
					this.elemC.setAttribute('id', 'topho');
				}

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

			// *** Élément dd (définition) **************** //
			this.elemB = document.createElement('dd');

				// Élément span
				// # <span>{infoPhoto.id/name} ({date})</span>
				if ((name !== 'false') || (date !== 'false')) {

					this.elemC = document.createElement('span');

					// manual name + date
					if ((name !== 'false') && (name !== 'auto') && (date !== 'false'))
						this.elemC.appendChild(document.createTextNode(name + ' (' + date + ')'));

					// manual name
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
				// # <a href="{config.dialogue.filePhoto}?id={infoPhoto.id}" type="{infoPhoto.mime}" class="download">{i18n.downloadLink}</a>
				if (config.dialogue.savePhoto) {

					this.elemC = document.createElement('a');
					this.elemC.setAttribute('href', config.dialogue.filePhoto + '?id=' + infoPhoto.id);
					this.elemC.setAttribute('type', infoPhoto.mime);
					this.elemC.setAttribute('class', 'download');
					this.elemC.appendChild(document.createTextNode(i18n.translate('downloadLink')));

					this.elemB.appendChild(this.elemC);
				}

		this.elemA.appendChild(this.elemB);

		// Attache tous les éléments à la div box
		document.getElementById('box').appendChild(this.elemA);


		// *** Chargement de l'image ************************************** //
		if (config.navigator && config.dialogue.showLoader) {

			this.image = new Image(width, height);
			this.image.src = url;

			// eventListener:load
			this.image.addEventListener('load', function () {

				if (document.getElementById('topho')) {
					document.getElementById('topho').removeAttribute('class');
					document.getElementById('topho').setAttribute('src', TheDialogue.image.src);
				}
			}, false);

			// eventListener:error
			this.image.addEventListener('error', function () {

				if (document.getElementById('topho')) {

					// suppression des éléments a et span (photo redimensionnée)
					if (document.getElementById('topho').getAttribute('class').match(/resized/)) {

						var img = document.getElementById('topho').cloneNode(true);
						document.getElementById('topho').parentNode.parentNode.removeChild(document.getElementById('topho').parentNode);
						document.getElementById('box').firstChild.firstChild.appendChild(img);
					}

					// suppression du lien de téléchargement
					if (config.dialogue.savePhoto)
						document.getElementById('box').firstChild.lastChild.removeChild(document.getElementById('box').firstChild.lastChild.lastChild);

					document.getElementById('topho').setAttribute('class', 'error_' + config.lang);
				}
			}, false);
		}
		else {
			document.getElementById('topho').removeAttribute('class');
			document.getElementById('topho').setAttribute('src', url);
		}
	};


	// #### Vidéo et légende ############################################### i18n ## private ### //
	// = révision : 64
	// » Met en place la vidéo et la légende du dialogue vidéo
	// » Redimensionne la vidéo en fonction de la taille de la fenêtre lorsque nécessaire
	// » Dans le cas où la balise vidéo du standard HTML 5 n'est pas gérée par le navigateur rien ne s'affichera
	// » Affiche un lien pour télécharger la vidéo si la config le permet
	// # <dl>
	// #  <dt>
	// #    <video src="{url}" width="{infoVideo.width}" height="{infoVideo.height}" controls="controls" [autoplay="autoplay"] />
	// #  </dt>
	// #  <dd>
	// #    [<span>{infoVideo.id/name} ({date})</span>] {legend}
	// #    [<a href="{config.dialogue.fileVideo}?id={infoVideo.id}" type="{infoVideo.mime}" class="download">{i18n.downloadLink}</a>]
	// #  </dd>
	// # </dl>
	this.htmlVideo = function (url, name, date, legend) {

		// Vérification des dimensions
		var infoVideo = this.setSize(config.dialogue.videoWidth, config.dialogue.videoHeight, url);

		// Élément dl
		this.elemA = document.createElement('dl');

			// *** Élément dt (terme) ********************* //
			this.elemB = document.createElement('dt');

				// Élément video
				this.elemC = document.createElement('video');
				this.elemC.setAttribute('src', url);
				this.elemC.setAttribute('width', infoVideo.width);
				this.elemC.setAttribute('height', infoVideo.height);
				this.elemC.setAttribute('controls', 'controls');

				if (config.dialogue.autoplay)
					this.elemC.setAttribute('autoplay', 'autoplay');

			this.elemB.appendChild(this.elemC);

		this.elemA.appendChild(this.elemB);

			// *** Élément dd (définition) **************** //
			this.elemB = document.createElement('dd');

				// Élément span
				// # <span>{infoVideo.id/name} ({date})</span>
				if ((name !== 'false') || (date !== 'false')) {

					this.elemC = document.createElement('span');

					// manual name + date
					if ((name !== 'false') && (name !== 'auto') && (date !== 'false'))
						this.elemC.appendChild(document.createTextNode(name + ' (' + date + ')'));

					// manual name
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
				// # <a href="{config.dialogue.fileVideo}?id={infoVideo.id}" type="{infoVideo.mime}" class="download">{i18n.downloadLink}</a>
				if (config.dialogue.saveVideo) {

					this.elemC = document.createElement('a');
					this.elemC.setAttribute('href', config.dialogue.fileVideo + '?id=' + infoVideo.id);
					this.elemC.setAttribute('type', infoVideo.mime);
					this.elemC.setAttribute('class', 'download');
					this.elemC.appendChild(document.createTextNode(i18n.translate('downloadLink')));

					this.elemB.appendChild(this.elemC);
				}

		this.elemA.appendChild(this.elemB);

		// Attache tous les éléments à la div box
		document.getElementById('box').appendChild(this.elemA);
	};
}
