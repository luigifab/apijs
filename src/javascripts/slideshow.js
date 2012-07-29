/**
 * Created J/13/05/2010
 * Updated J/24/05/2012
 * Version 20
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

apijs.core.slideshow = function () {

	// définition des attributs
	this.presentation = null;
	this.totals = null;
	this.media = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DU DIAPORAMA (5)

	// #### Initialisation ########################################################## public ### //
	// = révision : 14
	// » Recherche les albums et les photos et vidéos de chaque album
	// » Met en place les gestionnaires d'événements associés lorsque nécessaire
	// » Seul les albums en mode présentation réagiront au survol si la config le permet
	// » Enregistre le numéro du dernier élément de chaque album
	// » Enregistre également si l'album est en mode présentation ou pas
	this.init = function () {

		this.media = { album: null, number: null, first: null, prev: null, next: null, last: null };
		this.presentation = [];
		this.totals = [];

		for (var i = 0, j = 0, id = null; document.getElementById(apijs.config.slideshow.ids + '.' + i) !== null; i++) {

			// *** Détection du mode présentation ************** //
			id = apijs.config.slideshow.ids + '.' + i + '.999';
			this.presentation[i] = (document.getElementById(id)) ? 0 : false;

			if (document.getElementById(id)) {

				// eventListener:click
				if (apijs.config.navigator)
					document.getElementById(id).addEventListener('click', apijs.slideshow.showMedia, false);
				else
					document.getElementById(id).setAttribute('onclick', "apijs.slideshow.showMedia(this.getAttribute('id')); return false;");
			}

			// *** Recherche des éléments de l'album *********** //
			for (j = 0; document.getElementById(apijs.config.slideshow.ids + '.' + i + '.' + j) !== null; j++) {

				id = apijs.config.slideshow.ids + '.' + i + '.' + j;

				if (apijs.config.navigator) {
					// eventListener:click et eventListener:mouseover
					if (apijs.config.slideshow.hoverload && (this.presentation[i] !== false)) {
						document.getElementById(id).addEventListener('click', apijs.slideshow.showMedia, false);
						document.getElementById(id).addEventListener('mouseover', apijs.slideshow.showMedia, false);
					}
					// eventListener:click
					else {
						document.getElementById(id).addEventListener('click', apijs.slideshow.showMedia, false);
					}
				}
				else {
					// onclick et onmouseover
					if (apijs.config.slideshow.hoverload && (this.presentation[i] !== false)) {
						document.getElementById(id).setAttribute('onclick', "apijs.slideshow.showMedia(this.getAttribute('id')); return false;");
						document.getElementById(id).setAttribute('onmouseover', "apijs.slideshow.showMedia(this.getAttribute('id')); return false;");
					}
					// onclick
					else {
						document.getElementById(id).setAttribute('onclick', "apijs.slideshow.showMedia(this.getAttribute('id')); return false;");
					}
				}

				this.totals[i] = j;
			}
		}
	};


	// #### Prépare l'affichage du dialogue ############## i18n ## event ## debug ## private ### //
	// = révision : 37
	// » Recherche les informations de la photo ou de la vidéo à afficher
	// » En mode diaporama, déduit s'il faut mettre à jour l'image principale de l'album, s'il faut afficher un dialogue photo ou vidéo
	//  ou s'il faut mettre à jour les dialogues photo ou vidéo
	// » S'assure également de ne pas faire deux fois la même chose
	this.showMedia = function (ev) {

		// *** Recherche des informations *********************** //
		var theMedia = { id: null, url: null, conf: null, num: 0, name: null, date: null, legend: null, width: null, height: null }, tmp = null;

		if (typeof ev !== 'string') {
			ev.preventDefault();
			theMedia.id  = this.getAttribute('id');
			theMedia.url = this.getAttribute('href');
			theMedia.conf = this.getElementsByTagName('input')[0].getAttribute('value').split('|');

			tmp = theMedia.id.split('.');
			theMedia.album = parseInt(tmp[1], 10);
			theMedia.number = parseInt(tmp[2], 10);
		}
		else {
			theMedia.id  = ev;
			theMedia.url = document.getElementById(theMedia.id).getAttribute('href');
			theMedia.conf = document.getElementById(theMedia.id).getElementsByTagName('input')[0].getAttribute('value').split('|');

			tmp = theMedia.id.split('.');
			theMedia.album = parseInt(tmp[1], 10);
			theMedia.number = parseInt(tmp[2], 10);
		}

		// *** Affichage du dialogue (mode présentation) ******** //
		if ((apijs.slideshow.presentation[theMedia.album] !== false) && ((theMedia.conf.length > 1) || (theMedia.conf.length < 7))) {

			// annulation si l'élément possède la classe actif
			// survol ou clic
			if ((typeof ev !== 'string') && this.getElementsByTagName('img')[0].hasAttribute('class') &&
			    (this.getElementsByTagName('img')[0].getAttribute('class').indexOf('actif') > -1))
				return;

			// mise à jour de l'image principale
			// survol ou clic
			if ((apijs.dialog.dialogType === null) && ((theMedia.conf.length === 6) || (theMedia.conf.length === 4))) {
				apijs.slideshow.updatePresentation(theMedia);
			}

			// affichage du dialogue
			// clic sur l'image principale
			else if ((apijs.dialog.dialogType === null) && ((theMedia.conf.length === 5) || (theMedia.conf.length === 3))) {
				theMedia.number = apijs.slideshow.presentation[theMedia.album];
				apijs.slideshow.showDialog(theMedia);
			}

			// changement de photo ou de vidéo depuis le dialogue
			// touches droite gauche début fin et boutons précédent suivant
			else {
				apijs.slideshow.updatePresentation(theMedia);
				apijs.slideshow.showDialog(theMedia);
			}
		}

		// *** Affichage du dialogue **************************** //
		else if ((theMedia.conf.length === 5) || (theMedia.conf.length === 3))
			apijs.slideshow.showDialog(theMedia);

		// *** Message de debug ********************************* //
		else if (apijs.config.debug)
			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidUse'), '[pre]TheSlideshow » showMedia[br]' + apijs.i18n.translate('debugNotRecognizedConfig') + '[/pre]');
	};


	// #### Gestion du mode présentation ########################## i18n ## debug ## private ### //
	// = révision : 16
	// » Extrait et vérifie les données nécessaires à la modification des attributs de l'image principale de l'album
	// » Se base sur le lien de l'image qui vient d'être cliqué ou survolé
	// » Ajoute l'attribut classe actif sur l'image du lien en question
	// » Enregistre le numéro de l'image en question
	this.updatePresentation = function (theMedia) {

		var id = null, tag = null, i = 0;

		// *** Image principale (photo) ************************* //
		if ((theMedia.conf.length === 6) && (theMedia.conf[0].length > 0) && (theMedia.conf[1].length > 0) && (theMedia.conf[2].length > 0) &&
		    (theMedia.conf[3].length > 0) && (theMedia.conf[4].length > 0)) {

			// mise à jour des attributs
			id = apijs.config.slideshow.ids + '.' + theMedia.album;
			document.getElementById(id + '.999').setAttribute('href', document.getElementById(theMedia.id).getAttribute('href'));
			document.getElementById(id + '.999').getElementsByTagName('img')[0].setAttribute('src', theMedia.conf.shift());
			document.getElementById(id + '.999').getElementsByTagName('input')[0].setAttribute('value', theMedia.conf.join('|'));

			// classe actif
			for (tag = document.getElementById(id).getElementsByTagName('img'), i = 0; i < tag.length; i++) {

				if (tag[i].hasAttribute('class') && (tag[i].getAttribute('class').indexOf('actif') > -1))
					tag[i].removeAttribute('class');
			}

			document.getElementById(theMedia.id).getElementsByTagName('img')[0].setAttribute('class', 'actif');
			this.presentation[theMedia.album] = theMedia.number;
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug && (theMedia.conf.length === 6)) {

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidConfig'), '[pre]TheSlideshow » changePhoto[br]➩ (string) url : ' + theMedia.conf[0] + '[br]➩ (number) width : ' + theMedia.conf[1] + '[br]➩ (number) height : ' + theMedia.conf[2] + '[br]➩ (string) date : ' + theMedia.conf[3] + '[br]➩ (string) legend : ' + theMedia.conf[4] + '[/pre]');
		}

		// *** Image principale (vidéo) ************************* //
		else if ((theMedia.conf.length === 4) && (theMedia.conf[0].length > 0) && (theMedia.conf[1].length > 0) &&
		         (theMedia.conf[2].length > 0)) {

			// mise à jour des attributs
			id = apijs.config.slideshow.ids + '.' + theMedia.album;
			document.getElementById(id + '.999').setAttribute('href', document.getElementById(theMedia.id).getAttribute('href'));
			document.getElementById(id + '.999').getElementsByTagName('img')[0].setAttribute('src', theMedia.conf.shift());
			document.getElementById(id + '.999').getElementsByTagName('input')[0].setAttribute('value', theMedia.conf.join('|'));

			// classe actif
			for (tag = document.getElementById(id).getElementsByTagName('img'), i = 0; i < tag.length; i++) {

				if (tag[i].hasAttribute('class') && (tag[i].getAttribute('class').indexOf('actif') > -1))
					tag[i].removeAttribute('class');
			}

			document.getElementById(theMedia.id).getElementsByTagName('img')[0].setAttribute('class', 'actif');
			this.presentation[theMedia.album] = theMedia.number;
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug && (theMedia.conf.length === 4)) {

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidConfig'), '[pre]TheSlideshow » changePhoto[br]➩ (string) url : ' + theMedia.conf[0] + '[br]➩ (string) date : ' + theMedia.conf[1] + '[br]➩ (string) legend : ' + theMedia.conf[2] + '[/pre]');
		}
	};


	// #### Affichage du dialogue ################################# i18n ## debug ## private ### //
	// = révision : 20
	// » Extrait et vérifie les données nécessaires à l'affichage de la photo ou vidéo
	// » Affiche une photo ou une vidéo grâce aux dialogues photo ou vidéo de [TheDialog]
	// » Dans tout les cas remplace l'ancien dialogue par un nouveau
	this.showDialog = function (theMedia) {

		// *** Dialogue photo *********************************** //
		if ((theMedia.conf.length === 5) && (theMedia.conf[0].length > 0) && (theMedia.conf[1].length > 0) && (theMedia.conf[2].length > 0) &&
		    (theMedia.conf[3].length > 0)) {

			// extraction des données
			theMedia.name   = theMedia.conf[2];
			theMedia.date   = theMedia.conf[3];
			theMedia.legend = theMedia.conf[4];
			theMedia.width  = parseInt(theMedia.conf[0], 10);
			theMedia.height = parseInt(theMedia.conf[1], 10);

			// suppression de l'ancien dialogue
			if (apijs.dialog.dialogType !== null)
				apijs.dialog.actionClose(false);

			// mise en place du dialogue photo
			apijs.dialog.dialogPhoto(theMedia.width, theMedia.height, theMedia.url, theMedia.name, theMedia.date, theMedia.legend, true);
			this.showNavigation(theMedia.album, theMedia.number);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug && (theMedia.conf.length === 5)) {

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidConfig'), '[pre]TheSlideshow » showMedia[br]➩ (number) width : ' + theMedia.conf[0] + '[br]➩ (number) height : ' + theMedia.conf[1] + '[br]➩ (string) date : ' + theMedia.conf[2] + '[br]➩ (string) legend : ' + theMedia.conf[3] + '[/pre]');
		}

		// *** Dialogue vidéo *********************************** //
		else if ((theMedia.conf.length === 3) && (theMedia.conf[0].length > 0) && (theMedia.conf[1].length > 0)) {

			// extraction des données
			theMedia.name   = theMedia.conf[0];
			theMedia.date   = theMedia.conf[1];
			theMedia.legend = theMedia.conf[2];

			// suppression de l'ancien dialogue
			if (apijs.dialog.dialogType !== null)
				apijs.dialog.actionClose(false);

			// mise en place du dialogue vidéo
			apijs.dialog.dialogVideo(theMedia.url, theMedia.name, theMedia.date, theMedia.legend, true);
			this.showNavigation(theMedia.album, theMedia.number);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug && (theMedia.conf.length === 3)) {

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidConfig'), '[pre]TheSlideshow » showMedia[br]➩ (string) date : ' + theMedia.conf[0] + '[br]➩ (string) legend : ' + theMedia.conf[1] + '[/pre]');
		}
	};


	// #### Affichage des boutons de navigation #################################### private ### //
	// = révision : 25
	// » Affiche les boutons précédent et suivant si nécessaire
	// » Vérifie au préalable s'il existe une photo ou vidéo précédente et s'il existe une photo ou vidéo suivante
	// » S'assure qu'un dialogue photo ou vidéo est présent avant de faire n'importe quoi
	this.showNavigation = function (album, number) {

		if ((apijs.dialog.dialogType.indexOf('photo') > -1) || (apijs.dialog.dialogType.indexOf('video') > -1)) {

			// préparation des variables
			this.media.album = album;
			this.media.number = number;

			this.media.first = apijs.config.slideshow.ids + '.' + this.media.album + '.0';
			this.media.prev  = apijs.config.slideshow.ids + '.' + this.media.album + '.' + (this.media.number - 1);
			this.media.next  = apijs.config.slideshow.ids + '.' + this.media.album + '.' + (this.media.number + 1);
			this.media.last  = apijs.config.slideshow.ids + '.' + this.media.album + '.' + this.totals[this.media.album];

			// bouton précédent
			if (document.getElementById(this.media.prev))
				document.getElementById('prev').removeAttribute('disabled');
			else
				this.media.prev = null;

			// bouton suivant
			if (document.getElementById(this.media.next))
				document.getElementById('next').removeAttribute('disabled');
			else
				this.media.next = null;
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES ACTIONS DES BOUTONS ET DES TOUCHES DU CLAVIER (4)

	// #### Action de la touche Début ###################################### event ## public ### //
	// = révision : 5
	// » Affiche la première photo ou vidéo
	// » En provenance de la touche début
	this.actionFirst = function () {

		if ((this.media !== null) && (this.media.number > 0) && (this.media.number <= this.totals[this.media.album]))
			this.showMedia(this.media.first);
	};


	// #### Action du bouton Précédent ##################################### event ## public ### //
	// = révision : 15
	// » Affiche la photo ou vidéo précédente
	// » En provenance du dialogue photo/vidéo ou de la touche gauche
	this.actionPrev = function () {

		if ((this.media !== null) && (this.media.prev !== null) && (this.media.number > 0))
			this.showMedia(this.media.prev);
	};


	// #### Action du bouton Suivant ####################################### event ## public ### //
	// = révision : 14
	// » Affiche la photo ou vidéo suivante
	// » En provenance du dialogue photo/vidéo ou de la touche droite
	this.actionNext = function () {

		if ((this.media !== null) && (this.media.next !== null) && (this.media.number < this.totals[this.media.album]))
			this.showMedia(this.media.next);
	};


	// #### Action de la touche Fin ######################################## event ## public ### //
	// = révision : 5
	// » Affiche la dernière photo ou vidéo
	// » En provenance de la touche fin
	this.actionLast = function () {

		if ((this.media !== null) && (this.media.number >= 0) && (this.media.number < this.totals[this.media.album]))
			this.showMedia(this.media.last);
	};
};