/**
 * Created J/03/12/2009
 * Updated S/04/06/2011
 * Version 42
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
 * Internationalization, BBcode, Dialogue, Slideshow, Upload, Map, window, apijs, start
 * openTab, customInit, customInitIE, alert, confirm, in_array, uniqid
 */

// #### Paramètres de configuration ######################################### //
// = révision : 35
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
		transition: true,
		autolang: true,
		dialogue: {
			blocks: [],
			hiddenPage: false,
			savingDialog: false,
			savingTime: 2250,
			autoPlay: true,
			showLoader: true,
			showFullsize: true,
			savePhoto: true,
			saveVideo: true,
			videoWidth: 640,
			videoHeight: 480,
			imagePrev: null,
			imageNext: null,
			imageClose: { src: './images/dialogue/close.png', width: 60, height: 22 },
			imageUpload: { src: './images/dialogue/progressbar.svg.php', width: 300, height: 17 },
			filePhoto: './downloadfile.php',
			fileVideo: './downloadfile.php',
			fileUpload: './uploadfile.php'
		},
		slideshow: {
			ids: 'diaporama',
			hiddenPage: false,
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

if ((navigator.userAgent.indexOf('MSIE') < 0) || (navigator.userAgent.indexOf('MSIE 9') > -1)) {
	window.addEventListener('load', start, false);
}
else if (navigator.userAgent.indexOf('MSIE 8') > -1) {
	apijs.config.navigator = false;
	apijs.config.transition = false;
	document.createElement('video');
	window.innerWidth = document.documentElement.clientWidth;
	window.innerHeight = document.documentElement.clientHeight;
	window.attachEvent('onload', start);
}


// #### Lancement du programme ############################################## //
// = révision : 40
// » Recherche les liens ayant la classe popup
// » Vérifie si le navigateur supporte les transitions CSS ou pas
// » Charge les modules disponibles et met en place les gestionnaires d'évènements
function start() {

	// *** Recherche des liens ************************* //
	if (apijs.config.navigator) {
		for (var tag = document.getElementsByClassName('popup'), i = 0; i < tag.length; i++)
			tag[i].addEventListener('click', openTab, false);
	}
	else {
		for (var tag = document.getElementsByTagName('a'), i = 0; i < document.getElementsByTagName('a').length; i++) {
			if (tag[i].hasAttribute('class') && (tag[i].getAttribute('class').indexOf('popup') > -1))
				tag[i].setAttribute('onclick', 'window.open(this.href); return false;');
		}
	}

	// *** Support des transitions CSS ***************** //
	if ((typeof document.getElementsByTagName('body')[0].style.transitionDuration !== 'string') &&
	    (typeof document.getElementsByTagName('body')[0].style.MozTransitionDuration !== 'string') &&
	    (typeof document.getElementsByTagName('body')[0].style.webkitTransitionDuration !== 'string')) {
		apijs.config.transition = false;
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

			if (typeof Upload === 'function') {
				apijs.upload = new Upload();
			}
		}

		if ((typeof Map === 'function') && document.getElementById('carteInteractive')) {
			apijs.map = new Map();
			apijs.map.init();
		}
	}

	// *** Code utilisateur **************************** //
	// voir le fichier custom.js pour plus d'informations
	if (apijs.config.navigator && (typeof customInit === 'function'))
		customInit();

	else if (!apijs.config.navigator && (typeof customInitIE === 'function'))
		customInitIE();
}


// #### Nouvel onglet ####################################################### //
// = révision : 3
// » Ouvre le lien dans un nouvel onglet
// » Annule l'action par défaut
function openTab(ev) {
	ev.preventDefault();
	window.open(this.href);
}


// #### Fonctions de démonstrations ################################ i18n ### //
// = révision : 17
// » Exemples de fonctions pour les dialogues de confirmation, d'options et d'upload
// » Pour le dialogue d'options, si le paramètre reçu est un objet, alors c'est une copie et non une référence
// » Pour le dialogue de confirmation, le fait que le paramètre reçu soit une référence n'a pas d'importance
function myFuncA() {

	apijs.i18n.data.en.myFuncA = "[pre]Yes, it's myFuncA() in main.js.[/pre]";
	apijs.i18n.data.fr.myFuncA = "[pre]Oui, c'est myFuncA() dans main.js.[/pre]";

	apijs.dialogue.dialogInformation('myFuncA', apijs.i18n.translate('myFuncA'));
}

function myFuncB(id) {

	apijs.i18n.data.en.myFuncB = "[pre]Yes, it's myFuncB(§) in main.js.[/pre]";
	apijs.i18n.data.fr.myFuncB = "[pre]Oui, c'est myFuncB(§) dans main.js.[/pre]";

	apijs.dialogue.dialogInformation('myFuncB', apijs.i18n.translate('myFuncB', id));
}

function myFuncC() {

	apijs.i18n.data.en.myFuncC = "Yes, it's myFuncC() in main.js, a very important function.\n\nWhat to do next ?\n» Click confirm to return true.\n» Click cancel to return false.";
	apijs.i18n.data.fr.myFuncC = "Oui, c'est myFuncC() dans main.js, une fonction très importante.\n\nQue faire ensuite ?\n» Cliquer sur valider pour renvoyer true\n» Cliquer sur annuler pour renvoyer false";

	return confirm(apijs.i18n.translate('myFuncC'));
}

function myFuncD(key, id) {

	apijs.i18n.data.en.myFuncD = "Image that you sent";
	apijs.i18n.data.fr.myFuncD = "L'image que vous avez envoyée";

	apijs.config.dialogue.savePhoto = false;
	apijs.dialogue.dialogPhoto(400, 300, apijs.config.dialogue.fileUpload + '?image=' + key, 'myFuncD(' + id + ')', 'false', apijs.i18n.translate('myFuncD'));
	apijs.config.dialogue.savePhoto = true;
}

function myFuncE(id) {

	apijs.i18n.data.en.myFuncA = "[pre]Yes, it's myFuncE(§) in main.js.[/pre]";
	apijs.i18n.data.fr.myFuncA = "[pre]Oui, c'est myFuncE(§) dans main.js.[/pre]";

	apijs.dialogue.dialogInformation('myFuncE', apijs.i18n.translate('myFuncE', id));
}


// #### Configuration dynamique ############################################# //
// = révision : 5
// » Renvoie un booléen, une valeur null, un nombre ou un objet lorsque nécessaire
// » Renvoie dans tous les cas quelque chose
function getValue(value) {

	if (value === 'true')
		return true;

	else if (value === 'false')
		return false;

	else if (value === 'null')
		return null;

	else if (/[0-9]+/.test(value))
		return parseInt(value, 10);

	else if (value === 'specialPrev')
		return { src: './images/icons/24/gnome-prev.png', width: 24, height: 24 };

	else if (value === 'specialNext')
		return { src: './images/icons/24/gnome-next.png', width: 24, height: 24 };

	else if (value === 'specialClose')
		return { src: './images/dialogue/close.png', width: 60, height: 22 };

	else
		return value;
}


// #### Vérification des modules ############################################ //
// = révision : 39
// » Recherche les modules presénts
// » Vérifie la configuration des modules chargés
// » Ne vérifie pas les dépendances entre les modules
function checkAll() {

	var module = 0, error = 0, report = [], defaultConf = null, keyA = null, keyB = null, keyC = null;
	defaultConf = {
		lang: 'string',
		debug: 'boolean',
		debugkey: 'boolean',
		navigator: 'boolean',
		transition: 'boolean',
		autolang: 'boolean',
		dialogue: {
			blocks: 'object',
			hiddenPage: 'boolean',
			savingDialog: 'boolean',
			savingTime: 'number',
			autoPlay: 'boolean',
			showLoader: 'boolean',
			showFullsize: 'boolean',
			savePhoto: 'boolean',
			saveVideo: 'boolean',
			videoWidth: 'number',
			videoHeight: 'number',
			imagePrev: { src: 'string', width: 'number', height: 'number' },
			imageNext: { src: 'string', width: 'number', height: 'number' },
			imageClose: { src: 'string', width: 'number', height: 'number' },
			imageUpload: { src: 'string', width: 'number', height: 'number' },
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

	// *** Recherche des modules *********************** //
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

		// pas de vérification si le module n'est pas chargé ou s'il n'existe pas
		if ((keyA === 'dialogue') && ((typeof Dialogue !== 'function') || !(apijs.dialogue instanceof Dialogue)))
			continue;

		if ((keyA === 'slideshow') && ((typeof Slideshow !== 'function') || !(apijs.slideshow instanceof Slideshow)))
			continue;

		if ((keyA === 'upload') && ((typeof Upload !== 'function') || !(apijs.upload instanceof Upload)))
			continue;

		if ((keyA === 'map') && ((typeof Map !== 'function') || !(apijs.map instanceof Map)))
			continue;

		// config d'un module
		if (typeof defaultConf[keyA] === 'object') {

			for (keyB in defaultConf[keyA]) if (defaultConf[keyA].hasOwnProperty(keyB)) {

				// objet
				if (typeof defaultConf[keyA][keyB] === 'object') {

					for (keyC in defaultConf[keyA][keyB]) if (defaultConf[keyA][keyB].hasOwnProperty(keyC)) {

						// config non spécifiée
						if (apijs.config[keyA][keyB] === null) {
							report.push(' ⚠ apijs.config.' + keyA + '.' + keyB + ' is null');
							break;
						}

						// config manquante
						else if (apijs.config[keyA][keyB][keyC] === undefined) {
							report.push(' ☠ apijs.config.' + keyA + '.' + keyB + '.' + keyC + ' is missing');
							error++;
						}

						// config vide
						else if (apijs.config[keyA][keyB][keyC] === null) {
							report.push(' ⚠ apijs.config.' + keyA + '.' + keyB + '.' + keyC + ' is null');
						}

						// config invalide
						else if (typeof apijs.config[keyA][keyB][keyC] !== defaultConf[keyA][keyB][keyC]) {
							report.push(' ☠ apijs.config.' + keyA + '.' + keyB + '.' + keyC + ' isn\'t a ' + defaultConf[keyA][keyB][keyC]);
							error++;
						}
					}
				}

				// config manquante
				else if (apijs.config[keyA][keyB] === undefined) {
					report.push(' ☠ apijs.config.' + keyA + '.' + keyB + ' is missing');
					error++;
				}

				// config vide
				else if (apijs.config[keyA][keyB] === null) {
					report.push(' ⚠ apijs.config.' + keyA + '.' + keyB + ' is null');
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
		else if (apijs.config[keyA] === null) {
			report.push(' ⚠ apijs.config.' + keyA + ' is null');
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


