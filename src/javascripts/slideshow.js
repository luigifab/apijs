/**
 * Created J/13/05/2010
 * Updated L/25/05/2015
 * Version 38
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

apijs.core.slideshow = function () {

	this.started = 0;
	this.current = null;


	// GESTION DU DIAPORAMA

	// #### Initialisation ######################################################### private ### //
	// = révision : 32
	// » Recherche les albums puis les photos et vidéos de chaque album
	// » Met en place les gestionnaires d'événements associés (+click +mouseover)
	// » Recherche la présence d'une ancre dans l'adresse de la page
	this.init = function () {

		var i, j, id, ids = apijs.config.slideshow.ids, hoverload = false;

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

			this.started += 1;
		}

		// recherche d'une ancre
		// \\. au lieu de \. (pour le caractère .) sinon col 44, Bad or unnecessary escaping
		if (new RegExp('#(' + ids + '(?:-|\\.)[0-9]+(?:-|\\.)[0-9]+)').test(location.href)) {
			id = RegExp.$1.replace(/-/g, '.');
			if (document.getElementById(id))
				this.showMedia(id);
		}
	};


	// #### Prépare l'affichage du dialogue ################################ event ## public ### // TODO
	// = révision : 95
	// » Recherche les informations de la photo ou de la vidéo à afficher
	// » Effectue le même traitement lors d'un appel direct ou lors d'un événement (la source étant dans les deux cas une miniature)
	// » En provenance du survol ou d'un clic sur les miniatures, d'un clic sur l'image principale, ou encore d'un appel direct
	// » En mode présentation l'image principale contient l'id de la miniature dans son attribut class (sinon c'est la première du lot)
	// » S'assure de ne pas faire deux fois la même chose en mode présentation
	this.showMedia = function (ev, push) {

		var source, media = {};

		// recherche de la source (élément a)
		// recherche des informations du média (1/4, id)
		// la source est soit une miniature (ev=click/mouseover/stringId) soit l'image principale (ev=click)
		if (typeof ev === 'string') {
			source = document.getElementById(ev);
			media.id = ev;
		}
		else {
			ev.preventDefault();

			source = (ev.target.nodeName === 'A') ? ev.target : ev.target.parentNode;
			media.id = source.getAttribute('id');

			// stop sur miniature à jour en mode présentation
			// ne fait pas deux fois la même chose (après un second survol sur la même miniature)
			if ((ev.type === 'mouseover') && source.hasAttribute('class') && (source.getAttribute('class').indexOf('current') > -1))
				return;
		}

		// recherche des informations du média (2/4, prefix|number|numberSrc|presentation)
		media.prefix = apijs.config.slideshow.ids + '.' + media.id.split('.')[1];
		media.number = media.numberSrc = parseInt(media.id.split('.')[2], 10);
		media.presentation = document.getElementById(media.prefix + '.999');

		// SAUF SI SOURCE = IMAGE PRINCIPALE
		// marque la source avec la class current
		// prend soin de supprimer les anciennes class current
		// v5.1: soit sur le lien (avant sur l'image elle même), soit sur le dl
		if (media.number !== 999) {

			var allLinks = document.getElementById(media.prefix).querySelectorAll('a[id][type]'),
			    allConts = document.getElementById(media.prefix).querySelectorAll('dl'), i;

			if ((media.presentation !== null) || (allLinks.length !== allConts.length)) {
				for (i = 0; i < allLinks.length; i++) {
					if (allLinks[i].hasAttribute('class'))
						allLinks[i].removeAttribute('class');
				}
				source.setAttribute('class', 'current');
			}
			else {
				for (i = 0; i < allConts.length; i++) {
					if (allConts[i].hasAttribute('class'))
						allConts[i].removeAttribute('class');
				}
				source.parentNode.parentNode.setAttribute('class', 'current');
			}
		}

		// UNIQUEMENT EN MODE PRÉSENTATION
		// recherche des informations du média (3/4, [number]|config)
		// réaffecte la source sur la miniature et non sur l'image principale SI SOURCE = IMAGE PRINCIPALE
		// réaffecte le numéro du média sur la miniature et non sur l'image principale SI SOURCE = IMAGE PRINCIPALE
		// supprime l'adresse de l'image principale de la configuration du média (media.config = url|name|date|legend)
		// met à jour l'image principale SAUF SI SOURCE = IMAGE PRINCIPALE (puisque tout est déjà correct)
		if (media.presentation !== null) {

			if (media.number === 999) {
				source = (media.presentation.hasAttribute('class')) ? media.presentation.getAttribute('class') : media.prefix + '.0';
				source = document.getElementById(source);
				media.number = parseInt(source.getAttribute('id').split('.')[2], 10);
			}

			media.config  = source.querySelector('input').getAttribute('value').split('|');
			media.mainImg = media.config.shift();

			if (media.numberSrc !== 999) {
				media.presentation.setAttribute('href', source.getAttribute('href'));
				media.presentation.querySelector('img').setAttribute('src', media.mainImg);
				media.presentation.querySelector('img').setAttribute('alt', source.querySelector('img').getAttribute('alt'));
				media.presentation.setAttribute('class', media.id);
			}

			media.mainImg = null;
		}
		// UNIQUEMENT EN MODE STANDARD
		// recherche des informations du média (3/4, config)
		else {
			media.config = source.querySelector('input').getAttribute('value').split('|');
		}

		// recherche des informations du média (4/4, url|type|styles)
		// définie le type de dialogue à partir du mimetype du lien de la source
		media.url    = source.getAttribute('href');
		media.type   = source.getAttribute('type').substr(0, 5).replace('image', 'dialogPhoto').replace('video', 'dialogVideo');
		media.styles = document.getElementById(media.prefix).getAttribute('class').replace(/gallery|album/g, 'slideshow');

		// demande l'affichage du dialogue
		// lors d'un clic sur l'image principale du mode présentation,
		// ou lors d'un clic sur les miniatures en mode standard (en mode standard),
		// ou lors d'un appel direct
		if ((media.presentation && (media.numberSrc === 999)) || !media.presentation || (typeof ev === 'string'))
			this.showDialog(media, push);
	};


	// #### Affichage du dialogue ################################################## private ### //
	// = révision : 45
	// » Affiche le dialogue et les boutons précédent et suivant
	// » Vérifie au préalable s'il existe une photo ou vidéo précédente et suivante
	// » S'assure qu'un dialogue du diaporama est présent avant de faire n'importe quoi
	// » Met ensuite à jour l'ancre uniquement si l'utilisateur ne joue pas avec son historique
	this.showDialog = function (media, push) {

		apijs.dialog[media.type](media.url, media.config[0], media.config[1], media.config[2], media.styles);

		if ((apijs.dialog.styles !== null) && apijs.dialog.styles.has('slideshow')) {

			this.current = { number: media.number, first: null, prev: null, next: null, last: null, total: null };

			// recherche du nombre de miniature
			this.current.total = document.getElementById(media.prefix).querySelectorAll('a[id][type]').length - 1;
			this.current.total = (media.presentation) ? this.current.total - 1 : this.current.total;

			// mise à jour des variables
			this.current.first = media.prefix + '.0';
			this.current.prev  = (media.number > 0) ? media.prefix + '.' + (this.current.number - 1) : null;
			this.current.next  = (media.number < this.current.total) ? media.prefix + '.' + (this.current.number + 1) : null;
			this.current.last  = media.prefix + '.' +  this.current.total;

			// boutons précédent et suivant
			if (this.current.prev !== null)
				document.getElementById('apijsPrev').removeAttribute('disabled');

			if (this.current.next !== null)
				document.getElementById('apijsNext').removeAttribute('disabled');

			// gestion de l'historique
			if (apijs.config.slideshow.anchor && (typeof history.pushState === 'function') && ((typeof push === 'boolean') ? push : true)) {

				var hash = location.href;
				hash  = (hash.indexOf('#') > 0) ? hash.slice(0, hash.indexOf('#')) : hash;
				hash += '#' + (media.prefix + '.' + ((media.number !== 999) ? media.number : 0)).replace(/\./g,'-');

				history.pushState({}, '', hash);
			}
		}
		else {
			this.current = null;
		}
	};


	// #### Changement d'ancre ############################################ event ## private ### //
	// = révision : 4
	// » Se déclenche lorsque l'ancre change (mais ne modifie pas l'ancre ici)
	// » Affiche le dialogue photo ou vidéo correspondant en mode diaporama si possible
	// » Supprime l'éventuel dialogue photo ou vidéo du mode diaporama
	this.popState = function () {

		// recherche d'une ancre
		// \\. au lieu de \. (pour le caractère .) sinon col 44, Bad or unnecessary escaping
		if (new RegExp('#(' + apijs.config.slideshow.ids + '(?:-|\\.)[0-9]+(?:-|\\.)[0-9]+)').test(location.href)) {
			var id = RegExp.$1.replace(/-/g, '.');
			if (document.getElementById(id))
				apijs.slideshow.showMedia(id, false);
		}
		else if (apijs.slideshow.current !== null) {
			apijs.dialog.actionClose(true);
		}
	};



	// ACTIONS DES BOUTONS ET DES TOUCHES DU CLAVIER

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