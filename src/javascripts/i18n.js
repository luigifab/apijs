/**
 * Created S/05/06/2010
 * Updated J/24/05/2012
 * Version 23
 *
 * Copyright 2008-2012 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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

	// #### Définition des traductions ############################################## public ### //
	// » Translations are published under the terms of the BSD license
	// = English
	// » Fabrice Creuzot (luigifab) <code~luigifab~info> & Brian Legrand <brianyouhouy~live~fr>
	this.data.en = {
		buttonOk: "Ok",
		buttonCancel: "Cancel",
		buttonConfirm: "Confirm",
		buttonClose: "Close",
		buttonPrev: "Previous",
		buttonNext: "Next",

		downloadLink: "Download",
		operationTooLong: "This operation is too long ? ",
		warningLostChange: "Warning: all changes in progress will be lost.",
		reloadLink: "Reload this page",
		operationInProgress: "Operation in progress...",
		uploadInProgress: "Upload in progress...",
		savingInProgress: "Saving...",

		uploadTime: "§% (§)",
		uploadRate: "§% (§ KB/s)",
		uploadRateTime: "§% (§ KB/s - §)",
		uploadAllType: "All files are accepted.[br]Maximum size: § [abbr title='Megabyte']MB[/abbr].",
		uploadOneType: "Accepted file format: §.[br]Maximum size: § [abbr title='Megabyte']MB[/abbr].",
		uploadMultiType: "Accepted file formats: § and §.[br]Maximum size: § [abbr title='Megabyte']MB[/abbr].",
		uploadBadOneType: "[p]It's impossible to send the file because the file format proposed isn't allowed.[/p][p]➩ Proposed file: [strong]§[/strong][br]➩ Accepted file format: §.[/p]",
		uploadBadMultiType: "[p]It's impossible to send the file because the file format proposed isn't allowed.[/p][p]➩ Proposed file: [strong]§[/strong][br]➩ Accepted file formats: § and §.[/p]",
		deleteNotFound: "Unfortunately, it's currently impossible to delete requested file (Error §: §).",

		browserNoVideo: "[p]Your browser doesn't support the <video> tag.[br]Please upgrade your browser.[/p][ul][li][a href='http://www.google.com/chrome?hl=en' class='popup']Chrome 3.0+[/a][/li][li][a href='http://www.mozilla-europe.org/en/firefox/' class='popup']Firefox 3.5+[/a][/li][li][a href='http://windows.microsoft.com/en-US/internet-explorer/products/ie/home' class='popup']Internet Explorer 9.0+[/a][/li][li][a href='http://www.konqueror.org/' class='popup']Konqueror 4.4+[/a][/li][li][a href='http://www.opera.com/' class='popup']Opera 10.50+[/a][/li][li][a href='http://www.apple.com/safari/' class='popup']Safari 3.1+[/a][/li][/ul]",

		debugInvalidCall: "(debug) Invalid call",
		debugInvalidUse: "(debug) Invalid use",
		debugUnknownAction: "(debug) Unknown action",
		debugKeyDetected: "(debug) Key detected",
		debugKeyCode: "Code of the seizure key: §",
		debugInvalidConfig: "(debug) Invalid configuration",
		debugNotRecognizedConfig: "Image configuration wasn't recognized",
		debugNotExist: "doesn't exist (unlikely error)"
	};
	// = Français
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
		uploadInProgress: "Envoi du fichier en cours...",
		savingInProgress: "Enregistrement en cours...",

		uploadTime: "§% (§)",
		uploadRate: "§% (§ Ko/s)",
		uploadRateTime: "§% (§ Ko/s - §)",
		uploadAllType: "Tous les fichiers sont acceptés.[br]Taille maximale : § [abbr title='Mégaoctet']Mo[/abbr].",
		uploadOneType: "Format de fichier accepté : §.[br]Taille maximale : § [abbr title='Mégaoctet']Mo[/abbr].",
		uploadMultiType: "Formats de fichier acceptés : § et §.[br]Taille maximale : § [abbr title='Mégaoctet']Mo[/abbr].",
		uploadBadOneType: "[p]Il est impossible d'envoyer le fichier car le format du fichier proposé n'est pas autorisé.[/p][p]➩ Fichier proposé : [strong]§[/strong][br]➩ Format de fichier accepté : §.[/p]",
		uploadBadMultiType: "[p]Il est impossible d'envoyer le fichier car le format du fichier proposé n'est pas autorisé.[/p][p]➩ Fichier proposé : [strong]§[/strong][br]➩ Formats de fichier acceptés : § et §.[/p]",
		deleteNotFound: "Malheureusement, il est actuellement impossible de supprimer le fichier demandé (Erreur § : [span xml:lang='en']§[/span]).",

		browserNoVideo: "[p]Votre navigateur ne supporte pas la balise <video>.[br]Veuillez mettre à jour votre navigateur.[/p][ul][li][a href='http://www.google.com/chrome?hl=fr' class='popup']Chrome 3.0+[/a][/li][li][a href='http://www.mozilla-europe.org/fr/firefox/' class='popup']Firefox 3.5+[/a][/li][li][a href='http://windows.microsoft.com/fr-FR/internet-explorer/products/ie/home' class='popup']Internet Explorer 9.0+[/a][/li][li][a href='http://www.konqueror.org/' class='popup']Konqueror 4.4+[/a][/li][li][a href='http://www.opera.com/' class='popup']Opera 10.50+[/a][/li][li][a href='http://www.apple.com/fr/safari/' class='popup']Safari 3.1+[/a][/li][/ul]",

		debugInvalidCall: "(debug) Appel invalide",
		debugInvalidUse: "(debug) Utilisation invalide",
		debugUnknownAction: "(debug) Action inconnue",
		debugKeyDetected: "(debug) Touche détectée",
		debugKeyCode: "Code de la touche saisie : §",
		debugInvalidConfig: "(debug) Configuration invalide",
		debugNotRecognizedConfig: "La configuration de l'image n'a pas été reconnue",
		debugNotExist: "n'existe pas (erreur improbable)"
	};


	// #### Auto-détection de la langue ############################################# public ### //
	// = révision : 13
	// » Essaye de récupérer la langue utilisée par la page web
	// » Vérifie ensuite si elle existe dans la liste des langues disponibles
	// » Prend soin de vérifier que la configuration de la langue est correcte
	this.init = function () {

		// *** Détection de la langue *************************** //
		if (apijs.config.autolang) {

			var autolang = null;

			// recherche du nœud html
			if (document.getElementsByTagName('html')[0].getAttribute('xml:lang'))
				autolang = document.getElementsByTagName('html')[0].getAttribute('xml:lang').slice(0, 2);

			else if (document.getElementsByTagName('html')[0].getAttribute('lang'))
				autolang = document.getElementsByTagName('html')[0].getAttribute('lang').slice(0, 2);

			// définition de la langue
			if ((typeof autolang === 'string') && this.data.hasOwnProperty(autolang))
				apijs.config.lang = autolang;

			else if ((typeof apijs.config.lang !== 'string') || !this.data.hasOwnProperty(apijs.config.lang))
				apijs.config.lang = 'en';
		}

		// *** Langue par défaut ******************************** //
		else if ((typeof apijs.config.lang !== 'string') || !this.data.hasOwnProperty(apijs.config.lang)) {
			apijs.config.lang = 'en';
		}
	};


	// #### Traduction par mot clef ################################################# public ### //
	// = révision : 20
	// » Vérifie si le mot clef existe dans les traductions
	// » Renvoie la chaine de caractères correspondante à un mot clef
	this.translate = function (word) {

		// mot clef inexistant
		if (typeof this.data[apijs.config.lang][word] !== 'string') {
			return word;
		}

		// chaine de caractères configurable
		else if (arguments.length > 1) {

			var i = 0, arg = 1, data = '', translation = '';

			for (data = this.data[apijs.config.lang][word].split('§'); i < data.length; i++)
				translation += (arg < arguments.length) ? data[i] + arguments[arg++] : data[i];

			return translation;
		}

		// chaine de caractères simple
		else {
			return this.data[apijs.config.lang][word];
		}
	};


	// #### Changement de langue #################################################### public ### //
	// = révision : 2
	// » Vérifie si la langue demandée existe dans la liste des langues disponibles
	// » Renvoie true si la langue a été modifiée et false dans le cas contraire
	this.changeLang = function (lang) {

		if ((typeof lang === 'string') && this.data.hasOwnProperty(lang)) {
			apijs.config.lang = lang;
			return true;
		}
		else {
			return false;
		}
	};
};