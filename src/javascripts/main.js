/**
 * Created J/03/12/2009
 * Updated V/05/04/2013
 * Version 65
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
 *
 * JSLint: apijs startApijs setApijsLang setApijsConfig openTab uniqid  BrowserDetect str_shuffle in_array  window alert confirm
 * sloppy: true, white: true, browser: true, devel: true, plusplus: true, maxerr: 1000  (upload.js, regexp: true) (demo.js, eval is evil)
 */

// #### Paramètres de configuration ######################################### //
// = révision : 65
// » Définie la variable globale du programme ainsi que sa configuration
// » Lance le programme JavaScript
var apijs = {
	core: {},
	config: {
		lang: 'auto',
		debug: false,
		debugkey: false,
		navigator: true,
		transition: true,
		dialog: {
			closeOnClic: false,
			restrictNavigation: true,
			savingDialog: false,
			savingTime: 700,
			margin: 25,
			emotes: true,
			showLoader: true,
			showFullsize: false,
			savePhoto: true,
			saveVideo: true,
			videoAutoplay: true,
			videoWidth: 640,
			videoHeight: 480,
			imagePrev: null,  // { src: './images/icons/24/gnome-prev.png', width: 24, height: 24 }
			imageNext: null,  // { src: './images/icons/24/gnome-next.png', width: 24, height: 24 }
			imageClose: null, // { src: './images/dialog/close.png', width: 60, height: 22 }
			imageUpload: { src: './images/dialog/progress3.svg.php', width: 300, height: 17 },
			filePhoto: './downloadfile.php',
			fileVideo: './downloadfile.php',
			fileUpload: './uploadfile.php'
		},
		slideshow: {
			ids: 'diaporama'
		},
		bbcode: {
			'(a)': { src:'./images/icons/emotes/gnome-face-angel.png', width: 16, height: 16 },
			'(@)': { src:'./images/icons/emotes/gnome-face-angry.png', width: 16, height: 16 },
			'(k)': { src:'./images/icons/emotes/gnome-face-kiss.png', width: 16, height: 16 },
			'lol': { src:'./images/icons/emotes/gnome-face-laugh.png', width: 16, height: 16 },
			"':(": { src:'./images/icons/emotes/gnome-face-crying.png', width: 16, height: 16 },
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

if (typeof window.addEventListener === 'function') {
	window.addEventListener('load', startApijs, false);
}
else if (navigator.userAgent.indexOf('MSIE 8') > -1) {
	apijs.config.navigator = false;
	apijs.config.transition = false;
	document.createElement('video');
	window.innerWidth = document.documentElement.clientWidth;
	window.innerHeight = document.documentElement.clientHeight;
	window.attachEvent('onload', startApijs);
}


// #### Lancement du programme ############################################## //
// = révision : 59
// » Recherche les liens ayant la classe popup
// » Vérifie si le navigateur supporte les transitions CSS ou pas
// » Charge les modules disponibles et met en place les gestionnaires d'événements
function startApijs() {

	if (apijs.config.navigator) {
		for (var tags = document.querySelectorAll('a.popup'), tag = 0; tag < tags.length; tag++)
			tags[tag].addEventListener('click', openTab, false);
	}
	else {
		for (var tags = document.querySelectorAll('a.popup'), tag = 0; tag < tags.length; tag++)
			tags[tag].setAttribute('onclick', 'window.open(this.href); return false;');
	}

	if ((typeof document.body.style.transitionDuration !== 'string') &&
	    (typeof document.body.style.OTransitionDuration !== 'string') &&
	    (typeof document.body.style.MozTransitionDuration !== 'string') &&
	    (typeof document.body.style.webkitTransitionDuration !== 'string')) {
		apijs.config.transition = false;
	}

	if ((typeof apijs.core.i18n === 'function') && (typeof apijs.core.bbcode === 'function') &&
	    (typeof apijs.core.dialog === 'function') && (typeof apijs.core.upload === 'function') &&
	    (typeof apijs.core.slideshow === 'function')) {

		apijs.i18n = new apijs.core.i18n();

		if (typeof setApijsLang === 'function')
			setApijsLang();

		apijs.i18n.init();

		if (typeof setApijsConfig === 'function')
			setApijsConfig();

		apijs.dialog = new apijs.core.dialog();
		apijs.upload = new apijs.core.upload();

		apijs.slideshow = new apijs.core.slideshow();
		apijs.slideshow.init();
	}
}


// #### Outils ############################################################## //
// = révision : 5
// » Ouvre le lien dans un nouvel onglet et annule l'action par défaut
// » Essaye de générer un identifiant unique
function openTab(ev) {
	ev.preventDefault();
	window.open(this.href);
}
function uniqid() {
	return str_shuffle('958753cfb564e097e2f9121a43da98708727f30365b1da846cc6fae22afe7ebcbda4030bd81f1e4d0615b96358dc294c').substr(0, 8);
}