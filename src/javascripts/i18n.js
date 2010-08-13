/**
 * Created S/05/06/2010
 * Updated V/13/08/2010
 * Version 7
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

function Internationalization() {

	// #### Traduction ############################################################# private ### //
	// = révision : 6
	// » Définition des traductions disponibles
	this.i18n = new Array();

	// Deutsch
	// Dacrydium SARL <contact@dacrydium.fr>
	this.i18n.de = {
		buttonOk: "Okay",
		buttonCancel: "Stornieren",
		buttonConfirm: "Bestätigen",
		buttonClose: "",

		downloadLink: "",
		operationTooLong: "",
		reloadLink: "",
		warningLostChange: "",
		windowTooSmall: "",
		pressKeyF11: "",

		debugInvalidCall: "(debug) ",
		debugInvalidUse: "(debug) ",
		debugInvalidAltAttribute: "(debug) ",
		debugUnknownAction: "(debug) ",
		debugKeyDetected: "(debug) ",
		debugKeyCode: "",
		debugNotExist: "",
		debugNotRecognizedAltAttribute: ""
	};

	// English
	// Fabrice Creuzot <contact@luigifab.info>, Brian Legrand <brianyouhouy@live.fr>
	this.i18n.en = {
		buttonOk: "Ok",
		buttonCancel: "Cancel",
		buttonConfirm: "Confirm",
		buttonClose: "Close",

		downloadLink: "Download",
		operationTooLong: "This operation is too long ? ",
		reloadLink: "Reload this page",
		warningLostChange: "Warning : all changes in progress will be lost.",
		windowTooSmall: "Window too small",
		pressKeyF11: "Now press F11 to use full screen mode or enlarge the window.\n\nThe size of the window (§x§) is smaller than the required size (§x§), so it doesn't allow the display of the picture.",

		debugInvalidCall: "(debug) Invalid call",
		debugInvalidUse: "(debug) Invalid use",
		debugInvalidAltAttribute: "(debug) Invalid alt attribute",
		debugUnknownAction: "(debug) Unknown action",
		debugKeyDetected: "(debug) Key detected",
		debugKeyCode: "Code of the seizure key : ",
		debugNotExist: "doesn't exist (unlikely error).",
		debugNotRecognizedAltAttribute: "The alt attribute of the image wasn't recognized."
	};

	// Français
	// Fabrice Creuzot <contact@luigifab.info>
	this.i18n.fr = {
		buttonOk: "Ok",
		buttonCancel: "Annuler",
		buttonConfirm: "Valider",
		buttonClose: "Fermer",

		downloadLink: "Télécharger",
		operationTooLong: "Cette opération prend trop de temps ? ",
		reloadLink: "Rechargez la page",
		warningLostChange: "Attention : toutes les modifications en cours seront perdues.",
		windowTooSmall: "Fenêtre trop petite",
		pressKeyF11: "Appuyez maintenant sur F11 pour passer en mode plein écran, ou agrandissez la fenêtre.\n\nLa taille de la fenêtre (§x§) est inférieure à la taille requise (§x§) elle ne permet donc pas l'affichage de la photo.",

		debugInvalidCall: "(debug) Appel invalide",
		debugInvalidUse: "(debug) Utilisation invalide",
		debugInvalidAltAttribute: "(debug) Attribut alt invalide",
		debugUnknownAction: "(debug) Action inconnue",
		debugKeyDetected: "(debug) Touche détectée",
		debugKeyCode: "Code de la touche saisie : ",
		debugNotExist: "n'existe pas (erreur improbable).",
		debugNotRecognizedAltAttribute: "L'attribut alt de l'image n'a pas été reconnu."
	};


	// #### Autodétection de la langue ############################################## public ### //
	// = révision : 5
	// » Essaye de récupérer la langue utilisée par le navigateur
	// » Vérifie si la langue existe dans les traductions disponibles
	this.init = function () {

		if ((typeof navigator.language === 'string') && config.autolang && (navigator.language.slice(0, 2) in this.i18n))
			config.lang = navigator.language.slice(0, 2);

		else if ((typeof config.lang !== 'string') || !(config.lang in this.i18n))
			config.lang = 'en';
	};


	// #### Traduction par mot clef ################################################# public ### //
	// = révision : 7
	// » Retourne la chaine de caractères correspondante à un mot clef
	// » En fonction de la langue définie dans la configuration
	this.translate = function (word, a, b, c, d, e) {

		// chaine de caractères configurable
		if (arguments.length > 1) {

			var data = this.i18n[config.lang][word].split('§'), resultat = '';

			for (var i in data) if (data.hasOwnProperty(i)) {

				if (arguments.length > 0)
					resultat += data[i] + shift(arguments);
				else
					resultat += data[i];
			}

			return resultat;
		}

		// chaine de caractères simple
		else {
			return this.i18n[config.lang][word];
		}
	};
}
