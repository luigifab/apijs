/**
 * Created S/05/06/2010
 * Updated V/01/10/2010
 * Version 11
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

function Internationalization() {

	// définition des traductions
	this.data = [];

	// Deutsch
	// » Dacrydium SARL <contact~dacrydium~fr>
	this.data.de = {
		buttonOk: "Ok",
		buttonCancel: "Abbrechen",
		buttonConfirm: "Bestätigen",
		buttonClose: "Ende",

		downloadLink: "Laden",
		operationTooLong: "This operation is too long ? ",
		warningLostChange: "Achtung : alle laufenden änderungen werden verloren.",
		reloadLink: "Seite nochmal laden",

		debugInvalidCall: "(debug) Invalid call",
		debugInvalidUse: "(debug) Invalid use",
		debugInvalidAltAttribute: "(debug) Invalid alt attribute",
		debugUnknownAction: "(debug) Unknown action",
		debugKeyDetected: "(debug) Key detected",
		debugKeyCode: "Code of the seizure key : §",
		debugNotExist: "doesn't exist (unlikely error).",
		debugNotRecognizedAltAttribute: "The alt attribute of the image wasn't recognized."
	};

	// English
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	// » Brian Legrand <brianyouhouy~live~fr>
	this.data.en = {
		buttonOk: "Ok",
		buttonCancel: "Cancel",
		buttonConfirm: "Confirm",
		buttonClose: "Close",

		downloadLink: "Download",
		operationTooLong: "This operation is too long ? ",
		warningLostChange: "Warning : all changes in progress will be lost.",
		reloadLink: "Reload this page",

		debugInvalidCall: "(debug) Invalid call",
		debugInvalidUse: "(debug) Invalid use",
		debugInvalidAltAttribute: "(debug) Invalid alt attribute",
		debugUnknownAction: "(debug) Unknown action",
		debugKeyDetected: "(debug) Key detected",
		debugKeyCode: "Code of the seizure key : §",
		debugNotExist: "doesn't exist (unlikely error).",
		debugNotRecognizedAltAttribute: "The alt attribute of the image wasn't recognized."
	};

	// Français
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	this.data.fr = {
		buttonOk: "Ok",
		buttonCancel: "Annuler",
		buttonConfirm: "Valider",
		buttonClose: "Fermer",

		downloadLink: "Télécharger",
		operationTooLong: "Cette opération prend trop de temps ? ",
		warningLostChange: "Attention : toutes les modifications en cours seront perdues.",
		reloadLink: "Rechargez la page",

		debugInvalidCall: "(debug) Appel invalide",
		debugInvalidUse: "(debug) Utilisation invalide",
		debugInvalidAltAttribute: "(debug) Attribut alt invalide",
		debugUnknownAction: "(debug) Action inconnue",
		debugKeyDetected: "(debug) Touche détectée",
		debugKeyCode: "Code de la touche saisie : §",
		debugNotExist: "n'existe pas (erreur improbable).",
		debugNotRecognizedAltAttribute: "L'attribut alt de l'image n'a pas été reconnu."
	};


	// #### Auto-détection de la langue ############################################# public ### //
	// = révision : 5
	// » Essaye de récupérer la langue utilisée par le navigateur
	// » Vérifie si la langue existe dans les traductions disponibles
	this.init = function () {

		if ((typeof navigator.language === 'string') && config.autolang && (navigator.language.slice(0, 2) in this.data))
			config.lang = navigator.language.slice(0, 2);

		else if ((typeof config.lang !== 'string') || !(config.lang in this.data))
			config.lang = 'en';
	};


	// #### Traduction par mot clef ################################################# public ### //
	// = révision : 12
	// » Vérifie si le mot clef existe dans les traductions
	// » Retourne la chaine de caractères correspondante à un mot clef
	this.translate = function (word, a, b, c, d, e) {

		// mot clef inexistant
		if (typeof this.data[config.lang][word] !== 'string') {
			return word;
		}

		// chaine de caractères configurable
		else if (arguments.length > 1) {

			var i = 0, arg = 1, translation = '', data = this.data[config.lang][word].split('§');

			for (i in data) if (data.hasOwnProperty(i)) {

				if (arg < arguments.length)
					translation += data[i] + arguments[arg++];
				else
					translation += data[i];
			}

			return translation;
		}

		// chaine de caractères simple
		else {
			return this.data[config.lang][word];
		}
	};
}
