/**
 * Created J/03/12/2009
 * Updated V/31/12/2010
 * Version 32
 *
 * Copyright 2008-2011 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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
 * Internationalization, BBcode, Dialogue, Slideshow, Upload, Map, window, apijs, start, openTab, alert
 */

// #### Paramètres de configuration ############################### //
// = révision : 24
// » Définie la variable globale du programme ainsi que sa configuration
// » Lance le programme JavaScript
var apijs = {
	i18n: null,
	dialogue: null,
	slideshow: null,
	upload: null,
	map: null,
	config: {
		lang: 'fr',
		debug: true,
		debugkey: false,
		navigator: true,
		autolang: true,
		dialogue: {
			blocks: [],
			hiddenPage: false,
			savingDialog: false,
			savingTime: 2250,
			showLoader: true,
			autoPlay: true,
			savePhoto: true,
			saveVideo: true,
			videoWidth: 640,
			videoHeight: 480,
			imagePrev: null,
			imageNext: null,
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
	}
};

function myFuncA() { alert('myFuncA() in main.js (this is an example)'); apijs.dialogue.actionClose(true); }
function myFuncB(id) { alert('myFuncB(' + id + ') in main.js (this is an example)'); apijs.dialogue.actionClose(true); }

if ((navigator.userAgent.indexOf('MSIE') < 0) || (navigator.userAgent.indexOf('MSIE 9') > -1)) {
	window.addEventListener('load', start, false);
}
else {
	apijs.config.navigator = false;
	window.innerWidth = document.documentElement.clientWidth;
	window.innerHeight = document.documentElement.clientHeight;
	window.attachEvent('onload', start);
}


// #### Lancement du programme #################################### //
// = révision : 25
// » Recherche les liens ayant la classe popup
// » Charge les modules disponibles
function start() {

	// *** Recherche des liens ************************* //
	for (var tag = document.getElementsByTagName('a'), i = 0; i < tag.length; i++) {

		if (apijs.config.navigator && tag[i].hasAttribute('class') && (tag[i].getAttribute('class').indexOf('popup') > -1))
			tag[i].addEventListener('click', openTab, false);

		else if (tag[i].className.indexOf('popup') > -1)
			tag[i].setAttribute('onclick', 'window.open(this.href); return false;');
	}

	// *** Chargement des modules ********************** //
	if (typeof Internationalization === 'function') {

		apijs.i18n = new Internationalization();
		apijs.i18n.init();

		if ((typeof Dialogue === 'function') && (typeof BBcode === 'function')) {

			apijs.dialogue = new Dialogue();

			if (typeof Slideshow === 'function') {
				apijs.slideshow = new Slideshow();
				apijs.slideshow.init();
			}
		}

		if ((typeof Map === 'function') && document.getElementById('carteInteractive')) {
			apijs.map = new Map();
			apijs.map.init();
		}
	}
}


// #### Nouvel onglet ############################################# //
// = révision : 3
// » Ouvre le lien dans un nouvel onglet
// » Fonction pouvant être utilisée par [bbcode] (non obligatoire)
// » Annule l'action par défaut
function openTab(ev) {
	ev.preventDefault();
	window.open(this.href);
}


// #### Vérification des modules ################################## //
// = révision : 28
// » Vérifie les modules et la configuration des modules chargés
// » Ne vérifie pas les dépendances entre les modules
function checkAll() {

	var module = 0, error = 0, warning = 0, report = [], defaultConf = null, keyA = null, keyB = null;
	defaultConf = {
		lang: 'string',
		debug: 'boolean',
		debugkey: 'boolean',
		navigator: 'boolean',
		autolang: 'boolean',
		dialogue: {
			blocks: 'object',
			hiddenPage: 'boolean',
			savingDialog: 'boolean',
			savingTime: 'number',
			showLoader: 'boolean',
			autoPlay: 'boolean',
			savePhoto: 'boolean',
			saveVideo: 'boolean',
			videoWidth: 'number',
			videoHeight: 'number',
			imagePrev: 'string',
			imageNext: 'string',
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

	// *** Vérification des modules ******************** //
	report.push('Checking modules');

	// [bbcode]
	if (typeof BBcode === 'function') {
		report.push(' ➩ BBcode is here');
		module++;
	}

	// [i18n]
	if ((typeof Internationalization === 'function') && (apijs.i18n instanceof Internationalization)) {
		report.push(' ➩ Internationalization is here and loaded');
		module++;
	}
	else if (typeof Internationalization === 'function') {
		report.push(' ➩ Internationalization is here');
		module++;
	}

	// [TheDialogue]
	if ((typeof Dialogue === 'function') && (apijs.dialogue instanceof Dialogue)) {
		report.push(' ➩ TheDialogue is here and loaded');
		module++;
	}
	else if (typeof Dialogue === 'function') {
		report.push(' ➩ TheDialogue is here');
		module++;
	}

	// [TheSlideshow]
	if ((typeof Slideshow === 'function') && (apijs.slideshow instanceof Slideshow)) {
		report.push(' ➩ TheSlideshow is here and loaded');
		module++;
	}
	else if (typeof Slideshow === 'function') {
		report.push(' ➩ TheSlideshow is here');
		module++;
	}

	// [TheUpload]
	if ((typeof Upload === 'function') && (apijs.upload instanceof Upload)) {
		report.push(' ➩ TheUpload is here and loaded');
		module++;
	}
	else if (typeof Upload === 'function') {
		report.push(' ➩ TheUpload is here');
		module++;
	}

	// [TheMap]
	if ((typeof Map === 'function') && (apijs.map instanceof Map)) {
		report.push(' ➩ TheMap is here and loaded');
		module++;
	}
	else if (typeof Map === 'function') {
		report.push(' ➩ TheMap is here');
		module++;
	}

	if (module < 1)
		report.push(' ➩ no module present');

	// *** Vérification de la configuration ************ //
	report.push('\nChecking configuration');

	for (keyA in defaultConf) if (defaultConf.hasOwnProperty(keyA)) {

		// pas dé vérification si le module n'est pas chargé
		if ((keyA === 'dialogue') && (typeof Dialogue !== 'function'))
			continue;

		if ((keyA === 'slideshow') && (typeof Slideshow !== 'function'))
			continue;

		if ((keyA === 'upload') && (typeof Upload !== 'function'))
			continue;

		if ((keyA === 'map') && (typeof Map !== 'function'))
			continue;

		// config d'un module
		if (typeof defaultConf[keyA] === 'object') {

			for (keyB in defaultConf[keyA]) if (defaultConf[keyA].hasOwnProperty(keyB)) {

				// config manquante
				if (apijs.config[keyA][keyB] === undefined) {
					report.push(' ☠ apijs.config.' + keyA + '.' + keyB + ' is missing');
					error++;
				}

				// config vide
				else if ((apijs.config[keyA][keyB] === null) && (defaultConf[keyA][keyB] === 'string')) {
					report.push(' ⚠ apijs.config.' + keyA + '.' + keyB + ' is null');
					warning++;
				}

				// config invalide
				else if (typeof apijs.config[keyA][keyB] !== defaultConf[keyA][keyB]) {
					report.push(' ☠ apijs.config.' + keyA + '.' + keyB + ' isn\'t a ' + defaultConf[keyA][keyB]);
					error++;
				}
			}
		}

		// config manquante
		else if (apijs.config[keyA] === undefined) {
			report.push(' ☠ apijs.config.' + keyA + ' is missing');
			error++;
		}

		// config vide
		else if ((apijs.config[keyA] === null) && (defaultConf[keyA] === 'string')) {
			report.push(' ⚠ apijs.config.' + keyA + ' is null');
			warning++;
		}

		// config invalide
		else if (typeof apijs.config[keyA] !== defaultConf[keyA]) {
			report.push(' ☠ apijs.config.' + keyA + ' isn\'t a ' + defaultConf[keyA]);
			error++;
		}
	}

	if (error < 1)
		report.push(' ➩ no error found');

	// *** Affichage du rapport ************************ //
	alert(report.join('\n'));
}

