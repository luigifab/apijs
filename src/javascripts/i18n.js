/**
 * Created S/05/06/2010
 * Updated J/19/08/2010
 * Version 9
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

	// définition des traductions
	this.data = [];

	// Deutsch
	// » Dacrydium SARL <contact@dacrydium.fr>
	this.data.de = {
		buttonOk: "Okay",
		buttonCancel: "Stornieren",
		buttonConfirm: "Bestätigen",
		buttonClose: "Ende",

		downloadLink: "",
		operationTooLong: "",
		reloadLink: "",
		warningLostChange: "",
		windowTooSmall: "",
		pressKeyPhoto: "",
		pressKeyVideo: "",

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
	// » Fabrice Creuzot <contact@luigifab.info>
	// » Brian Legrand <brianyouhouy@live.fr>
	this.data.en = {
		buttonOk: "Ok",
		buttonCancel: "Cancel",
		buttonConfirm: "Confirm",
		buttonClose: "Close",

		downloadLink: "Download",
		operationTooLong: "This operation is too long ? ",
		reloadLink: "Reload this page",
		warningLostChange: "Warning : all changes in progress will be lost.",
		windowTooSmall: "Window too small",
		pressKeyPhoto: "[p]Now press F11 to use full screen mode or enlarge the window.[/p][p]The size of the window (§x§) is smaller than the required size (§x§), so it doesn't allow the display of the picture.[/p]",
		pressKeyVideo: "[p]Now press F11 to use full screen mode or enlarge the window.[/p][p]The size of the window (§x§) is smaller than the required size (§x§), so it doesn't allow the display of the video.[/p]",

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
	// » Fabrice Creuzot <contact@luigifab.info>
	this.data.fr = {
		buttonOk: "Ok",
		buttonCancel: "Annuler",
		buttonConfirm: "Valider",
		buttonClose: "Fermer",

		downloadLink: "Télécharger",
		operationTooLong: "Cette opération prend trop de temps ? ",
		reloadLink: "Rechargez la page",
		warningLostChange: "Attention : toutes les modifications en cours seront perdues.",
		windowTooSmall: "Fenêtre trop petite",
		pressKeyPhoto: "[p]Appuyez maintenant sur F11 pour passer en mode plein écran, ou agrandissez la fenêtre.[/p][p]La taille de la fenêtre (§x§) est inférieure à la taille requise (§x§), elle ne permet donc pas l'affichage de la photo.[/p]",
		pressKeyVideo: "[p]Appuyez maintenant sur F11 pour passer en mode plein écran, ou agrandissez la fenêtre.[/p][p]La taille de la fenêtre (§x§) est inférieure à la taille requise (§x§), elle ne permet donc pas l'affichage de la vidéo.[/p]",

		debugInvalidCall: "(debug) Appel invalide",
		debugInvalidUse: "(debug) Utilisation invalide",
		debugInvalidAltAttribute: "(debug) Attribut alt invalide",
		debugUnknownAction: "(debug) Action inconnue",
		debugKeyDetected: "(debug) Touche détectée",
		debugKeyCode: "Code de la touche saisie : §",
		debugNotExist: "n'existe pas (erreur improbable).",
		debugNotRecognizedAltAttribute: "L'attribut alt de l'image n'a pas été reconnu."
	};


	// #### Autodétection de la langue ############################################## public ### //
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
	// = révision : 9
	// » Retourne la chaine de caractères correspondante à un mot clef
	// » En fonction de la langue définie dans la configuration
	this.translate = function (word, a, b, c, d, e) {

		// mot clef inexistant
		if (typeof this.data[config.lang][word] !== 'string') {
			return word;
		}

		// chaine de caractères configurable
		else if (arguments.length > 1) {

			var i = 1, j = 0, resultat = '', data = this.data[config.lang][word].split('§');

			for (j in data) if (data.hasOwnProperty(j)) {

				if (i < arguments.length)
					resultat += data[j] + arguments[i++];
				else
					resultat += data[j];
			}

			return resultat;
		}

		// chaine de caractères simple
		else {
			return this.data[config.lang][word];
		}
	};
}
