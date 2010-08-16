/**
 * Created J/03/12/2009
 * Updated L/16/08/2010
 * Version 23
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

// ### Paramètres de configuration ################################ //
// = révision : 10
// » Définie les variables globales et la config
// » Lance l'application JavaScript
var i18n = null, TheButton = null, TheDialogue = null, TheSlideshow = null, TheUpload = null, TheMap = null;
var config = {
	lang: 'fr',
	debug: true,
	debugkey: false,
	navigator: true,
	autolang: true,
	dialogue: {
		blocks: [],
		hiddenPage: false,
		resize: true,
		autoplay: true,
		savePhoto: true,
		saveVideo: true,
		videoWidth: 640,
		videoHeight: 480,
		imageClose: './images/dialogue/close.png',
		imageUpload: './images/dialogue/progressbar.svg',
		fileUpload: './iframe.php',
		filePhoto: './download.php',
		fileVideo: './download.php'
	},
	slideshow: {
		ids: 'diaporama',
		hoverload: false
	},
	map: {
		width: 580,
		height: 400,
		initLatitude: 1.9,
		initLongitude: 46.3,
		imageMarker: './images/map/marker.png',
		zoomInitial: 5,
		zoomCenter: 14,
		zoomSynchro: 15
	}
};

if (!navigator.userAgent.match(/MSIE/)) {
	window.addEventListener('load', start, false);
}
else {
	config.navigator = false;
	window.innerWidth = document.documentElement.clientWidth;
	window.innerHeight = document.documentElement.clientHeight;
	window.onload = start;
}


// ### Lancement de l'application ################################# //
// = révision : 14
// » Recherche les liens ayant la class popup
// » Charge tous les modules disponibles
function start() {

	for (var tag = document.getElementsByTagName('a'), i = 0; i < tag.length; i++) {

		if (config.navigator && tag[i].hasAttribute('class') && (tag[i].getAttribute('class').match(/popup/)))
			tag[i].addEventListener('click', openTab, false);

		else if (tag[i].className.match(/popup/))
			tag[i].setAttribute('onclick', 'window.open(this.href); return false;');
	}

	if ((typeof Internationalization === 'function') && (typeof Dialogue === 'function')) {

		i18n = new Internationalization();
		i18n.init();

		TheDialogue = new Dialogue();

		if (typeof Slideshow === 'function') {
			config.dialogue.hiddenPage = true;
			TheSlideshow = new Slideshow();
			TheSlideshow.init();
		}
	}
}


// ### Nouvel onglet ############################################## //
// = révision : 2
// » Ouvre le lien dans un nouvel onglet
// » Annule l'action par défaut
function openTab(ev) {
    ev.preventDefault();
    window.open(this.href);
}

