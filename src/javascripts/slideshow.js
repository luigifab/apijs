/**
 * Created J/13/05/2010
 * Updated S/02/02/2013
 * Version 26
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

apijs.core.slideshow = function () {

	// définition des attributs
	this.currentMedia = { album: null, number: null, first: null, prev: null, next: null, last: null };
	this.gallery = [];
	this.totals = [];


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DU DIAPORAMA (4)

	// #### Initialisation ########################################################## public ### //
	// = révision : 20
	// » Recherche les albums et les photos et vidéos de chaque album
	// » Met en place les gestionnaires d'événements associés lorsque nécessaire
	// » Seul les albums en mode présentation réagiront au survol si la configuration le permet
	// » Enregistre le numéro du dernier élément de chaque album et si l'album est en mode présentation ou pas
	this.init = function () {

		var i, j, id, hoverload = false;

		for (i = 0; document.getElementById(apijs.config.slideshow.ids + '.' + i) !== null; i++) {

			hoverload = (document.getElementById(apijs.config.slideshow.ids + '.' + i).getAttribute('class').indexOf('hoverload') > -1);

			// *** Détection du mode présentation ************** //
			id = apijs.config.slideshow.ids + '.' + i + '.999';

			if (document.getElementById(id)) {

				// eventListener:click
				if (apijs.config.navigator) {
					document.getElementById(id).addEventListener('click', apijs.slideshow.showMedia.bind(this), false);
				}
				// onclick
				else {
					document.getElementById(id).setAttribute('onclick', "apijs.slideshow.showMedia(this.getAttribute('id')); return false;");
				}

				this.gallery[i] = 0;
			}
			else {
				this.gallery[i] = false;
			}

			// *** Recherche des éléments de l'album *********** //
			for (j = 0; document.getElementById(apijs.config.slideshow.ids + '.' + i + '.' + j) !== null; j++) {

				id = apijs.config.slideshow.ids + '.' + i + '.' + j;

				if (apijs.config.navigator) {
					// eventListener:click et eventListener:mouseover
					if (hoverload && (this.gallery[i] !== false)) {
						document.getElementById(id).addEventListener('click', apijs.slideshow.showMedia.bind(this), false);
						document.getElementById(id).addEventListener('mouseover', apijs.slideshow.showMedia.bind(this), false);
					}
					// eventListener:click
					else {
						document.getElementById(id).addEventListener('click', apijs.slideshow.showMedia.bind(this), false);
					}
				}
				else {
					// onclick et onmouseover
					if (hoverload && (this.gallery[i] !== false)) {
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
	// = révision : 46
	// » Recherche les informations de la photo ou de la vidéo à afficher
	// » En mode diaporama, déduit s'il faut mettre à jour l'image principale de l'album, s'il faut afficher un dialogue photo ou vidéo
	//  ou s'il faut mettre à jour les dialogues photo ou vidéo
	// » S'assure également de ne pas faire deux fois la même chose
	this.showMedia = function (ev) {

		// *** Recherche des informations *********************** //
		var media = { num: 0, id: null, url: null, conf: null, name: null, date: null, legend: null, width: null, height: null, classNames: '' },
		    tmp = null;

		if (typeof ev !== 'string') {
			ev.preventDefault();
			media.id  = ev.target.parentNode.getAttribute('id');
			media.url = ev.target.parentNode.getAttribute('href');
			media.alt = ev.target.getAttribute('alt');
			media.conf = ev.target.parentNode.querySelector('input').getAttribute('value').split('|');
			media.classNames = document.getElementById(media.id.slice(0, media.id.lastIndexOf('.'))).getAttribute('class');

			tmp = media.id.split('.');
			media.album = parseInt(tmp[1], 10);
			media.number = parseInt(tmp[2], 10);
		}
		else {
			media.id  = ev;
			media.url = document.getElementById(media.id).getAttribute('href');
			media.alt = document.getElementById(media.id).querySelector('img').getAttribute('alt');
			media.conf = document.getElementById(media.id).querySelector('input').getAttribute('value').split('|');
			media.classNames = document.getElementById(media.id.slice(0, media.id.lastIndexOf('.'))).getAttribute('class');

			tmp = media.id.split('.');
			media.album = parseInt(tmp[1], 10);
			media.number = parseInt(tmp[2], 10);
		}

		media.classNames = media.classNames.replace('gallery', 'slideshow').replace('album', 'slideshow');

		// *** Affichage du dialogue (mode présentation) ******** //
		if ((this.gallery[media.album] !== false) && ((media.conf.length > 1) || (media.conf.length < 7))) {

			// annulation si l'élément possède la class actif (survol ou clic)
			if ((typeof ev !== 'string') && ev.target.hasAttribute('class') && (ev.target.getAttribute('class').indexOf('actif') > -1))
				return;

			// mise à jour de l'image principale (survol ou clic)
			if ((apijs.dialog.classNames === null) && ((media.conf.length === 6) || (media.conf.length === 4))) {
				this.updategallery(media);
			}

			// affichage du dialogue (clic sur l'image principale)
			else if ((apijs.dialog.classNames === null) && ((media.conf.length === 5) || (media.conf.length === 3))) {
				media.number = this.gallery[media.album];
				this.showDialog(media);
			}

			// changement de photo ou de vidéo depuis le dialogue
			// touches droite gauche début fin et boutons précédent suivant
			else {
				this.updategallery(media);
				this.showDialog(media);
			}
		}

		// *** Affichage du dialogue **************************** //
		else if ((media.conf.length === 5) || (media.conf.length === 3))
			this.showDialog(media);

		// *** Message de debug ********************************* //
		else if (apijs.config.debug)
			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidUse'), '[pre]TheSlideshow » showMedia[br]' + apijs.i18n.translate('debugNotRecognizedConfig') + '[/pre]');
	};


	// #### Gestion du mode présentation ########################## i18n ## debug ## private ### //
	// = révision : 23
	// » Extrait et vérifie les données nécessaires à la modification des attributs de l'image principale de l'album
	// » Se base sur le lien de l'image et l'image qui viennent d'être cliqué ou survolé
	// » Ajoute l'attribut class actif sur l'image du lien en question
	// » Enregistre le numéro de l'image en question
	this.updategallery = function (media) {

		var id = null, tag = null, i = 0;

		// *** Image principale (photo) ************************* //
		if ((media.conf.length === 6) && (media.conf[0].length > 0) && (media.conf[1].length > 0) && (media.conf[2].length > 0) &&
		    (media.conf[3].length > 0) && (media.conf[4].length > 0)) {

			// mise à jour des attributs
			id = apijs.config.slideshow.ids + '.' + media.album;
			document.getElementById(id + '.999').setAttribute('href', document.getElementById(media.id).getAttribute('href'));
			document.getElementById(id + '.999').querySelector('img').setAttribute('alt', media.alt);
			document.getElementById(id + '.999').querySelector('img').setAttribute('src', media.conf.shift());
			document.getElementById(id + '.999').querySelector('input').setAttribute('value', media.conf.join('|'));

			// class actif
			for (tag = document.getElementById(id).querySelectorAll('img'), i = 0; i < tag.length; i++) {

				if (tag[i].hasAttribute('class') && (tag[i].getAttribute('class').indexOf('actif') > -1))
					tag[i].removeAttribute('class');
			}

			document.getElementById(media.id).querySelector('img').setAttribute('class', 'actif');
			this.gallery[media.album] = media.number;
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug && (media.conf.length === 6)) {

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidConfig'), '[pre]TheSlideshow » changePhoto[br]➩ (string) url : ' + media.conf[0] + '[br]➩ (number) width : ' + media.conf[1] + '[br]➩ (number) height : ' + media.conf[2] + '[br]➩ (string) date : ' + media.conf[3] + '[br]➩ (string) legend : ' + media.conf[4] + '[/pre]');
		}

		// *** Image principale (vidéo) ************************* //
		else if ((media.conf.length === 4) && (media.conf[0].length > 0) && (media.conf[1].length > 0) && (media.conf[2].length > 0)) {

			// mise à jour des attributs
			id = apijs.config.slideshow.ids + '.' + media.album;
			document.getElementById(id + '.999').setAttribute('href', document.getElementById(media.id).getAttribute('href'));
			document.getElementById(id + '.999').querySelector('img').setAttribute('alt', media.alt);
			document.getElementById(id + '.999').querySelector('img').setAttribute('src', media.conf.shift());
			document.getElementById(id + '.999').querySelector('input').setAttribute('value', media.conf.join('|'));

			// class actif
			for (tag = document.getElementById(id).querySelectorAll('img'), i = 0; i < tag.length; i++) {

				if (tag[i].hasAttribute('class') && (tag[i].getAttribute('class').indexOf('actif') > -1))
					tag[i].removeAttribute('class');
			}

			document.getElementById(media.id).querySelector('img').setAttribute('class', 'actif');
			this.gallery[media.album] = media.number;
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug && (media.conf.length === 4)) {

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidConfig'), '[pre]TheSlideshow » changePhoto[br]➩ (string) url : ' + media.conf[0] + '[br]➩ (string) date : ' + media.conf[1] + '[br]➩ (string) legend : ' + media.conf[2] + '[/pre]');
		}
	};


	// #### Affichage du dialogue ################################# i18n ## debug ## private ### //
	// = révision : 24
	// » Extrait et vérifie les données nécessaires à l'affichage de la photo ou vidéo
	// » Affiche une photo ou une vidéo grâce aux dialogues photo ou vidéo de [TheDialog]
	// » Dans tout les cas remplace l'ancien dialogue par un nouveau
	this.showDialog = function (media) {

		// *** Dialogue photo *********************************** //
		if ((media.conf.length === 5) && (media.conf[0].length > 0) && (media.conf[1].length > 0) && (media.conf[2].length > 0) &&
		    (media.conf[3].length > 0)) {

			// extraction des données
			media.name   = media.conf[2];
			media.date   = media.conf[3];
			media.legend = media.conf[4];
			media.width  = parseInt(media.conf[0], 10);
			media.height = parseInt(media.conf[1], 10);

			// mise en place du dialogue photo
			apijs.dialog.dialogPhoto(media.width, media.height, media.url, media.name, media.date, media.legend, media.classNames);
			this.showNavigation(media.album, media.number);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug && (media.conf.length === 5)) {

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidConfig'), '[pre]TheSlideshow » showMedia[br]➩ (number) width : ' + media.conf[0] + '[br]➩ (number) height : ' + media.conf[1] + '[br]➩ (string) date : ' + media.conf[2] + '[br]➩ (string) legend : ' + media.conf[3] + '[/pre]');
		}

		// *** Dialogue vidéo *********************************** //
		else if ((media.conf.length === 3) && (media.conf[0].length > 0) && (media.conf[1].length > 0)) {

			// extraction des données
			media.name   = media.conf[0];
			media.date   = media.conf[1];
			media.legend = media.conf[2];

			// mise en place du dialogue vidéo
			apijs.dialog.dialogVideo(media.url, media.name, media.date, media.legend, media.classNames);
			this.showNavigation(media.album, media.number);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug && (media.conf.length === 3)) {

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidConfig'), '[pre]TheSlideshow » showMedia[br]➩ (string) date : ' + media.conf[0] + '[br]➩ (string) legend : ' + media.conf[1] + '[/pre]');
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES ACTIONS DES BOUTONS ET DES TOUCHES DU CLAVIER (5)

	// #### Affichage des boutons de navigation #################################### private ### //
	// = révision : 28
	// » Affiche les boutons précédent et suivant lorsque nécessaire
	// » Vérifie au préalable s'il existe une photo ou vidéo précédente et s'il existe une photo ou vidéo suivante
	// » S'assure qu'un dialogue photo ou vidéo est présent avant de faire n'importe quoi
	this.showNavigation = function (album, number) {

		if ((apijs.dialog.classNames.indexOf('photo slideshow') > -1) || (apijs.dialog.classNames.indexOf('video slideshow') > -1)) {

			// préparation des variables
			this.currentMedia.album = album;
			this.currentMedia.number = number;

			this.currentMedia.first = apijs.config.slideshow.ids + '.' + this.currentMedia.album + '.0';
			this.currentMedia.prev  = apijs.config.slideshow.ids + '.' + this.currentMedia.album + '.' + (this.currentMedia.number - 1);
			this.currentMedia.next  = apijs.config.slideshow.ids + '.' + this.currentMedia.album + '.' + (this.currentMedia.number + 1);
			this.currentMedia.last  = apijs.config.slideshow.ids + '.' + this.currentMedia.album + '.' + this.totals[this.currentMedia.album];

			// bouton précédent
			if (document.getElementById(this.currentMedia.prev))
				document.getElementById('prev').removeAttribute('disabled');
			else
				this.currentMedia.prev = null;

			// bouton suivant
			if (document.getElementById(this.currentMedia.next))
				document.getElementById('next').removeAttribute('disabled');
			else
				this.currentMedia.next = null;
		}
	};


	// #### Action de la touche Début ###################################### event ## public ### //
	// = révision : 6
	// » Affiche la première photo ou vidéo
	// » En provenance de la touche début
	this.actionFirst = function () {

		if ((this.currentMedia !== null) && (this.currentMedia.number > 0) && (this.currentMedia.number <= this.totals[this.currentMedia.album]))
			this.showMedia(this.currentMedia.first);
	};


	// #### Action du bouton Précédent ##################################### event ## public ### //
	// = révision : 16
	// » Affiche la photo ou vidéo précédente
	// » En provenance du dialogue photo/vidéo ou de la touche gauche
	this.actionPrev = function () {

		if ((this.currentMedia !== null) && (this.currentMedia.prev !== null) && (this.currentMedia.number > 0))
			this.showMedia(this.currentMedia.prev);
	};


	// #### Action du bouton Suivant ####################################### event ## public ### //
	// = révision : 15
	// » Affiche la photo ou vidéo suivante
	// » En provenance du dialogue photo/vidéo ou de la touche droite
	this.actionNext = function () {

		if ((this.currentMedia !== null) && (this.currentMedia.next !== null) && (this.currentMedia.number < this.totals[this.currentMedia.album]))
			this.showMedia(this.currentMedia.next);
	};


	// #### Action de la touche Fin ######################################## event ## public ### //
	// = révision : 6
	// » Affiche la dernière photo ou vidéo
	// » En provenance de la touche fin
	this.actionLast = function () {

		if ((this.currentMedia !== null) && (this.currentMedia.number >= 0) && (this.currentMedia.number < this.totals[this.currentMedia.album]))
			this.showMedia(this.currentMedia.last);
	};
};