/**
 * Created J/13/05/2010
 * Updated D/24/10/2010
 * Version 12
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

function Slideshow() {

	// Gestion d'un diaporama photo/vidéo avec prise en charge du contrôle au clavier
	// Deux modes d'affichage : normal et présentation (détection automatique)
	// » Touche Échap pour quitter
	// » Touche Début pour passer à la première photo/vidéo
	// » Touche Gauche pour passer à la photo/vidéo précédente
	// » Touche Droite pour passer à la photo/vidéo suivante
	// » Touche Fin pour passer à la dernière photo/vidéo

	// Tout est automatique mais il faut respecter la structure du code HTML suivant.
	// # <div id="diaporama.0">
	// #  <a href="./photo/azerty.jpg" type="image/jpeg" id="diaporama.0.0">
	// #    <img src="./thumbnail/azerty.jpg" width="200" height="150" alt="width|height|name|date|legend" />
	// #  </a>
	// #  <a href="./photo/qsdfgh.jpg" type="image/jpeg" id="diaporama.0.1">
	// #    <img src="./thumbnail/qsdfgh.jpg" width="200" height="150" alt="width|height|name|date|legend" />
	// #  </a>
	// #  <a href="./video/wxcvbn.ogv" type="video/ogg" id="diaporama.0.2">
	// #    <img src="./thumbnail/wxcvbn.jpg" width="200" height="150" alt="name|date|legend" />
	// #  </a>
	// # </div>

	// Même chose mais pour le mode présentation.
	// # <div id="diaporama.0">
	// #  <a href="./photo/azerty.jpg" type="image/jpeg" id="diaporama.0.999">
	// #    <img src="./thumb300/azerty.jpg" width="300" height="225" alt="width|height|name|date|legend" />
	// #  </a>
	// #  <a href="./photo/azerty.jpg" type="image/jpeg" id="diaporama.0.0">
	// #    <img src="./thumb100/azerty.jpg" width="100" height="75" alt="./thumb300/azerty.jpg|width|height|name|date|legend" />
	// #  </a>
	// #  <a href="./photo/qsdfgh.jpg" type="image/jpeg" id="diaporama.0.1">
	// #    <img src="./thumb100/qsdfgh.jpg" width="100" height="75" alt="./thumb300/qsdfgh.jpg|width|height|name|date|legend" />
	// #  </a>
	// #  <a href="./video/wxcvbn.ogv" type="video/ogg" id="diaporama.0.2">
	// #    <img src="./thumb100/wxcvbn.jpg" width="100" height="75" alt="./thumb300/wxcvbn.jpg|name|date|legend" />
	// #  </a>
	// # </div>

	// définition des attributs
	this.media = null;
	this.totals = null;
	this.presentation = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DU DIAPORAMA (5)

	// #### Initialisation ########################################################## public ### //
	// = révision : 7
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

				// eventListener:click
				if (config.navigator)
					document.getElementById(id).addEventListener('click', TheSlideshow.showMedia, false);
				else
					document.getElementById(id).setAttribute('onclick', "TheSlideshow.showMedia(this.getAttribute('id')); return false;");
			}

			// *** Recherche des éléments de l'album *********** //
			for (j = 0; document.getElementById(config.slideshow.ids + '.' + i + '.' + j) !== null; j++) {

				id = config.slideshow.ids + '.' + i + '.' + j;

				if (config.navigator) {
					// eventListener:click et eventListener:mouseover
					if (config.slideshow.hoverload && (this.presentation[i] !== false)) {
						document.getElementById(id).addEventListener('click', TheSlideshow.showMedia, false);
						document.getElementById(id).addEventListener('mouseover', TheSlideshow.showMedia, false);
					}
					// eventListener:click
					else {
						document.getElementById(id).addEventListener('click', TheSlideshow.showMedia, false);
					}
				}
				else {
					// onclick et onmouseover
					if (config.slideshow.hoverload && (this.presentation[i] !== false)) {
						document.getElementById(id).setAttribute('onclick', "TheSlideshow.showMedia(this.getAttribute('id')); return false;");
						document.getElementById(id).setAttribute('onmouseover', "TheSlideshow.showMedia(this.getAttribute('id')); return false;");
					}
					// onclick
					else {
						document.getElementById(id).setAttribute('onclick', "TheSlideshow.showMedia(this.getAttribute('id')); return false;");
					}
				}

				this.totals[i] = j;
			}
		}
	};


	// #### Prépare l'affichage du dialogue ############## i18n ## event ## debug ## private ### //
	// = révision : 30
	// » Recherche les informations de la photo ou de la vidéo à afficher
	// » En mode diaporama, déduit s'il faut mettre à jour l'image principale de l'album, s'il faut afficher un dialogue photo ou vidéo
	//  ou s'il faut mettre à jour les dialogues photo ou vidéo
	// » S'assure également de ne pas faire deux fois la même chose
	this.showMedia = function (ev) {

		// *** Recherche des informations *********************** //
		var thisMedia = { id: null, url: null, alt: null, num: 0, name: null, date: null, legend: null, width: null, height: null }, tmp = null;

		if (typeof ev !== 'string') {
			ev.preventDefault();
			thisMedia.id  = this.getAttribute('id');
			thisMedia.url = this.getAttribute('href');
			thisMedia.alt = this.firstChild.getAttribute('alt').split('|');

			tmp = thisMedia.id.split('.');
			thisMedia.album = parseInt(tmp[1], 10);
			thisMedia.number = parseInt(tmp[2], 10);
		}
		else {
			thisMedia.id  = ev;
			thisMedia.url = document.getElementById(thisMedia.id).getAttribute('href');
			thisMedia.alt = document.getElementById(thisMedia.id).firstChild.getAttribute('alt').split('|');

			tmp = thisMedia.id.split('.');
			thisMedia.album = parseInt(tmp[1], 10);
			thisMedia.number = parseInt(tmp[2], 10);
		}

		// *** Affichage du dialogue (mode présentation) ******** //
		if ((TheSlideshow.presentation[thisMedia.album] !== false) && ((thisMedia.alt.length > 1) || (thisMedia.alt.length < 7))) {

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
			if ((TheDialogue.dialogue === null) && ((thisMedia.alt.length === 6) || (thisMedia.alt.length === 4)))
				TheSlideshow.updatePresentation(thisMedia);

			// affichage du dialogue
			// clique sur l'image principale
			else if ((TheDialogue.dialogue === null) && ((thisMedia.alt.length === 5) || (thisMedia.alt.length === 3))) {
				thisMedia.number = TheSlideshow.presentation[thisMedia.album];
				TheSlideshow.showDialogue(thisMedia);
			}

			// changement de photo ou de vidéo depuis le dialogue
			// touches droite gauche début fin et boutons précédent suivant
			else {
				TheSlideshow.updatePresentation(thisMedia);
				TheSlideshow.showDialogue(thisMedia);
			}
		}

		// *** Affichage du dialogue **************************** //
		else if ((thisMedia.alt.length === 5) || (thisMedia.alt.length === 3))
			TheSlideshow.showDialogue(thisMedia);

		// *** Message de debug ********************************* //
		else if (config.debug)
			TheDialogue.dialogInformation(i18n.translate('debugInvalidUse'), 'TheSlideshow » showMedia[br]' + i18n.translate('debugNotRecognizedAltAttribute'));
	};


	// #### Gestion du mode présentation ########################## i18n ## debug ## private ### //
	// = révision : 5
	// » Extrait et vérifie les données nécessaires à la modification des attributs de l'image principale de l'album
	// » Se base sur le lien de l'image qui vient d'être cliqué ou survolé
	// » Ajoute l'attribut class actif sur l'image du lien en question
	// » Enregistre le numéro de l'image en question
	this.updatePresentation = function (thisMedia) {

		var id = null, tag = null, i = 0;

		// *** Image principale (photo) ************************* //
		if ((thisMedia.alt.length === 6) && (thisMedia.alt[0].length > 0) && (thisMedia.alt[1].length > 0) &&
		    (thisMedia.alt[2].length > 0) && (thisMedia.alt[3].length > 0) && (thisMedia.alt[4].length > 0)) {

			// mise à jour des attributs
			id = config.slideshow.ids + '.' + thisMedia.album;
			document.getElementById(id + '.999').setAttribute('href', document.getElementById(thisMedia.id).getAttribute('href'));
			document.getElementById(id + '.999').firstChild.setAttribute('src', thisMedia.alt.shift());
			document.getElementById(id + '.999').firstChild.setAttribute('alt', thisMedia.alt.join('|'));

			// class actif
			for (tag = document.getElementById(id).getElementsByTagName('img'), i = 0; i < tag.length; i++) {

				if (config.navigator && tag[i].hasAttribute('class') && (tag[i].getAttribute('class') === 'actif'))
					tag[i].removeAttribute('class');

				else if (tag[i].className === 'actif')
					tag[i].className = '';
			}

			document.getElementById(thisMedia.id).firstChild.setAttribute('class', 'actif');
			this.presentation[thisMedia.album] = thisMedia.number;
		}

		// *** Message de debug ********************************* //
		else if (config.debug && (thisMedia.alt.length === 6)) {

			TheDialogue.dialogInformation(i18n.translate('debugInvalidAltAttribute'), 'TheSlideshow » changePhoto[br]➩ (string) url : ' + thisMedia.alt[0] + '[br]➩ (number) width : ' + thisMedia.alt[1] + '[br]➩ (number) height : ' + thisMedia.alt[2] + '[br]➩ (string) date : ' + thisMedia.alt[3] + '[br]➩ (string) legend : ' + thisMedia.alt[4]);
		}

		// *** Image principale (vidéo) ************************* //
		else if ((thisMedia.alt.length === 4) && (thisMedia.alt[0].length > 0) && (thisMedia.alt[1].length > 0) &&
		         (thisMedia.alt[2].length > 0)) {

			// mise à jour des attributs
			id = config.slideshow.ids + '.' + thisMedia.album;
			document.getElementById(id + '.999').setAttribute('href', document.getElementById(thisMedia.id).getAttribute('href'));
			document.getElementById(id + '.999').firstChild.setAttribute('src', thisMedia.alt.shift());
			document.getElementById(id + '.999').firstChild.setAttribute('alt', thisMedia.alt.join('|'));

			// class actif
			for (tag = document.getElementById(id).getElementsByTagName('img'), i = 0; i < tag.length; i++) {

				if (config.navigator && tag[i].hasAttribute('class') && (tag[i].getAttribute('class') === 'actif'))
					tag[i].removeAttribute('class');

				else if (tag[i].className === 'actif')
					tag[i].className = '';
			}

			document.getElementById(thisMedia.id).firstChild.setAttribute('class', 'actif');
			this.presentation[thisMedia.album] = thisMedia.number;
		}

		// *** Message de debug ********************************* //
		else if (config.debug && (thisMedia.alt.length === 4)) {

			TheDialogue.dialogInformation(i18n.translate('debugInvalidAltAttribute'), 'TheSlideshow » changePhoto[br]➩ (string) url : ' + thisMedia.alt[0] + '[br]➩ (string) date : ' + thisMedia.alt[1] + '[br]➩ (string) legend : ' + thisMedia.alt[2]);
		}
	};


	// #### Affichage du dialogue ################################# i18n ## debug ## private ### //
	// = révision : 8
	// » Extrait et vérifie les données nécessaires à l'affichage de la photo ou vidéo
	// » Affiche une photo ou une vidéo grâce au dialogue photo ou vidéo de [TheDialogue]
	// » Dans tout les cas remplace l'ancien dialogue par un nouveau dialogue
	this.showDialogue = function (thisMedia) {

		// *** Dialogue photo *********************************** //
		if ((thisMedia.alt.length === 5) && (thisMedia.alt[0].length > 0) && (thisMedia.alt[1].length > 0) &&
		    (thisMedia.alt[2].length > 0) && (thisMedia.alt[3].length > 0)) {

			// extraction des données
			thisMedia.name   = thisMedia.alt[2];
			thisMedia.date   = thisMedia.alt[3];
			thisMedia.legend = thisMedia.alt[4];
			thisMedia.width  = parseInt(thisMedia.alt[0], 10);
			thisMedia.height = parseInt(thisMedia.alt[1], 10);

			// suppression de l'ancien dialogue
			if (TheDialogue.dialogue !== null)
				TheDialogue.actionClose(false);

			// mise en place du dialogue photo
			TheDialogue.dialogPhoto(thisMedia.width, thisMedia.height, thisMedia.url, thisMedia.name, thisMedia.date, thisMedia.legend);
			this.showNavigation(thisMedia.album, thisMedia.number);

			// mise à jour de l'arrière plan
			if (config.navigator && config.slideshow.hiddenPage && (TheDialogue.dialogue === 'photo') &&
			    !document.getElementById('dialogue').hasAttribute('class'))
				document.getElementById('dialogue').setAttribute('class', 'norgba');

			else if (config.slideshow.hiddenPage && (TheDialogue.dialogue === 'photo') &&
			         (document.getElementById('dialogue').className !== 'norgba'))
				document.getElementById('dialogue').setAttribute('class', 'norgba');
		}

		// *** Message de debug ********************************* //
		else if (config.debug && (thisMedia.alt.length === 5)) {

			TheDialogue.dialogInformation(i18n.translate('debugInvalidAltAttribute'), 'TheSlideshow » showMedia[br]➩ (number) width : ' + thisMedia.alt[0] + '[br]➩ (number) height : ' + thisMedia.alt[1] + '[br]➩ (string) date : ' + thisMedia.alt[2] + '[br]➩ (string) legend : ' + thisMedia.alt[3]);
		}

		// *** Dialogue vidéo *********************************** //
		else if ((thisMedia.alt.length === 3) && (thisMedia.alt[0].length > 0) && (thisMedia.alt[1].length > 0)) {

			// extraction des données
			thisMedia.name   = thisMedia.alt[0];
			thisMedia.date   = thisMedia.alt[1];
			thisMedia.legend = thisMedia.alt[2];

			// suppression de l'ancien dialogue
			if (TheDialogue.dialogue !== null)
				TheDialogue.actionClose(false);

			// mise en place du dialogue vidéo
			TheDialogue.dialogVideo(thisMedia.url, thisMedia.name, thisMedia.date, thisMedia.legend);
			this.showNavigation(thisMedia.album, thisMedia.number);

			// mise à jour de l'arrière plan
			if (config.navigator && config.slideshow.hiddenPage && (TheDialogue.dialogue === 'video') &&
			    !document.getElementById('dialogue').hasAttribute('class'))
				document.getElementById('dialogue').setAttribute('class', 'norgba');

			else if (config.slideshow.hiddenPage && (TheDialogue.dialogue === 'video') &&
			         (document.getElementById('dialogue').className !== 'norgba'))
				document.getElementById('dialogue').setAttribute('class', 'norgba');
		}

		// *** Message de debug ********************************* //
		else if (config.debug && (thisMedia.alt.length === 3)) {

			TheDialogue.dialogInformation(i18n.translate('debugInvalidAltAttribute'), 'TheSlideshow » showMedia[br]➩ (string) date : ' + thisMedia.alt[0] + '[br]➩ (string) legend : ' + thisMedia.alt[1]);
		}
	};


	// #### Affichage des boutons de navigation #################################### private ### //
	// = révision : 20
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

	// #### Action de la touche début ################################### event ## protected ### //
	// = révision : 3
	// » Affiche la première photo ou vidéo
	// » En provenance de la touche début
	this.actionFirst = function () {

		if ((this.media !== null) && (this.media.number > 0) && (this.media.number <= this.totals[this.media.album]))
			this.showMedia(this.media.first);
	};


	// #### Action du bouton Précédent ################################## event ## protected ### //
	// = révision : 13
	// » Affiche la photo ou vidéo précédente
	// » En provenance du dialogue photo/vidéo ou de la touche gauche
	this.actionPrev = function () {

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
