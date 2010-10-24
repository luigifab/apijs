/**
 * Created J/03/12/2009
 * Updated D/24/10/2010
 * Version 25
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

// #### Paramètres de configuration ############################### //
// = révision : 16
// » Définie les variables globales et la configuration
// » Lance l'application JavaScript
var i18n = null, TheButton = null, TheDialogue = null, TheSlideshow = null, TheUpload = null, TheMap = null;
var config = {
	version: '1.2.0',
	lang: 'fr',
	debug: true,
	debugkey: false,
	navigator: true,
	autolang: true,
	dialogue: {
		blocks: [],
		hiddenPage: false,
		showLoader: true,
		autoplay: true,
		savePhoto: true,
		saveVideo: true,
		videoWidth: 640,
		videoHeight: 480,
		imageClose: './images/dialogue/close.png',
		imageUpload: './images/dialogue/progressbar.svg',
		filePhoto: './download.php',
		fileVideo: './download.php',
		fileUpload: './iframe.php'
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


// #### Lancement de l'application ################################ //
// = révision : 17
// » Recherche les liens ayant la class popup
// » Charge les modules disponibles
function start() {

	for (var i = 0, tag = document.getElementsByClassName('popup'); i < tag.length; i++) {
		if (config.navigator)
			tag[i].addEventListener('click', openTab, false);
		else
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


// #### Nouvel onglet ############################################# //
// = révision : 2
// » Ouvre le lien dans un nouvel onglet
// » Annule l'action par défaut
function openTab(ev) {
	ev.preventDefault();
	window.open(this.href);
}


// #### Vérification des modules ################################## //
// = révision : 15
// » Vérifie les modules
// » Vérifie les données de configuration
// » Ne vérifie pas les dépendances entre les modules
function checkAll() {

	var module = 0, error = 0, warning = 0, report = [];
	var defaultConf = null, key1 = null, key2 = null;

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
			showLoader: 'boolean',
			autoplay: 'boolean',
			savePhoto: 'boolean',
			saveVideo: 'boolean',
			videoWidth: 'number',
			videoHeight: 'number',
			imageClose: 'string',
			imageUpload: 'string',
			filePhoto: 'string',
			fileVideo: 'string',
			fileUpload: 'string'
		},
		slideshow: {
			ids: 'string',
			hiddenPage: 'boolean',
			hoverload: 'boolean'
		}
	};

	// *** Vérification des modules *************** //
	report.push('The apijs ' + config.version);
	report.push('\nChecking modules');

	// bbcode
	if (typeof BBcode === 'function') {
		report.push('➩ BBcode is here');
		module++;
	}

	// i18n
	if ((typeof Internationalization === 'function') && (i18n instanceof Internationalization)) {
		report.push('➩ Internationalization is here and loaded');
		module++;
	}

	else if (typeof Internationalization === 'function') {
		report.push('➩ Internationalization is here');
		module++;
	}

	// TheButton
	if ((typeof Button === 'function') && (TheButton instanceof Button)) {
		report.push('➩ TheButton is here and loaded');
		module++;
	}

	else if (typeof Button === 'function') {
		report.push('➩ TheButton is here');
		module++;
	}

	// TheDialogue
	if ((typeof Dialogue === 'function') && (TheDialogue instanceof Dialogue)) {
		report.push('➩ TheDialogue is here and loaded');
		module++;
	}

	else if (typeof Dialogue === 'function') {
		report.push('➩ TheDialogue is here');
		module++;
	}

	// TheUpload
	if ((typeof Upload === 'function') && (TheUpload instanceof Upload)) {
		report.push('➩ TheUpload is here and loaded');
		module++;
	}

	else if (typeof Upload === 'function') {
		report.push('➩ TheUpload is here');
		module++;
	}

	// TheSlideshow
	if ((typeof Slideshow === 'function') && (TheSlideshow instanceof Slideshow)) {
		report.push('➩ TheSlideshow is here and loaded');
		module++;
	}

	else if (typeof Slideshow === 'function') {
		report.push('➩ TheSlideshow is here');
		module++;
	}

	// TheMap
	if ((typeof Map === 'function') && (TheMap instanceof Map)) {
		report.push('➩ TheMap is here and loaded');
		module++;
	}

	else if (typeof Map === 'function') {
		report.push('➩ TheMap is here');
		module++;
	}

	if (module < 1)
		report.push('➩ no module present');

	// *** Vérif configuration ******************** //
	report.push('\nChecking configuration');

	for (key1 in defaultConf) if (defaultConf.hasOwnProperty(key1)) {

		// pas dé vérification si le module n'est pas chargé
		if ((key1 === 'dialogue') && (typeof Dialogue !== 'function'))
			continue;

		if ((key1 === 'slideshow') && (typeof Slideshow !== 'function'))
			continue;

		if ((key1 === 'map') && (typeof Map !== 'function'))
			continue;

		// config d'un module
		if (typeof defaultConf[key1] === 'object') {

			for (key2 in defaultConf[key1]) {

				// config manquante
				if (config[key1][key2] === undefined) {
					report.push('☠ config.' + key1 + '.' + key2 + ' is missing');
					error++;
				}

				// config vide
				else if ((config[key1][key2] === null) && (defaultConf[key1][key2] === 'string')) {
					report.push('⚠ config.' + key1 + '.' + key2 + ' is null');
					warning++;
				}

				// config invalide
				else if (typeof config[key1][key2] !== defaultConf[key1][key2]) {
					report.push('☠ config.' + key1 + '.' + key2 + ' isn\'t a ' + defaultConf[key1][key2]);
					error++;
				}
			}
		}

		// config manquante
		else if (config[key1] === undefined) {
			report.push('☠ config.' + key1 + ' is missing');
			error++;
		}

		// config vide
		else if ((config[key1] === null) && (defaultConf[key1] === 'string')) {
			report.push('⚠ config.' + key1 + ' is null');
			warning++;
		}

		// config invalide
		else if (typeof config[key1] !== defaultConf[key1]) {
			report.push('☠ config.' + key1 + ' isn\'t a ' + defaultConf[key1]);
			error++;
		}
	}

	if (error < 1)
		report.push('➩ no error found');

	// *** Affichage du rapport ******************* //
	alert(report.join('\n'));
}

