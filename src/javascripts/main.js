/**
 * Created J/03/12/2009
 * Updated J/11/10/2012
 * Version 57
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
 *
 * Configuration de JSLint
 * apijs, startApijs, window, openTab, alert, confirm, str_shuffle, in_array, ucwords, uniqid
 */

// #### Paramètres de configuration ######################################### //
// = révision : 58
// » Définie la variable globale du programme ainsi que sa configuration
// » Lance le programme JavaScript
var apijs = {
	core: {},
	config: {
		lang: 'fr',
		debug: true,
		debugkey: false,
		navigator: true,
		transition: true,
		autolang: true,
		dialog: {
			blocks: [],
			hiddenPage: false,
			closeOnClic: false,
			savingDialog: false,
			savingTime: 2500,
			emotes: true,
			showLoader: true,
			showFullsize: false,
			savePhoto: true,
			saveVideo: true,
			videoAutoplay: true,
			videoWidth: 640,
			videoHeight: 480,
			imagePrev: null,
			imageNext: null,
			imageClose: null,
			imageUpload: { src: './images/dialog/progress2.svg.php', width: 300, height: 17 },
			filePhoto: './downloadfile.php',
			fileVideo: './downloadfile.php',
			fileUpload: './uploadfile.php'
		},
		slideshow: {
			ids: 'diaporama',
			hiddenPage: false,
			hoverload: false
		},
		bbcode: {
			'(a)': { src:'./images/icons/emotes/gnome-face-angel.png', width: 16, height: 16 },
			'(@)': { src:'./images/icons/emotes/gnome-face-angry.png', width: 16, height: 16 },
			'(k)': { src:'./images/icons/emotes/gnome-face-kiss.png', width: 16, height: 16 },
			'lol': { src:'./images/icons/emotes/gnome-face-laugh.png', width: 16, height: 16 },
			"'(": { src:'./images/icons/emotes/gnome-face-crying.png', width: 16, height: 16 },
			':$': { src:'./images/icons/emotes/gnome-face-embarrassed.png', width: 16, height: 16 },
			':|': { src:'./images/icons/emotes/gnome-face-plain.png', width: 16, height: 16 },
			':/': { src:'./images/icons/emotes/gnome-face-uncertain.png', width: 16, height: 16 },
			':(': { src:'./images/icons/emotes/gnome-face-sad.png', width: 16, height: 16 },
			':)': { src:'./images/icons/emotes/gnome-face-smile.png', width: 16, height: 16 },
			';)': { src:'./images/icons/emotes/gnome-face-wink.png', width: 16, height: 16 },
			':p': { src:'./images/icons/emotes/gnome-face-raspberry.png', width: 16, height: 16 },
			':D': { src:'./images/icons/emotes/gnome-face-smile-big.png', width: 16, height: 16 },
			':o': { src:'./images/icons/emotes/gnome-face-surprise.png', width: 16, height: 16 },
			':s': { src:'./images/icons/emotes/gnome-face-worried.png', width: 16, height: 16 }
		}
	}
};

if (navigator.userAgent.indexOf('MSIE 8') > -1) {
	apijs.config.navigator = false;
	apijs.config.transition = false;
	document.createElement('video');
	window.innerWidth = document.documentElement.clientWidth;
	window.innerHeight = document.documentElement.clientHeight;
	window.attachEvent('onload', startApijs);
}
else {
	window.addEventListener('load', startApijs, false);
}


// #### Lancement du programme ############################################## //
// = révision : 51
// » Recherche les liens ayant la classe popup
// » Vérifie si le navigateur supporte les transitions CSS ou pas
// » Charge les modules disponibles et met en place les gestionnaires d'évènements
function startApijs() {

	// *** Recherche des liens ************************* //
	if (apijs.config.navigator) {
		for (var tag = document.getElementsByTagName('a'), i = 0; i < tag.length; i++) {
			if (tag[i].hasAttribute('class') && (tag[i].getAttribute('class').indexOf('popup') > -1))
				tag[i].addEventListener('click', openTab, false);
		}
	}
	else {
		for (var tag = document.getElementsByTagName('a'), i = 0; i < tag.length; i++) {
			if (tag[i].hasAttribute('class') && (tag[i].getAttribute('class').indexOf('popup') > -1))
				tag[i].setAttribute('onclick', 'window.open(this.href); return false;');
		}
	}

	// *** Support des transitions CSS ***************** //
	if ((typeof document.getElementsByTagName('body')[0].style.transitionDuration !== 'string') &&
	    (typeof document.getElementsByTagName('body')[0].style.OTransitionDuration !== 'string') &&
	    (typeof document.getElementsByTagName('body')[0].style.MozTransitionDuration !== 'string') &&
	    (typeof document.getElementsByTagName('body')[0].style.webkitTransitionDuration !== 'string')) {
		apijs.config.transition = false;
	}

	// *** Chargement des modules ********************** //
	if ((typeof apijs.core.i18n === 'function') && (typeof apijs.core.bbcode === 'function') && (typeof apijs.core.dialog === 'function') &&
	    (typeof apijs.core.slideshow === 'function') && (typeof apijs.core.upload === 'function')) {

		apijs.i18n = new apijs.core.i18n();
		apijs.i18n.init();

		apijs.dialog = new apijs.core.dialog();

		apijs.slideshow = new apijs.core.slideshow();
		apijs.slideshow.init();

		apijs.upload = new apijs.core.upload();
	}
}


// #### Nouvel onglet ####################################################### //
// = révision : 4
// » Ouvre le lien dans un nouvel onglet
// » Annule l'action par défaut
function openTab(ev) {
	ev.preventDefault();
	window.open(this.href);
}
