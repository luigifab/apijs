"use strict";
/**
 * Created J/13/05/2010
 * Updated S/29/03/2014
 * Version 31
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

apijs.core.slideshow = function () {

	this.current = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DU DIAPORAMA

	// #### Initialisation ######################################################### private ### //
	// = révision : 26
	// » Recherche les albums puis les photos et vidéos de chaque album
	// » Met en place les gestionnaires d'événements associés (+click +mouseover)
	this.init = function () {

		var i, j, ids = apijs.config.slideshow.ids, hoverload = false;

		// recherche des albums
		for (i = 0; document.getElementById(ids + '.' + i) !== null; i++) {

			hoverload = (document.getElementById(ids + '.' + i).getAttribute('class').indexOf('hoverload') > -1);

			// recherche des éléments de l'album
			for (j = 0; document.getElementById(ids + '.' + i + '.' + j) !== null; j++) {
				document.getElementById(ids + '.' + i + '.' + j).addEventListener('click', apijs.slideshow.showMedia.bind(this), false);
				if (hoverload)
					document.getElementById(ids + '.' + i + '.' + j).addEventListener('mouseover', apijs.slideshow.showMedia.bind(this), false);
			}

			// recherche de l'élément du mode présentation de l'album
			if (document.getElementById(ids + '.' + i + '.999'))
				document.getElementById(ids + '.' + i + '.999').addEventListener('click', apijs.slideshow.showMedia.bind(this), false);
		}
	};


	// #### Prépare l'affichage du dialogue ############## event ## debug ## i18n ## private ### //
	// = révision : 78
	// » Recherche les informations de la photo ou de la vidéo à afficher
	// » En provenance du survol ou d'un clic sur une des miniatures d'un album, ou d'un appel direct
	// » S'assure de ne pas faire deux fois la même chose en mode présentation
	this.showMedia = function (ev) {

		var media = {}, source, realsource, mimetype;

		// *** Recherche de la source *************************** //
		if (typeof ev !== 'string') {

			ev.preventDefault();
			source = (ev.target.nodeName === 'A') ? ev.target : ev.target.parentNode;
			media.id = source.getAttribute('id');

			// stop sur miniature à jour en mode présentation
			if (source.hasAttribute('class') && (source.getAttribute('class').indexOf('current') > -1))
				return;
		}
		else {
			source = document.getElementById(ev);
			media.id = ev;
		}

		// *** Recherche des informations *********************** //
		// » DEUX MODES DE FONCTIONNEMENT
		// » avec le dossier web pour les photos ou vidéos optimisés pour le web
		// » avec le dossier thumb pour les miniatures
		// » avec le dossier preview pour les mini miniatures
		// = media.id = slideshow.X.Y  [0]=slideshow [1]=X [2]=Y
		// = media.config = name|date|legend  [0]=name [1]=date [2]=legend  (mode standard)
		// # <a href="./web/azerty.jpg" type="image/jpeg" id="slideshow.1.0">
		// #  <img src="./thumb/azerty.jpg" width="200" height="150" alt="legend" />
		// #  <input type="hidden" value="name|date|legend" />
		// # </a>
		// = media.config = thumb|name|date|legend  [0]=thumb/null [1]=name [2]=date [3]=legend  (mode présentation)
		// # <a href="./web/azerty.jpg" type="image/jpeg" id="slideshow.0.999">
		// #  <img src="./thumb/azerty.jpg" width="200" height="150" alt="legend" />
		// #  <input type="hidden" value="null|name|date|legend" />
		// # </a>
		// # <a href="./web/azerty.jpg" type="image/jpeg" id="slideshow.0.0">
		// #  <img src="./preview/azerty.jpg" width="63" height="47" alt="legend" class="current" />
		// #  <input type="hidden" value="./thumb/azerty.jpg|name|date|legend" />
		// # </a>
		media.prefix = apijs.config.slideshow.ids + '.' + media.id.split('.')[1];

		media.url    = source.getAttribute('href');
		media.config = source.querySelector('input').getAttribute('value').split('|');
		media.number = parseInt(media.id.split('.')[2], 10);

		media.styles = document.getElementById(media.prefix).getAttribute('class');
		media.styles = media.styles.replace(/gallery|album/g, 'slideshow');

		media.presentation = document.getElementById(media.prefix + '.999');

		// *** Affichage du dialogue **************************** //
		// » en mode présentation avec présence de l'image principale OU en mode standard
		if (((media.config.length === 4) && media.presentation) || (media.config.length === 3)) {

			// en mode présentation, met à jour l'image principale si son adresse est présente
			// - donc lorsque l'utilisateur vient de cliquer ou de survoler une miniature,
			// - ou lorsque l'utilisateur vient de changer de photo ou de vidéo via le dialogue du diaporama
			// enregistre l'id de l'image courante sur l'image principale
			var currentLink = document.getElementById(media.id),
			    currentImg = currentLink.querySelector('img'),
			    allImages = document.getElementById(media.prefix).querySelectorAll('img'), i;

			if ((media.config.length === 4) && (media.config[0] !== 'null')) {
				media.presentation.setAttribute('href', currentLink.getAttribute('href'));
				media.presentation.querySelector('img').setAttribute('src', media.config.shift());
				media.presentation.querySelector('img').setAttribute('alt', currentImg.getAttribute('alt'));
				media.presentation.querySelector('input').setAttribute('value', media.config.join('|'));
				media.presentation.setAttribute('class', currentLink.getAttribute('id'));
			}

			// ATTENTION : media.config.length se réduit à 3 élements
			if (media.config[0] === 'null')
				media.config.shift();

			// marque l'image active avec la class current
			if (currentImg && (media.number !== 999)) {
				for (i = 0; i < allImages.length; i++) {
					if (allImages[i].hasAttribute('class'))
						allImages[i].removeAttribute('class');
				}
				currentImg.setAttribute('class', 'current');
			}

			// recherche le type de dialogue grâce au type mime du lien de la miniature
			// en mode présentation :
			// - ne recherche pas le type mime si l'utilisateur n'est pas sur l'image principale OU s'il n'y a pas de dialogue actif
			// - autrement dit, uniquement lorsque l'utilisateur ne vient pas de cliquer ou de survoler une miniature du mode présentation
			// - sur l'image principale, recherche le numéro de la miniature (même s'il peut déjà être correct)
			// - la recherche consiste à trouver la miniature affichée dans l'image principale
			// en mode standard :
			// - fait une simple lecture
			if (media.presentation) {

				if (media.number === 999) {
					realsource   = document.getElementById((source.hasAttribute('class')) ? source.getAttribute('class') : media.prefix + '.0');
					mimetype     = realsource.getAttribute('type');
					media.number = parseInt(realsource.getAttribute('id').split('.')[2], 10);
				}
				else if ((apijs.dialog.styles !== null) && apijs.dialog.styles.has('slideshow')) {
					mimetype = document.getElementById(media.id).getAttribute('type');
				}
			}
			else {
				mimetype = source.getAttribute('type');
			}

			// affiche le dialogue lorsque le type de dialogue est défini,
			// - donc uniquement lorsque l'utilisateur ne vient pas de cliquer ou de survoler une miniature du mode présentation
			if (typeof mimetype === 'string') {
				media.type = mimetype.substr(0, 5).replace('image', 'dialogPhoto').replace('video', 'dialogVideo');
				this.showDialog(media);
			}
		}
		else {
			apijs.core.error('TheSlideshow.showMedia', 'debugInvalidUse', apijs.i18n.translate('debugUnknownConfig', media.config.join(' | ')));
		}
	};


	// #### Affichage du dialogue ################################################## private ### //
	// = révision : 40
	// » Affiche le dialogue et les boutons précédent et suivant
	// » Vérifie au préalable s'il existe une photo ou vidéo précédente et suivante
	// » S'assure qu'un dialogue du diaporama est présent avant de faire n'importe quoi
	this.showDialog = function (media) {

		apijs.dialog[media.type](media.url, media.config[0], media.config[1], media.config[2], media.styles);

		if ((apijs.dialog.styles !== null) && apijs.dialog.styles.has('slideshow')) {

			this.current = { number: media.number, first: null, prev: null, next: null, last: null, total: null };

			// recherche du nombre de miniature
			this.current.total = document.getElementById(media.prefix).querySelectorAll('a[id][type]').length - 1;
			this.current.total = (media.presentation) ? this.current.total - 1 : this.current.total;

			// préparation des variables
			this.current.first = media.prefix + '.0';
			this.current.prev  = (media.number > 0) ? media.prefix + '.' + (this.current.number - 1) : null;
			this.current.next  = (media.number < this.current.total) ? media.prefix + '.' + (this.current.number + 1) : null;
			this.current.last  = media.prefix + '.' +  this.current.total;

			// boutons précédent et suivant
			if (this.current.prev !== null)
				document.getElementById('apijsPrev').removeAttribute('disabled');

			if (this.current.next !== null)
				document.getElementById('apijsNext').removeAttribute('disabled');
		}
		else {
			this.current = null;
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES ACTIONS DES BOUTONS ET DES TOUCHES DU CLAVIER

	// #### Action de la touche Début ###################################### event ## public ### //
	// = révision : 10
	// » Affiche la première photo ou vidéo
	// » En provenance de la touche début
	this.actionFirst = function () {

		if ((this.current !== null) && (this.current.number > 0) && (this.current.number <= this.current.total))
			this.showMedia(this.current.first);
	};


	// #### Action du bouton Précédent ##################################### event ## public ### //
	// = révision : 20
	// » Affiche la photo ou vidéo précédente
	// » En provenance du dialogue photo/vidéo ou de la touche gauche
	this.actionPrev = function () {

		if ((this.current !== null) && (this.current.prev !== null) && (this.current.number > 0))
			this.showMedia(this.current.prev);
	};


	// #### Action du bouton Suivant ####################################### event ## public ### //
	// = révision : 20
	// » Affiche la photo ou vidéo suivante
	// » En provenance du dialogue photo/vidéo ou de la touche droite
	this.actionNext = function () {

		if ((this.current !== null) && (this.current.next !== null) && (this.current.number < this.current.total))
			this.showMedia(this.current.next);
	};


	// #### Action de la touche Fin ######################################## event ## public ### //
	// = révision : 10
	// » Affiche la dernière photo ou vidéo
	// » En provenance de la touche fin
	this.actionLast = function () {

		if ((this.current !== null) && (this.current.number >= 0) && (this.current.number < this.current.total))
			this.showMedia(this.current.last);
	};
};