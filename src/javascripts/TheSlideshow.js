/**
 * Created J/13/05/2010
 * Updated L/16/08/2010
 * Version 10
 *
 * Copyright 2008-2010 | Fabrice Creuzot <contact@luigifab.info>
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

function Slideshow() {

	// Gestion d'un diaporama photo/vidéo avec prise en charge du contrôle au clavier
	// Deux modes disponibles : normal et présentation (détection automatique)
	// » Touche Échap pour quitter
	// » Touche Début pour passer à la première photo/vidéo
	// » Touche Gauche pour passer à la photo/vidéo précédente
	// » Touche Droite pour passer à la photo/vidéo suivante
	// » Touche Fin pour passer à la dernière photo/vidéo

	// Tout est automatique mais il faut respecter la structure du code HTML suivant :
	// # <div id="diaporama.0">
	// #  <a href="./photo/azerty.jpg" id="diaporama.0.0">
	// #    <img src="./thumbnail/azerty.jpg" width="200" height="150" alt="largeur|hauteur|date|légende" />
	// #  </a>
	// #  <a href="./photo/qsdfgh.jpg" id="diaporama.0.1">
	// #    <img src="./thumbnail/qsdfgh.jpg" width="200" height="150" alt="largeur|hauteur|date|légende" />
	// #  </a>
	// #  <a href="./video/wxcvbn.ogv" id="diaporama.0.2">
	// #    <img src="./thumbnail/wxcvbn.jpg" width="200" height="150" alt="date|légende" />
	// #  </a>
	// # </div>

	// Même chose pour le mode présentation :
	// # <div id="diaporama.0">
	// #  <a href="./photo/azerty.jpg" id="diaporama.0.999">
	// #    <img src="./thumbnail640/azerty.jpg" width="640" height="480" alt="largeur|hauteur|date|légende" />
	// #  </a>
	// #  <a href="./photo/azerty.jpg" id="diaporama.0.0">
	// #    <img src="./thumbnail200/azerty.jpg" width="200" height="150" alt="thumbnail640|largeur|hauteur|date|légende" />
	// #  </a>
	// #  <a href="./photo/qsdfgh.jpg" id="diaporama.0.1">
	// #    <img src="./thumbnail200/qsdfgh.jpg" width="200" height="150" alt="thumbnail640|largeur|hauteur|date|légende" />
	// #  </a>
	// #  <a href="./video/wxcvbn.ogv" id="diaporama.0.2">
	// #    <img src="./thumbnail200/wxcvbn.jpg" width="200" height="150" alt="thumbnail640|date|légende" />
	// #  </a>
	// # </div>

	// définition des attributs
	this.media = null;
	this.totals = null;
	this.presentation = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DU DIAPORAMA (5)

	// #### Initialisation ########################################################## public ### //
	// = révision : 6
	// » Recherche les albums et les photos et vidéos de chaque album
	// » Met en place les gestionnaires d'événements associés lorsque nécessaire (eventListener:click et eventListener:mouseover)
	// » Seul les albums en mode présentation réagiront au survol si la configuration l'autorise
	// » Enregistre le numéro du dernier élément de chaque album
	// » Enregistre également si l'album est en mode présentation ou pas
	this.init = function () {

		this.media = { album: null, number: null, first: null, prev: null, next: null, last: null };
		this.totals = [];
		this.presentation = [];

		for (var id = null, i = 0, j = 0; document.getElementById(config.slideshow.ids + '.' + i) !== null; i++) {

			// *** Détection du mode présentation ************** //
			id = config.slideshow.ids + '.' + i + '.999';
			this.presentation[i] = (document.getElementById(id)) ? 0 : false;

			if (document.getElementById(id)) {

				if (config.navigator)
					document.getElementById(id).addEventListener('click', TheSlideshow.showMedia, false);
				else
					document.getElementById(id).setAttribute('onclick', "TheSlideshow.showMedia(this.getAttribute('id')); return false;");
			}

			// *** Recherche des éléments de l'album *********** //
			for (j = 0; document.getElementById(config.slideshow.ids + '.' + i + '.' + j) !== null; j++) {

				id = config.slideshow.ids + '.' + i + '.' + j;

				if (config.navigator) {
					if (config.slideshow.hoverload && (this.presentation[i] !== false)) {
						document.getElementById(id).addEventListener('click', TheSlideshow.showMedia, false);
						document.getElementById(id).addEventListener('mouseover', TheSlideshow.showMedia, false);
					}
					else {
						document.getElementById(id).addEventListener('click', TheSlideshow.showMedia, false);
					}
				}
				else {
					if (config.slideshow.hoverload && (this.presentation[i] !== false)) {
						document.getElementById(id).setAttribute('onclick', "TheSlideshow.showMedia(this.getAttribute('id')); return false;");
						document.getElementById(id).setAttribute('onmouseover', "TheSlideshow.showMedia(this.getAttribute('id')); return false;");
					}
					else {
						document.getElementById(id).setAttribute('onclick', "TheSlideshow.showMedia(this.getAttribute('id')); return false;");
					}
				}

				this.totals[i] = j;
			}
		}
	};


	// #### Prépare l'affichage du dialogue photo ou vidéo ######## i18n ## debug ## private ### //
	// = révision : 26
	// » Recherche les informations de la photo ou de la vidéo à afficher
	// » Annule l'action par défaut lors d'un événement
	// » En mode diaporama, déduit s'il faut mettre à jour l'image principale de l'album, s'il faut afficher un dialogue photo
	//  ou vidéo ou s'il faut mettre à jour le dialogue photo ou vidéo, s'assure également de ne pas faire deux fois la même chose
	this.showMedia = function (ev) {

		// *** Recherche des informations *********************** //
		var currentMedia = { id: null, url: null, alt: null, num: 0, date: null, legend: null, width: null, height: null }, tmp = null;

		if (typeof ev !== 'string') {
			ev.preventDefault();
			currentMedia.id  = this.getAttribute('id');
			currentMedia.url = this.getAttribute('href');
			currentMedia.alt = this.firstChild.getAttribute('alt').split('|');

			tmp = currentMedia.id.split('.');
			currentMedia.album = parseInt(tmp[1], 10);
			currentMedia.number = parseInt(tmp[2], 10);
		}
		else {
			currentMedia.id  = ev;
			currentMedia.url = document.getElementById(currentMedia.id).getAttribute('href');
			currentMedia.alt = document.getElementById(currentMedia.id).firstChild.getAttribute('alt').split('|');

			tmp = currentMedia.id.split('.');
			currentMedia.album = parseInt(tmp[1], 10);
			currentMedia.number = parseInt(tmp[2], 10);
		}

		// *** Affichage du dialogue (mode présentation) ******** //
		if ((TheSlideshow.presentation[currentMedia.album] !== false) && ((currentMedia.alt.length > 1) || (currentMedia.alt.length < 6))) {

			// annulation si l'élément possède la class actif
			// survol ou clique
			if (typeof ev !== 'string') {

				if (config.navigator && this.firstChild.hasAttribute('class'))
					return;
				else if (!config.navigator && (this.firstChild.className !== ''))
					return;
			}

			// mise à jour de l'image principale
			// survol ou clique
			if ((TheDialogue.dialogue === null) && ((currentMedia.alt.length === 5) || (currentMedia.alt.length === 3)))
				TheSlideshow.updatePresentation(currentMedia);

			// affichage du dialogue
			// clique sur l'image principale
			else if ((TheDialogue.dialogue === null) && ((currentMedia.alt.length === 4) || (currentMedia.alt.length === 2))) {
				currentMedia.number = TheSlideshow.presentation[currentMedia.album];
				TheSlideshow.showDialogue(currentMedia);
			}

			// changement de média depuis le dialogue
			// touches droite gauche début fin et boutons précédent suivant
			else {
				TheSlideshow.updatePresentation(currentMedia);
				TheSlideshow.showDialogue(currentMedia);
			}
		}

		// *** Affichage du dialogue **************************** //
		else if ((currentMedia.alt.length === 4) || (currentMedia.alt.length === 2))
			TheSlideshow.showDialogue(currentMedia);

		// *** Message de debug ********************************* //
		else if (config.debug)
			TheDialogue.dialogInformation(i18n.translate('debugInvalidUse'), 'TheSlideshow » showMedia[br]' + i18n.translate('debugNotRecognizedAltAttribute'));
	};


	// #### Gestion du mode présentation ########################## i18n ## debug ## private ### //
	// = révision : 4
	// » Extrait et vérifie les données nécessaires à la modification des attributs de l'image principale de l'album
	// » Se base sur le lien de l'image qui vient d'être cliqué ou survolé
	// » Ajoute l'attribut class actif sur l'image du lien en question
	// » Enregistre le numéro de l'image en question
	this.updatePresentation = function (currentMedia) {

		var id = null, tag = null, i = 0;

		// *** Image principale (photo) ************************* //
		if ((currentMedia.alt.length === 5) && (currentMedia.alt[0].length > 0) && (currentMedia.alt[1].length > 0) &&
		    (currentMedia.alt[2].length > 0) && (currentMedia.alt[3].length > 0)) {

			// mise à jour des attributs
			id = config.slideshow.ids + '.' + currentMedia.album;
			document.getElementById(id + '.999').setAttribute('href', document.getElementById(currentMedia.id).getAttribute('href'));
			document.getElementById(id + '.999').firstChild.setAttribute('src', currentMedia.alt.shift());
			document.getElementById(id + '.999').firstChild.setAttribute('alt', currentMedia.alt.join('|'));

			// class actif
			for (tag = document.getElementById(id).getElementsByTagName('img'), i = 0; i < tag.length; i++) {

				if (config.navigator && tag[i].hasAttribute('class') && (tag[i].getAttribute('class') === 'actif'))
					tag[i].removeAttribute('class');

				else if (tag[i].className === 'actif')
					tag[i].className = '';
			}

			document.getElementById(currentMedia.id).firstChild.setAttribute('class', 'actif');
			this.presentation[currentMedia.album] = currentMedia.number;
		}

		// *** Message de debug ********************************* //
		else if (config.debug && (currentMedia.alt.length === 5)) {

			TheDialogue.dialogInformation(i18n.translate('debugInvalidAltAttribute'), 'TheSlideshow » changePhoto[br]➩ (string) url : ' + currentMedia.alt[0] + '[br]➩ (number) width : ' + currentMedia.alt[1] + '[br]➩ (number) height : ' + currentMedia.alt[2] + '[br]➩ (string) date : ' + currentMedia.alt[3] + '[br]➩ (string) legend : ' + currentMedia.alt[4]);
		}

		// *** Image principale (vidéo) ************************* //
		else if ((currentMedia.alt.length === 3) && (currentMedia.alt[0].length > 0) && (currentMedia.alt[1].length > 0)) {

			// mise à jour des attributs
			id = config.slideshow.ids + '.' + currentMedia.album;
			document.getElementById(id + '.999').setAttribute('href', document.getElementById(currentMedia.id).getAttribute('href'));
			document.getElementById(id + '.999').firstChild.setAttribute('src', currentMedia.alt.shift());
			document.getElementById(id + '.999').firstChild.setAttribute('alt', currentMedia.alt.join('|'));

			// class actif
			for (tag = document.getElementById(id).getElementsByTagName('img'), i = 0; i < tag.length; i++) {

				if (config.navigator && tag[i].hasAttribute('class') && (tag[i].getAttribute('class') === 'actif'))
					tag[i].removeAttribute('class');

				else if (tag[i].className === 'actif')
					tag[i].className = '';
			}

			document.getElementById(currentMedia.id).firstChild.setAttribute('class', 'actif');
			this.presentation[currentMedia.album] = currentMedia.number;
		}

		// *** Message de debug ********************************* //
		else if (config.debug && (currentMedia.alt.length === 3)) {

			TheDialogue.dialogInformation(i18n.translate('debugInvalidAltAttribute'), 'TheSlideshow » changePhoto[br]➩ (string) url : ' + currentMedia.alt[0] + '[br]➩ (string) date : ' + currentMedia.alt[1] + '[br]➩ (string) legend : ' + currentMedia.alt[2]);
		}
	};


	// #### Affichage de la photo ou vidéo ######################## i18n ## debug ## private ### //
	// = révision : 5
	// » Extrait et vérifie les données nécessaires à l'affichage de la photo ou vidéo
	// » Affiche une photo ou une vidéo grâce au dialogue photo ou vidéo de [TheDialogue]
	// » Dans tout les cas remplace l'ancien dialogue par un nouveau dialogue
	this.showDialogue = function (currentMedia) {

		// *** Dialogue photo *********************************** //
		if ((currentMedia.alt.length === 4) && (currentMedia.alt[0].length > 0) && (currentMedia.alt[1].length > 0) &&
		    (currentMedia.alt[2].length > 0)) {

			// extraction des données
			currentMedia.date   = currentMedia.alt[2];
			currentMedia.legend = currentMedia.alt[3];
			currentMedia.width  = parseInt(currentMedia.alt[0], 10);
			currentMedia.height = parseInt(currentMedia.alt[1], 10);

			// suppression de l'ancien dialogue
			if (TheDialogue.dialogue !== null)
				TheDialogue.actionExternal(false);

			// mise en place du dialogue photo
			TheDialogue.dialogPhoto(currentMedia.date, currentMedia.legend, currentMedia.url, currentMedia.width, currentMedia.height);
			this.showNavigation(currentMedia.album, currentMedia.number);

			// mise à jour de l'arrière plan
			if (config.navigator && config.dialogue.hiddenPage && (TheDialogue.dialogue === 'photo') &&
			    !document.getElementById('dialogue').hasAttribute('class'))
				document.getElementById('dialogue').setAttribute('class', 'norgba');

			else if (config.dialogue.hiddenPage && (TheDialogue.dialogue === 'photo') &&
			         (document.getElementById('dialogue').className !== 'norgba'))
				document.getElementById('dialogue').setAttribute('class', 'norgba');
		}

		// *** Message de debug ********************************* //
		else if (config.debug && (currentMedia.alt.length === 4)) {

			TheDialogue.dialogInformation(i18n.translate('debugInvalidAltAttribute'), 'TheSlideshow » showMedia[br]➩ (number) width : ' + currentMedia.alt[0] + '[br]➩ (number) height : ' + currentMedia.alt[1] + '[br]➩ (string) date : ' + currentMedia.alt[2] + '[br]➩ (string) legend : ' + currentMedia.alt[3]);
		}

		// *** Dialogue vidéo *********************************** //
		else if ((currentMedia.alt.length === 2) && (currentMedia.alt[0].length > 0)) {

			// extraction des données
			currentMedia.date   = currentMedia.alt[0];
			currentMedia.legend = currentMedia.alt[1];

			// suppression de l'ancien dialogue
			if (TheDialogue.dialogue !== null)
				TheDialogue.actionExternal(false);

			// mise en place du dialogue vidéo
			TheDialogue.dialogVideo(currentMedia.date, currentMedia.legend, currentMedia.url);
			this.showNavigation(currentMedia.album, currentMedia.number);

			// mise à jour de l'arrière plan
			if (config.navigator && config.dialogue.hiddenPage && (TheDialogue.dialogue === 'video') &&
			    !document.getElementById('dialogue').hasAttribute('class'))
				document.getElementById('dialogue').setAttribute('class', 'norgba');

			else if (config.dialogue.hiddenPage && (TheDialogue.dialogue === 'video') &&
			         (document.getElementById('dialogue').className !== 'norgba'))
				document.getElementById('dialogue').setAttribute('class', 'norgba');
		}

		// *** Message de debug ********************************* //
		else if (config.debug && (currentMedia.alt.length === 2)) {

			TheDialogue.dialogInformation(i18n.translate('debugInvalidAltAttribute'), 'TheSlideshow » showMedia[br]➩ (string) date : ' + currentMedia.alt[0] + '[br]➩ (string) legend : ' + currentMedia.alt[1]);
		}
	};


	// #### Affichage des boutons de navigation #################################### private ### //
	// = révision : 19
	// » Affiche les boutons précédent et suivant si nécessaire
	// » Vérifie au préalable s'il existe une photo ou vidéo précédente et s'il existe une photo ou vidéo suivante
	// » S'assure qu'un dialogue photo ou vidéo est présent avant de faire n'importe quoi
	this.showNavigation = function (album, number) {

		if ((TheDialogue.dialogue === 'photo') || (TheDialogue.dialogue === 'video')) {

			// préparation
			this.media.album = album;
			this.media.number = number;

			this.media.first = config.slideshow.ids + '.' + this.media.album + '.0';
			this.media.prev  = config.slideshow.ids + '.' + this.media.album + '.' + (this.media.number - 1);
			this.media.next  = config.slideshow.ids + '.' + this.media.album + '.' + (this.media.number + 1);
			this.media.last  = config.slideshow.ids + '.' + this.media.album + '.' + this.totals[this.media.album];

			// bouton précédent
			if (document.getElementById(this.media.prev))
				document.getElementById('previous').removeAttribute('disabled');
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
	// DÉFINITION DES ACTIONS DES BOUTONS ET DES TOUCHES (4)

	// #### Action de la touche début ################################### event ## protected ### //
	// = révision : 3
	// » Affiche la première photo ou vidéo
	// » En provenance de la touche début
	this.actionFirst = function () {

		if ((this.media !== null) && (this.media.number > 0) && (this.media.number <= this.totals[this.media.album]))
			this.showMedia(this.media.first);
	};


	// #### Action du bouton Précédent ################################## event ## protected ### //
	// = révision : 12
	// » Affiche la photo ou vidéo précédente
	// » En provenance du dialogue photo/vidéo ou de la touche gauche
	this.actionPrevious = function () {

		if ((this.media !== null) && (this.media.prev !== null) && (this.media.number > 0))
			this.showMedia(this.media.prev);
	};


	// #### Action du bouton Suivant #################################### event ## protected ### //
	// = révision : 12
	// » Affiche la photo ou vidéo suivante
	// » En provenance du dialogue photo/vidéo ou de la touche droite
	this.actionNext = function () {

		if ((this.media !== null) && (this.media.next !== null) && (this.media.number < this.totals[this.media.album]))
			this.showMedia(this.media.next);
	};


	// #### Action de la touche Fin ##################################### event ## protected ### //
	// = révision : 3
	// » Affiche la dernière photo ou vidéo
	// » En provenance de la touche fin
	this.actionLast = function () {

		if ((this.media !== null) && (this.media.number >= 0) && (this.media.number < this.totals[this.media.album]))
			this.showMedia(this.media.last);
	};
}
