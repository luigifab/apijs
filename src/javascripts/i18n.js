"use strict";
/**
 * Created S/05/06/2010
 * Updated S/29/03/2014
 * Version 44
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

apijs.core.i18n = function () {

	this.data = [];

	// = en-GB (english/United-Kingdom)
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	this.data.en = {
		buttonOk: "Ok",
		buttonCancel: "Cancel",
		buttonConfirm: "Confirm",
		buttonClose: "Close",
		buttonPrev: "Previous",
		buttonNext: "Next",
		buttonBrowse: "Choose a file",

		userLeavePage: "You are about to leave...",
		operationTooLong: "This operation is too long? ",
		warningLostChange: "Warning: all changes in progress will be lost.",
		reloadLink: "Reload this page",
		operationInProgress: "Operation in progress...",
		uploadInProgress: "Upload in progress...",
		error404: "Error 404\n The file does not exist.",

		ctrlSlideshowFirstLast: "start/end",
		ctrlSlideshowNextPrev: "previous/next",
		ctrlVideoPause: "play/pause",
		ctrlVideoTime: "backward/forward",
		ctrlVideoSound: "decrease/increase the volume",
		ctrlVideoMute: "mute",
		ctrlDialogFullscreen: "full screen",
		ctrlDialogQuit: "quit",
		ctrlKeyEnd: "End",
		ctrlKeyEsc: "Escape",

		uploadAllType: "All files are accepted.[br]Maximum size: § MB.",
		uploadOneType: "Accepted file format: §.[br]Maximum size: § MB.",
		uploadMultiType: "Accepted file formats: § and §.[br]Maximum size: § MB.",
		uploadDecimal: ".",
		upload10: "§% (§ KB/s)",
		upload11: "§% (§ KB/s - § minutes left)",
		upload12: "§% (§ KB/s - § minute left)",
		upload13: "§% (§ KB/s - § seconds left)",
		upload20: "§% (at § KB/s)",
		upload21: "§% (at § KB/s in § minutes)",
		upload22: "§% (at § KB/s in § minute)",
		upload23: "§% (at § KB/s in § seconds)",

		uploadBadType: "It's impossible to send the file because the proposed file format isn't allowed. Proposed file format: §.",
		uploadBadSize: "It's impossible to send the file because the file size is too large. Proposed file size: § MB.",
		uploadEmpty: "It's impossible to send the file because the file is empty.",
		uploadError1: "An error occurred while sending the file.[br][em]➩ Erreur §.[/em]",
		uploadError2: "An error occurred while processing the file.[/p][p]§",

		debugInvalidCall: "(debug) Invalid call",
		debugInvalidUse:  "(debug) Invalid use",
		debugUnknownConfig: "Unknown configuration (§).",
		debugBadUse: "The upload dialog must be called with §."
	};

	// = fr-FR (français/France)
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	this.data.fr = {
		buttonOk: "Ok",
		buttonCancel: "Annuler",
		buttonConfirm: "Valider",
		buttonClose: "Fermer",
		buttonPrev: "Précédent",
		buttonNext: "Suivant",
		buttonBrowse: "Choisir un fichier",

		userLeavePage: "Vous vous apprêtez à partir...",
		operationTooLong: "Cette opération prend trop de temps ? ",
		warningLostChange: "Attention : toutes les modifications en cours seront perdues.",
		reloadLink: "Rechargez la page",
		operationInProgress: "Opération en cours...",
		uploadInProgress: "Envoi du fichier en cours...",
		error404: "Erreur 404\n Le fichier n'existe pas.",

		ctrlSlideshowFirstLast: "début/fin",
		ctrlSlideshowNextPrev: "précédent/suivant",
		ctrlVideoPause: "lecture/pause",
		ctrlVideoTime: "reculer/avancer",
		ctrlVideoSound: "baisser/augmenter le volume",
		ctrlVideoMute: "couper le son",
		ctrlDialogFullscreen: "plein écran",
		ctrlDialogQuit: "quitter",
		ctrlKeyEnd: "Fin",
		ctrlKeyEsc: "Échap",

		uploadAllType: "Tous les fichiers sont acceptés.[br]Taille maximale : § Mo.",
		uploadOneType: "Format de fichier accepté : §.[br]Taille maximale : § Mo.",
		uploadMultiType: "Formats de fichier acceptés : § et §.[br]Taille maximale : § Mo.",
		uploadDecimal: ",",
		upload10: "§% (§ Ko/s)",
		upload11: "§% (§ Ko/s - § minutes restantes)",
		upload12: "§% (§ Ko/s - § minute restante)",
		upload13: "§% (§ Ko/s - § secondes restantes)",
		upload20: "§% (à § Ko/s)",
		upload21: "§% (à § Ko/s en § minutes)",
		upload22: "§% (à § Ko/s en § minute)",
		upload23: "§% (à § Ko/s en § secondes)",

		uploadBadType: "Il est impossible d'envoyer le fichier car le format du fichier proposé n'est pas autorisé. Format du fichier proposé : §.",
		uploadBadSize: "Il est impossible d'envoyer le fichier car la taille du fichier proposé est trop importante. Taille du fichier proposé : § Mo.",
		uploadEmpty: "Il est impossible d'envoyer le fichier car le fichier est vide.",
		uploadError1: "Une erreur est survenue lors de l'envoi du fichier.[br][em]➩ Erreur §.[/em]",
		uploadError2: "Une erreur est survenue lors du traitement du fichier.[/p][p]§"
	};


	// #### Auto-détection de la langue ############################################ private ### //
	// = révision : 17
	// » Essaye de récupérer la langue utilisée par la page web
	// » Prend soin de vérifier que la configuration de la langue est correcte
	this.init = function () {

		var autolang, html = document.querySelector('html');

		// langue automatique (auto, auto-fr...)
		if (apijs.config.lang.indexOf('auto') > -1) {

			// recherche du nœud html
			if (html.getAttribute('xml:lang'))
				autolang = html.getAttribute('xml:lang').slice(0, 2);
			else if (html.getAttribute('lang'))
				autolang = html.getAttribute('lang').slice(0, 2);

			// définition de la langue
			if ((typeof autolang === 'string') && this.data.hasOwnProperty(autolang))
				apijs.config.lang = autolang;
			else if (apijs.config.lang.indexOf('auto-') > -1)
				apijs.config.lang = apijs.config.lang.slice(5);
		}

		// langue par défaut
		if (!this.data.hasOwnProperty(apijs.config.lang))
			apijs.config.lang = 'en';
	};


	// #### Traduction par mot clef ################################################# public ### //
	// = révision : 29
	// » Vérifie si le mot clef existe dans les traductions
	// » Renvoie la chaîne de caractères correspondante à un mot clef
	// » Renvoie un nœud texte en plus de la traduction si besoin
	this.translate = function (word) {

		var lang = apijs.config.lang, i = 0, arg = 1, translation = '', data;

		// mot clef inexistant dans la langue configurée
		// test avec la langue par défaut pour éventuellement continuer
		if (typeof this.data[lang][word] !== 'string') {

			if ((lang !== 'en') && (typeof this.data.en[word] === 'string'))
				lang = 'en';
			else
				return word;
		}

		// chaîne de caractères configurable
		if (arguments.length > 1) {

			for (data = this.data[lang][word].split('§'); i < data.length; i++)
				translation += (arg < arguments.length) ? data[i] + arguments[arg++] : data[i];

			return translation;
		}

		// chaîne de caractères simple
		return this.data[lang][word];
	};

	this.nodeTranslate = function (word) {
		return document.createTextNode(this.translate(word));
	};


	// #### Changement de langue #################################################### public ### //
	// = révision : 6
	// » Vérifie si la langue demandée existe dans la liste des langues disponibles ou utilise la détection automatique
	// » Renvoie true si la langue a été modifiée et false dans le cas contraire
	this.changeLang = function (lang) {

		if (typeof lang === 'string') {

			if (this.data.hasOwnProperty(lang)) {
				apijs.config.lang = lang;
				return true;
			}
			if (lang.indexOf('auto') > -1) {
				apijs.config.lang = lang;
				this.init();
				return true;
			}
		}

		return false;
	};
};