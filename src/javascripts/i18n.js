/**
 * Created S/05/06/2010
 * Updated V/05/04/2013
 * Version 30
 *
 * Copyright 2008-2013 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>, Brian Legrand <brianyouhouy~live~fr>
	this.data.en = {
		buttonOk: "Ok",
		buttonRetry: "Retry",
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
		uploadAllType: "All files are accepted.[br]Maximum size: § [abbr title='Megabyte']MB[/abbr]",
		uploadOneType: "Accepted file format: §[br]Maximum size: § [abbr title='Megabyte']MB[/abbr]",
		uploadMultiType: "Accepted file formats: § and §[br]Maximum size: § [abbr title='Megabyte']MB[/abbr]",
		uploadBadOneType: "[p]It's impossible to send the file because the file format proposed isn't allowed.[/p][p]➩ Proposed file: [strong]§[/strong][br]➩ Accepted file format: §[/p]",
		uploadBadMultiType: "[p]It's impossible to send the file because the file format proposed isn't allowed.[/p][p]➩ Proposed file: [strong]§[/strong][br]➩ Accepted file formats: § and §[/p]",
		uploadBadSize: "[p]It's impossible to send the file because the file size is too large.[/p][p]➩ Proposed file: [strong]§[/strong][br]➩ File size: § (§ maximum)[/p]",
		uploadBadSizeDecimal: ".",
		uploadBadSizeK: "§ KB",
		uploadBadSizeM: "§ MB",

		deleteNotFound: "Unfortunately, it's currently impossible to delete requested file (Error §: §).",
		browserNoVideo: "[p]Your browser [strong]§ §[/strong] doesn't support the <video> tag.[br]To watch this video, you need to upgrade your browser.[/p][ul][li][a href='http://www.google.com/chrome?hl=en' class='popup']Chrome 4.0+[/a][/li][li][a href='http://www.mozilla-europe.org/en/firefox/' class='popup']Firefox 3.5+[/a][/li][li][a href='http://windows.microsoft.com/en-US/internet-explorer/products/ie/home' class='popup']Internet Explorer 9.0+[/a][/li][li][a href='http://www.opera.com/' class='popup']Opera 10.50+[/a][/li][li][a href='http://www.apple.com/safari/' class='popup']Safari 4.0+[/a][/li][/ul][p]It is also possible that the <video> tag is supported, but the codec used by the video (§) does not.[/p][p class='navigator']Your browser identifies itself as: §[/p]",

		debugInvalidCall: "(debug) Invalid call",
		debugUnknownAction: "(debug) Unknown action",
		debugKeyDetected: "(debug) Key detected",
		debugKeyCode: "Code of the seizure key: §",
		debugInvalidConfig: "(debug) Invalid configuration",
		debugNotRecognizedConfig: "Image configuration wasn't recognized.",
		debugNotExist: "doesn't exist (unlikely error)",
		debugBadUse: "The upload dialog must be called with apijs.upload.sendFile()."
	};
	// = Français
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	this.data.fr = {
		buttonOk: "Ok",
		buttonRetry: "Réessayer",
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
		uploadAllType: "Tous les fichiers sont acceptés.[br]Taille maximale : § [abbr title='Mégaoctet']Mo[/abbr]",
		uploadOneType: "Format de fichier accepté : §[br]Taille maximale : § [abbr title='Mégaoctet']Mo[/abbr]",
		uploadMultiType: "Formats de fichier acceptés : § et §[br]Taille maximale : § [abbr title='Mégaoctet']Mo[/abbr]",
		uploadBadOneType: "[p]Il est impossible d'envoyer le fichier car le format du fichier proposé n'est pas autorisé.[/p][p]➩ Fichier proposé : [strong]§[/strong][br]➩ Format de fichier accepté : §[/p]",
		uploadBadMultiType: "[p]Il est impossible d'envoyer le fichier car le format du fichier proposé n'est pas autorisé.[/p][p]➩ Fichier proposé : [strong]§[/strong][br]➩ Formats de fichier acceptés : § et §[/p]",
		uploadBadSize: "[p]Il est impossible d'envoyer le fichier car la taille du fichier proposé est trop importante.[/p][p]➩ Fichier proposé : [strong]§[/strong][br]➩ Taille du fichier : § (§ maximum)[/p]",
		uploadBadSizeDecimal: ",",
		uploadBadSizeK: "§ Ko",
		uploadBadSizeM: "§ Mo",

		deleteNotFound: "Malheureusement, il est actuellement impossible de supprimer le fichier demandé (Erreur § : [span xml:lang='en']§[/span]).",
		browserNoVideo: "[p]Votre navigateur [strong]§ §[/strong] ne supporte pas la balise <video>.[br]Pour voir cette vidéo, vous devez mettre à jour votre navigateur.[/p][ul][li][a href='http://www.google.com/chrome?hl=fr' class='popup']Chrome 4.0+[/a][/li][li][a href='http://www.mozilla-europe.org/fr/firefox/' class='popup']Firefox 3.5+[/a][/li][li][a href='http://windows.microsoft.com/fr-FR/internet-explorer/products/ie/home' class='popup']Internet Explorer 9.0+[/a][/li][li][a href='http://www.opera.com/' class='popup']Opera 10.50+[/a][/li][li][a href='http://www.apple.com/fr/safari/' class='popup']Safari 4.0+[/a][/li][/ul][p]Il se peut également que la balise <video> soit supportée, mais que le codec utilisé par la vidéo (§) ne le soit pas.[/p][p class='navigator']Votre navigateur s'identifie en tant que : §[/p]",

		debugInvalidCall: "(debug) Appel invalide",
		debugUnknownAction: "(debug) Action inconnue",
		debugKeyDetected: "(debug) Touche détectée",
		debugKeyCode: "Code de la touche saisie : §",
		debugInvalidConfig: "(debug) Configuration invalide",
		debugNotRecognizedConfig: "La configuration de l'image n'a pas été reconnue.",
		debugNotExist: "n'existe pas (erreur improbable)",
		debugBadUse: "Le dialogue d'upload doit être appelé via apijs.upload.sendFile()."
	};


	// #### Auto-détection de la langue ############################################# public ### //
	// = révision : 16
	// » Essaye de récupérer la langue utilisée par la page web
	// » Vérifie ensuite si elle existe dans la liste des langues disponibles
	// » Prend soin de vérifier que la configuration de la langue est correcte
	this.init = function () {

		var autolang;

		// langue automatique (exemple : auto auto-fr)
		if (apijs.config.lang.indexOf('auto') > -1) {

			// recherche du nœud html
			if (document.getElementsByTagName('html')[0].getAttribute('xml:lang'))
				autolang = document.getElementsByTagName('html')[0].getAttribute('xml:lang').slice(0, 2);
			else if (document.getElementsByTagName('html')[0].getAttribute('lang'))
				autolang = document.getElementsByTagName('html')[0].getAttribute('lang').slice(0, 2);

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
	// = révision : 24
	// » Vérifie si le mot clef existe dans les traductions
	// » Renvoie la chaine de caractères correspondante à un mot clef
	this.translate = function (word) {

		var lang = apijs.config.lang;

		// mot clef inexistant dans la langue configurée
		// test avec la langue EN pour éventuellement continuer
		if (typeof this.data[lang][word] !== 'string') {

			if ((lang !== 'en') && (typeof this.data['en'][word] === 'string'))
				lang = 'en';
			else
				return word;
		}

		// chaine de caractères configurable
		if (arguments.length > 1) {

			var i = 0, arg = 1, data, translation = '';

			for (data = this.data[lang][word].split('§'); i < data.length; i++)
				translation += (arg < arguments.length) ? data[i] + arguments[arg++] : data[i];

			return translation;
		}

		// chaine de caractères simple
		return this.data[lang][word];
	};


	// #### Changement de langue #################################################### public ### //
	// = révision : 4
	// » Vérifie si la langue demandée existe dans la liste des langues disponibles ou utilie la détection automatique
	// » Renvoie true si la langue a été modifiée et false dans le cas contraire
	this.changeLang = function (lang) {

		if (lang.indexOf('auto') > -1) {
			apijs.config.lang = lang;
			this.init();
			return true;
		}

		if ((typeof lang === 'string') && this.data.hasOwnProperty(lang)) {
			apijs.config.lang = lang;
			return true;
		}

		return false;
	};
};