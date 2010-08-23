/**
 * Created J/03/12/2009
 * Updated D/22/08/2010
 * Version 24
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
// = révision : 12
// » Définie les variables globales et la config
// » Lance l'application JavaScript
var i18n = null, TheButton = null, TheDialogue = null, TheSlideshow = null, TheUpload = null, TheMap = null;
var config = {
	version: '1.1.0',
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
		hiddenPage: true,
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
// = révision : 16
// » Recherche les liens ayant la class popup
// » Charge les modules disponibles
function start() {

	for (var tag = document.getElementsByTagName('a'), i = 0; i < tag.length; i++) {

		if (config.navigator && tag[i].hasAttribute('class') && (tag[i].getAttribute('class').match(/popup/)))
			tag[i].addEventListener('click', openTab, false);

		else if (tag[i].className.match(/popup/))
			tag[i].setAttribute('onclick', 'window.open(this.href); return false;');
	}

	if ((typeof Internationalization === 'function') && (typeof BBcode === 'function') && (typeof Dialogue === 'function')) {

		i18n = new Internationalization();
		i18n.init();

		TheDialogue = new Dialogue();

		if (typeof Slideshow === 'function') {
			TheSlideshow = new Slideshow();
			TheSlideshow.init();
		}

		if ((typeof Map === 'function') && document.getElementById('carteInteractive')) {
			TheMap = new Map();
			TheMap.init();
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


// ### Vérification des modules ################################### //
// = révision : 7
// » Vérifie les modules
// » Vérifie les données de configuration
// » Ne vérifie pas les dépendances
function checkAll() {

	var error = 0, warning = 0, defaultConf = null, report = [];
	defaultConf = {
		version: 'string',
		lang: 'string',
		debug: 'boolean',
		debugkey: 'boolean',
		navigator: 'boolean',
		autolang: 'boolean',
		dialogue: {
			blocks: 'object',
			hiddenPage: 'boolean',
			resize: 'boolean',
			autoplay: 'boolean',
			savePhoto: 'boolean',
			saveVideo: 'boolean',
			videoWidth: 'number',
			videoHeight: 'number',
			imageClose: 'string',
			imageUpload: 'string',
			fileUpload: 'string',
			filePhoto: 'string',
			fileVideo: 'string'
		},
		slideshow: {
			ids: 'string',
			hiddenPage: 'boolean',
			hoverload: 'boolean'
		}
	};

	report.push('The apijs ' + config.version);

	// *** Vérif modules *************************** //
	report.push('\nChecking modules');

	// bbcode
	if (typeof BBcode === 'function')
		report.push('➩ BBcode is here');

	// i18n
	if ((typeof Internationalization === 'function') && (i18n instanceof Internationalization))
		report.push('➩ Internationalization is here and loaded');

	else if (typeof Internationalization === 'function')
		report.push('➩ Internationalization is here');

	// theButton
	if ((typeof Button === 'function') && (TheButton instanceof Button))
		report.push('➩ TheButton is here and loaded');

	else if (typeof Button === 'function')
		report.push('➩ TheButton is here');

	// theDialogue
	if ((typeof Dialogue === 'function') && (TheDialogue instanceof Dialogue))
		report.push('➩ TheDialogue is here and loaded');

	else if (typeof Dialogue === 'function')
		report.push('➩ TheDialogue is here');

	// theUpload
	if ((typeof Upload === 'function') && (TheUpload instanceof Upload))
		report.push('➩ TheUpload is here and loaded');

	else if (typeof Upload === 'function')
		report.push('➩ TheUpload is here');

	// theSlideshow
	if ((typeof Slideshow === 'function') && (TheSlideshow instanceof Slideshow))
		report.push('➩ TheSlideshow is here and loaded');

	else if (typeof Slideshow === 'function')
		report.push('➩ TheSlideshow is here');

	// theMap
	if ((typeof Map === 'function') && (TheMap instanceof Map))
		report.push('➩ TheMap is here and loaded');

	else if (typeof Map === 'function')
		report.push('➩ TheMap is here');

	// *** Vérif configuration ********************* //
	report.push('\nChecking configuration');

	for (var key in defaultConf) {

		// pas dé vérif si le module n'est pas chargé
		if ((key === 'dialogue') && (typeof Dialogue !== 'function'))
			continue;

		if ((key === 'slideshow') && (typeof Slideshow !== 'function'))
			continue;

		if ((key === 'map') && (typeof Map !== 'function'))
			continue;

		// config d'un module
		if (typeof defaultConf[key] === 'object') {

			for (var bis in defaultConf[key]) {

				// config manquante
				if (config[key][bis] === undefined) {
					report.push('☠ config.' + key + '.' + bis + ' is missing');
					error++;
				}

				// config vide
				else if (config[key][bis] === null) {
					report.push('⚠ config.' + key + '.' + bis + ' is null');
					warning++;
				}

				// config invalide
				else if (typeof config[key][bis] !== defaultConf[key][bis]) {
					report.push('☠ config.' + key + '.' + bis + ' isn\'t a ' + defaultConf[key][bis]);
					error++;
				}
			}
		}

		// config manquante
		else if (config[key] === undefined) {
			report.push('☠ config.' + key + ' is missing');
			error++;
		}

		// config vide
		else if (config[key] === null) {
			report.push('⚠ config.' + key + ' is null');
			warning++;
		}

		// config invalide
		else if (typeof config[key] !== defaultConf[key]) {
			report.push('☠ config.' + key + ' isn\'t a ' + defaultConf[key]);
			error++;
		}
	}

	if ((error < 1) && (warning < 1))
		report.push('➩ no error found');

	// *** Affichage du rapport ******************** //
	alert(report.join('\n'));
}

