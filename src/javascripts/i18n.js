/**
 * Created S/05/06/2010
 * Updated S/26/02/2011
 * Version 15
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
		buttonPrev: "Previous",
		buttonNext: "Next",

		downloadLink: "Laden",
		operationTooLong: "This operation is too long ? ",
		warningLostChange: "Achtung : alle laufenden änderungen werden verloren.",
		reloadLink: "Seite nochmal laden",
		operationInProgress: "Laufende Aktion...",
		savingInProgress: "Saving...",
		browserNoVideo: "[p]Your browser doesn't support the <video> element.[br]Remember to upgrade your browser.[/p][ul][li][a href='http://www.google.com/chrome?hl=en' class='popup']Chrome 3.0+[/a][/li][li][a href='http://www.mozilla-europe.org/en/firefox/' class='popup']Firefox 3.5+[/a][/li][li][a href='http://www.konqueror.org/' class='popup']Konqueror 4.4+[/a][/li][li][a href='http://www.opera.com/' class='popup']Opera 10.50+[/a][/li][li][a href='http://www.apple.com/safari/' class='popup']Safari 3.1+[/a][/li][/ul]",

		debugInvalidCall: "(debug) Invalid call",
		debugInvalidUse: "(debug) Invalid use",
		debugUnknownAction: "(debug) Unknown action",
		debugKeyDetected: "(debug) Key detected",
		debugKeyCode: "Code of the seizure key : §",
		debugInvalidAltAttribute: "(debug) Invalid alt attribute",
		debugNotRecognizedAltAttribute: "The alt attribute of the image wasn't recognized",
		debugNotExist: "doesn't exist (unlikely error)"
	};

	// English
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	// » Brian Legrand <brianyouhouy~live~fr>
	this.data.en = {
		buttonOk: "Ok",
		buttonCancel: "Cancel",
		buttonConfirm: "Confirm",
		buttonClose: "Close",
		buttonPrev: "Previous",
		buttonNext: "Next",

		downloadLink: "Download",
		operationTooLong: "This operation is too long ? ",
		warningLostChange: "Warning : all changes in progress will be lost.",
		reloadLink: "Reload this page",
		operationInProgress: "Operation in progress...",
		savingInProgress: "Saving...",
		browserNoVideo: "[p]Your browser doesn't support the <video> element.[br]Remember to upgrade your browser.[/p][ul][li][a href='http://www.google.com/chrome?hl=en' class='popup']Chrome 3.0+[/a][/li][li][a href='http://www.mozilla-europe.org/en/firefox/' class='popup']Firefox 3.5+[/a][/li][li][a href='http://www.konqueror.org/' class='popup']Konqueror 4.4+[/a][/li][li][a href='http://www.opera.com/' class='popup']Opera 10.50+[/a][/li][li][a href='http://www.apple.com/safari/' class='popup']Safari 3.1+[/a][/li][/ul]",

		debugInvalidCall: "(debug) Invalid call",
		debugInvalidUse: "(debug) Invalid use",
		debugUnknownAction: "(debug) Unknown action",
		debugKeyDetected: "(debug) Key detected",
		debugKeyCode: "Code of the seizure key : §",
		debugInvalidAltAttribute: "(debug) Invalid alt attribute",
		debugNotRecognizedAltAttribute: "The alt attribute of the image wasn't recognized",
		debugNotExist: "doesn't exist (unlikely error)"
	};

	// Français
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	this.data.fr = {
		buttonOk: "Ok",
		buttonCancel: "Annuler",
		buttonConfirm: "Valider",
		buttonClose: "Fermer",
		buttonPrev: "Précédent",
		buttonNext: "Suivant",

		downloadLink: "Télécharger",
		operationTooLong: "Cette opération prend trop de temps ? ",
		warningLostChange: "Attention : toutes les modifications en cours seront perdues.",
		reloadLink: "Rechargez la page",
		operationInProgress: "Opération en cours...",
		savingInProgress: "Enregistrement en cours...",
		browserNoVideo: "[p]Votre navigateur ne supporte pas l'élément <video>.[br]Pensez à mettre à jour votre navigateur.[/p][ul][li][a href='http://www.google.com/chrome?hl=fr' class='popup']Chrome 3.0+[/a][/li][li][a href='http://www.mozilla-europe.org/fr/firefox/' class='popup']Firefox 3.5+[/a][/li][li][a href='http://www.konqueror.org/' class='popup']Konqueror 4.4+[/a][/li][li][a href='http://www.opera.com/' class='popup']Opera 10.50+[/a][/li][li][a href='http://www.apple.com/fr/safari/' class='popup']Safari 3.1+[/a][/li][/ul]",

		debugInvalidCall: "(debug) Appel invalide",
		debugInvalidUse: "(debug) Utilisation invalide",
		debugUnknownAction: "(debug) Action inconnue",
		debugKeyDetected: "(debug) Touche détectée",
		debugKeyCode: "Code de la touche saisie : §",
		debugInvalidAltAttribute: "(debug) Attribut alt invalide",
		debugNotRecognizedAltAttribute: "L'attribut alt de l'image n'a pas été reconnu",
		debugNotExist: "n'existe pas (erreur improbable)"
	};


	// #### Auto-détection de la langue ############################################# public ### //
	// = révision : 9
	// » Essaye de récupérer la langue utilisée par la page web
	// » Vérifie ensuite si elle existe dans la liste des langues disponibles
	// » Prend soin de vérifier que la configuration de la langue est correcte
	this.init = function () {

		if (apijs.config.autolang) {

			var autolang = null;

			if (document.getElementsByTagName('html')[0].getAttribute('xml:lang'))
				autolang = document.getElementsByTagName('html')[0].getAttribute('xml:lang').slice(0, 2);

			else if (document.getElementsByTagName('html')[0].getAttribute('lang'))
				autolang = document.getElementsByTagName('html')[0].getAttribute('lang').slice(0, 2);

			if ((typeof autolang === 'string') && (autolang in this.data))
				apijs.config.lang = autolang;

			else if ((typeof apijs.config.lang !== 'string') || !(apijs.config.lang in this.data))
				apijs.config.lang = 'en';
		}

		else if ((typeof apijs.config.lang !== 'string') || !(apijs.config.lang in this.data)) {
			apijs.config.lang = 'en';
		}
	};


	// #### Traduction par mot clef ################################################# public ### //
	// = révision : 16
	// » Vérifie si le mot clef existe dans les traductions
	// » Renvoie la chaine de caractères correspondante à un mot clef
	this.translate = function (word) {

		// mot clef inexistant
		if (typeof this.data[apijs.config.lang][word] !== 'string') {
			return word;
		}

		// chaine de caractères configurable
		else if (arguments.length > 1) {

			for (var data = this.data[apijs.config.lang][word].split('§'), i = 0, arg = 1, translation = ''; i < data.length; i++) {

				if (arg < arguments.length)
					translation += data[i] + arguments[arg++];
				else
					translation += data[i];
			}

			return translation;
		}

		// chaine de caractères simple
		else {
			return this.data[apijs.config.lang][word];
		}
	};
}