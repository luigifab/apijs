/**
 * Created J/13/05/2010
 * Updated S/04/11/2023
 *
 * Copyright 2008-2025 | Fabrice Creuzot (luigifab) <code~luigifab~fr>
 * https://github.com/luigifab/apijs
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

	"use strict";
	this.current = null;


	// AFFICHAGE DE LA BOÎTE DE DIALOGUE (public return void|boolean)

	this.init = function () {

		var i, j, elem, ids = apijs.config.slideshow.ids, hoverload = false;

		for (i = 0; elem = apijs.html(ids + '.' + i, true); i++) {

			hoverload = elem.classList.contains('hoverload');

			for (j = 0; elem = apijs.html(ids + '.' + i + '.' + j, true); j++) {
				elem.addEventListener('click', this.show);
				if (hoverload)
					elem.addEventListener('mouseover', this.show);
			}

			if (elem = apijs.html(ids + '.' + i + '.99999', true))
				elem.addEventListener('click', this.show);
		}

		this.onPopState();
	};

	this.onPopState = function () {

		// \\ au lieu de \ sinon Bad or unnecessary escaping
		if (new RegExp('#(' + apijs.config.slideshow.ids + '[\-\\.]\\d+[\-\\.]\\d+)').test(self.location.href)) {
			var id = RegExp.$1.replace(/-/g, '.');
			if (apijs.html(id, true) && !apijs.dialog.has('slideshow')) // Chrome 31 et Opera 19 passent 2 fois sans le !has
				apijs.slideshow.show(id, false);
		}
		else if (apijs.slideshow.current) {
			apijs.dialog.actionClose();
		}
	};

	this.show = function (ev, push) { // todo

		var source, show = false, media = {}, src, srcset, total, hash;

		// recherche de la source (élément a)
		// recherche des informations du média (1/4, id)
		// la source est soit une miniature (ev=click/mouseover/stringId) soit l'image principale (ev=click)
		if (typeof ev == 'string') {
			show     = true;
			source   = apijs.html(ev, true);
			media.id = ev;
		}
		else {
			ev.preventDefault();
			source = ev.target;
			while (source.nodeName !== 'A')
				source = source.parentNode;

			// stop sur miniature déjà à jour en mode gallery
			if ((ev.type === 'mouseover') && source.classList.contains('current'))
				return false;

			media.id = source.getAttribute('id');
		}

		// recherche des informations du média (2/4, prefix|number|gallery)
		media.prefix  = apijs.config.slideshow.ids + '.' + media.id.split('.')[1];
		media.number  = parseInt(media.id.split('.')[2], 10);
		media.gallery = apijs.html(media.prefix + '.99999', true);

		// SI SOURCE N'EST PAS L'IMAGE PRINCIPALE DU MODE GALLERY
		// marque la source avec la class current
		// prend soin de supprimer les anciennes class current
		// v5.1 soit sur le lien (avant sur l'image elle même), soit sur le dl
		if (media.number !== 99999) {

			var links = apijs.html(media.prefix, true).querySelectorAll('a[id][type]'),
			    conts = apijs.html(media.prefix, true).querySelectorAll('dl');

			if (media.gallery || (links.length !== conts.length)) {
				links.forEach(function (elem) { elem.classList.remove('current'); });
				source.setAttribute('class', 'current');
			}
			else {
				conts.forEach(function (elem) { elem.classList.remove('current'); });
				source.parentNode.parentNode.setAttribute('class', 'current');
			}
		}

		// UNIQUEMENT EN MODE GALLERY
		// recherche des informations du média (3/4, [number]|config)
		// réaffecte la source sur la miniature et non sur l'image principale SI SOURCE = IMAGE PRINCIPALE
		// réaffecte le numéro du média sur la miniature et non sur l'image principale SI SOURCE = IMAGE PRINCIPALE
		// supprime l'adresse de l'image principale de la configuration du média (media.config = url|name|date|legend)
		// met à jour l'image principale SAUF SI SOURCE = IMAGE PRINCIPALE (puisque tout est déjà correct)
		if (media.gallery) {

			if (media.number === 99999) {
				show   = true;
				source = (media.gallery.hasAttribute('class')) ? media.gallery.getAttribute('class') : media.prefix + '.0';
				source = apijs.html(source, true);
				media.number = parseInt(source.getAttribute('id').split('.')[2], 10);
				media.id     = media.id.replace('99999', media.number);
			}

			media.config = source.querySelector('input').getAttribute('value').split('|');

			src = media.config.shift();
			if (src.indexOf(';') > 0) {
				src    = src.split(';');
				srcset = src[1].trim();
				src    = src[0].trim();
			}

			media.gallery.setAttribute('href', source.getAttribute('href'));
			media.gallery.querySelector('img').setAttribute('src', src);
			media.gallery.querySelector('img').setAttribute('srcset', srcset ? srcset : '');
			media.gallery.querySelector('img').setAttribute('alt', source.querySelector('img').getAttribute('alt'));
			media.gallery.setAttribute('class', media.id);
		}
		// UNIQUEMENT EN MODE ALBUM
		// recherche des informations du média (3/4, config)
		else {
			show = true;
			media.config = source.querySelector('input').getAttribute('value').split('|');
		}

		// recherche des informations du média (4/4, url|type|styles)
		// défini le type de dialogue à partir du mimetype du lien de la source si cela est possible
		media.url    = source.getAttribute('href');
		media.type   = source.getAttribute('type').substring(0, 5).replace('image', 'dialogPhoto').replace('video', 'dialogVideo').replace('audio', 'dialogVideo');
		media.type   = (media.type.indexOf('dialog') === 0) ? media.type : 'dialogPhoto';
		media.styles = apijs.html(media.prefix, true);
		media.styles = media.styles.hasAttribute('class') ? media.styles.getAttribute('class').replace(/gallery|album/g, '').trim() : '';

		// demande l'affichage du dialogue
		// lors d'un clic sur l'image principale du mode gallery
		// ou lors d'un clic sur les miniatures en mode album
		// ou lors d'un appel direct
		if (show) {

			apijs.dialog[media.type](media.url, media.config[0], media.config[1], media.config[2], media.styles);

			total = apijs.html(media.prefix, true).querySelectorAll('a[id][type]').length - (media.gallery ? 2 : 1);
			apijs.slideshow.current = {
				number: media.number,
				first:  media.prefix + '.0',
				prev:   (media.number > 0) ? media.prefix + '.' + (media.number - 1) : null,
				next:   (media.number < total) ? media.prefix + '.' + (media.number + 1) : null,
				last:   media.prefix + '.' + total,
				total:  total
			};

			// boutons précédent et suivant
			if (apijs.slideshow.current.prev)
				apijs.html('#Prev').removeAttribute('disabled');
			if (apijs.slideshow.current.next)
				apijs.html('#Next').removeAttribute('disabled');

			// gestion de l'historique
			// met à jour l'ancre uniquement si l'utilisateur ne joue pas avec son historique
			if (apijs.config.slideshow.anchor && (typeof history.pushState == 'function') && ((typeof push == 'boolean') ? push : true)) {
				hash  = self.location.href;
				hash  = (hash.indexOf('#') > 0) ? hash.slice(0, hash.indexOf('#')) : hash;
				hash += '#' + (media.prefix + '.' + ((media.number === 99999) ? 0 : media.number)).replace(/\./g,'-');
				history.pushState({}, '', hash);
			}
		}

		return show;
	};


	// GESTION DES INTERACTIONS (public return boolean)

	this.actionFirst = function () {

		if (this.current && (this.current.number > 0) && (this.current.number <= this.current.total))
			return this.show(this.current.first);

		return false;
	};

	this.actionPrev = function () {

		if (this.current && this.current.prev && (this.current.number > 0))
			return this.show(this.current.prev);

		return false;
	};

	this.actionNext = function () {

		if (this.current && this.current.next && (this.current.number < this.current.total))
			return this.show(this.current.next);

		return false;
	};

	this.actionLast = function () {

		if (this.current && (this.current.number >= 0) && (this.current.number < this.current.total))
			return this.show(this.current.last);

		return false;
	};
};