"use strict";
/**
 * Created L/13/04/2009
 * Updated D/30/03/2014
 * Version 43
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

apijs.core.upload = function () {

	this.maxsize = 0;
	this.extensions = null;
	this.callback = null;
	this.args = null;
	this.icon = null;

	this.startTime = 0;
	this.updatedTime = 0;
	this.fileId = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DU DIALOGUE D'UPLOAD

	// #### Dialogue d'upload ###################################### debug ## i18n ## public ### //
	// = révision : 52
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Prépare et affiche le dialogue d'upload de [TheDialog]
	this.sendFile = function (title, action, inputname, maxsize, extensions, callback, args, icon) {

		if ((typeof title === 'string') && (typeof action === 'string') && (typeof inputname === 'string') &&
		    (typeof maxsize === 'number') && (typeof extensions === 'string') && (typeof callback === 'function')) {

			this.maxsize = maxsize;
			this.extensions = extensions.split(',');
			this.callback = callback;
			this.args = args;
			this.icon = icon;

			var text;
			maxsize = maxsize.toFixed(2).replace('.00', '').replace('.', apijs.i18n.translate('uploadDecimal'));

			if (this.extensions[0] === '*')
				text = apijs.i18n.translate('uploadAllType', maxsize);
			else if (this.extensions.length === 1)
				text = apijs.i18n.translate('uploadOneType', extensions, maxsize);
			else
				text = apijs.i18n.translate('uploadMultiType', this.extensions.slice(0, -1).join(', '), this.extensions.slice(-1), maxsize);

			apijs.dialog.dialogFormUpload(title, text, action, inputname, icon);
		}
		else {
			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.core.error('TheUpload.sendFile', 'debugInvalidCall', {
				'(string) *title': title,
				'(string) *action': action,
				'(string) *inputname': inputname,
				'(number) *maxsize': maxsize,
				'(string) *extensions': extensions,
				'(function) *callback': callback,
				'(mixed) args': args,
				'(string) icon': icon,
			});
		}
	};


	// #### Vérification du formulaire ############################ debug ## i18n ## private ### // TODO
	// = révision : 118
	// » Vérifie si le dialogue d'upload a été appelé via TheUpload (diffère l'éventuel message de debug de 12 ms)
	// » Vérifie la présence du fichier ; le type du fichier ; la taille du fichier (avec l'API File si disponible)
	// » Lorsque le fichier est bon lance l'envoi du fichier vers le serveur en mode asynchrone (AJAX) ou en mode synchrone
	// » Lorsque le fichier n'est pas bon (présence, type ou taille) affiche un message d'erreur détaillé
	// » Renvoie false dans tous les cas sauf lors de l'envoi en mode synchrone
	this.actionConfirm = function (action) {

		if (this.extensions === null) {
			window.setTimeout(apijs.upload.showDebug, 12);
			return false;
		}

		var tagInput = apijs.dialog.tagBox.querySelector('input'), tagError = apijs.dialog.tagBox.querySelector('div.status').firstChild,
		    checks = { filePresent: false, fileFormat: false, fileSize: false, format: '', size: this.maxsize	 };

		// *** Vérifications du fichier ************************* //
		// vérifie la présence du fichier ; le type du fichier ; la taille du fichier avec l'API File (si disponible)
		if (tagInput.value.length > 0) {

			// présence du fichier
			checks.filePresent = true;

			// format et taille du fichier
			// avec ou sans l'API File
			if (typeof tagInput.files === 'object') {
				checks.format = tagInput.files[0].name;
				checks.format = checks.format.slice(checks.format.lastIndexOf('.') + 1).toLowerCase();
				checks.size = tagInput.files[0].size;
			}
			else {
				checks.format = tagInput.value.slice(12); // replace('C:\\fakepath\\', '')
				checks.format = checks.format.slice(checks.format.lastIndexOf('.') + 1).toLowerCase();
			}

			// extension du fichier
			if ((this.extensions[0] === '*') || apijs.inArray(checks.format, this.extensions))
				checks.fileFormat = true;

			// taille du fichier (1 Mo = 1048576 octet)
			// size en octet, maxsize en Mo transformé en octet
			// s'assure aussi que la taille du fichier est supérieur à 0 octet
			if ((checks.size > 0) && (checks.size <= this.maxsize * 1048576))
				checks.fileSize = true;
		}

		// *** Traitement du fichier **************************** //
		// lorsque le fichier est bon lance l'envoi du fichier vers le serveur en mode asynchrone (AJAX) ou en mode synchrone
		// lorsque le fichier n'est pas bon (présence, type ou taille) affiche un message d'erreur détaillé
		if (checks.filePresent && checks.fileFormat && checks.fileSize) {

			// envoi en mode asynchrone (AJAX)
			// lancement de l'upload et affichage du dialogue de progression
			// sauf si le paramètre forceNoAjax est présent et sauf sur IE
			// FormData = function sauf pour safari
			if (((typeof FormData === 'function') || (typeof FormData === 'object')) && (typeof tagInput.files === 'object') &&
			    (action.indexOf('forceNoAjax') < 0) && (navigator.userAgent.indexOf('MSIE') < 0) && (navigator.userAgent.indexOf('Trident') < 0)) {

				this.startTime = this.updatedTime = Math.round(new Date().getTime() / 1000);
				this.startAsynchronousUpload(action);
				this.showProgress();
			}
			// envoi en mode synchrone
			else {
				return true;
			}
		}
		else {
			// format du fichier invalide
			if (checks.filePresent && !checks.fileFormat) {
				tagError.replaceData(0, tagError.nodeValue.length, apijs.i18n.translate('uploadBadType', checks.format));
			}
			// taille du fichier invalide (1 Mo = 1048576 octet)
			else if (checks.filePresent && !checks.fileSize) {
				if (checks.size > 0) {
					checks.size = (checks.size / 1048576).toFixed(2).replace('.00', '').replace('.', apijs.i18n.translate('uploadDecimal'));
					tagError.replaceData(0, tagError.nodeValue.length, apijs.i18n.translate('uploadBadSize', checks.size));
				}
				else {
					tagError.replaceData(0, tagError.nodeValue.length, apijs.i18n.translate('uploadEmpty'));
				}
			}

			apijs.dialog.tagBox.querySelector('button.browse').focus();
		}

		return false;
	};


	// #### Dialogues de progression et d'information ###################### i18n ## private ### //
	// = révision : 8
	// » Affiche le dialogue de progression
	// » Affiche le message d'erreur en cas d'erreur lors de l'envoi ou lors du traitement
	// » Affiche le message de debug en cas d'utilisation invalide
	this.showProgress = function () {
		apijs.dialog.dialogProgress(apijs.dialog.tagTitle.firstChild.nodeValue, apijs.i18n.translate('uploadInProgress'), apijs.upload.icon);
		if ((navigator.userAgent.indexOf('Safari') > 0) && (navigator.userAgent.indexOf('AppleWebkit') > 0))
			apijs.dialog.styles.remove('lock');
	};

	this.showError = function () {
		apijs.dialog.dialogInformation(apijs.dialog.tagTitle.firstChild.nodeValue, apijs.i18n.translate(this.fileId[0], this.fileId[1]), 'upload error');
		this.setPageTitle(null);
	};

	this.showDebug = function () {
		apijs.core.error('TheUpload.actionConfirm', 'debugInvalidUse', apijs.i18n.translate('debugBadUse', 'apijs.upload.sendFile()'));
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'UPLOAD

	// #### Gestion de l'envoi asynchrone ################################# event ## private ### // TODO
	// = révision : 108
	// » Lance l'envoi du fichier vers le serveur avec XMLHttpRequest 2
	// » Utilise l'adresse de l'action du formulaire de la boite de dialogue comme destination
	// » Crée un formulaire pour y envoyer le fichier sur POST et le paramètre isAjax=true sur GET
	// » Actualise la barre de progression toutes les 2 secondes de 1 à 99% (pourcentage, débit, temps restant)
	this.startAsynchronousUpload = function (action) {

		// préparation du formulaire
		var form = new FormData(), xhr = new XMLHttpRequest();
		form.append(apijs.dialog.tagBox.querySelector('input').getAttribute('name'), apijs.dialog.tagBox.querySelector('input').files[0]);

		xhr.open('POST', action + ((action.indexOf('?') > 0) ? '&isAjax=true' : '?isAjax=true'), true);

		// gestion des erreurs
		xhr.onreadystatechange = function () {

			if (xhr.readyState === 4) {

				if (xhr.status === 200) {

					if (xhr.responseText.indexOf('success-') === 0) {
						apijs.upload.fileId = ['success', xhr.responseText.slice(8)];
						window.setTimeout(apijs.upload.uploadOnSuccess.bind(apijs.upload), 3000);
					}
					else {
						apijs.upload.fileId = ['uploadError2', xhr.responseText];
						window.setTimeout(apijs.upload.showError.bind(apijs.upload), 1500);
					}
				}
				else {
					apijs.upload.fileId = ['uploadError1', xhr.status];
					window.setTimeout(apijs.upload.showError.bind(apijs.upload), 1500);
				}
			}
		};

		// gestion de l'envoi
		xhr.upload.addEventListener('progress', apijs.upload.uploadOnProgress, false);
		xhr.upload.addEventListener('load', apijs.upload.uploadOnLoad, false);

		// démarrage
		xhr.send(form);
	};

	this.uploadOnProgress = function (ev) {

		var percent, key = null, rate = null, time = null, elapsedTime, totalTime, currentTime = Math.round(new Date().getTime() / 1000);

		// mise à jour du pourcentage et éventuellement du débit et du temps restant
		// UNIQUEMENT si la dernière actualisation date de plus de 2 secondes
		// currentTime > updatedTime+1, par exemple 17 > 15+1
		if (ev.lengthComputable && (currentTime > (apijs.upload.updatedTime + 1))) {

			apijs.upload.updatedTime = currentTime;

			// ev.length = octets initialisés
			// ev.loaded = nombre d'octet envoyé sur le serveur
			// ev.total  = nombre d'octect à envoyer sur le serveur
			// pourcentage = nombre d'octect envoyé * 100 / nombre d'octet à envoyer
			percent = Math.round((ev.loaded * 100) / ev.total);

			// ARRÊT obligatoire
			if ((percent < 1) || (percent > 99))
				return;

			// titre de la page
			apijs.upload.setPageTitle(percent);

			// temps écoulé = maintenant - départ
			// temps total  = temps écoulé * 100 / pourcentage
			elapsedTime = currentTime - apijs.upload.startTime;
			totalTime   = elapsedTime * 100 / percent;

			// mise à jour du débit et éventuellement du temps restant
			// UNIQUEMENT si le temps écoulé est supérieur à 4 secondes
			if (elapsedTime > 4) {

				// débit en Ko/s = taille téléchargé / temps écoulé / 1024
				// temps restant = temps total - temps écoulé
				rate = Math.round(ev.loaded / elapsedTime / 1024);
				time = Math.round(totalTime - elapsedTime);

				// mise en forme du temps restant (grâce à la clef de traduction et aux nouvelles valeurs)
				// en minutes (au dessus de 57 secondes restantes) ou en secondes (en dessous)
				// UNIQUEMENT si le temps écoulé est supérieur à 9 secondes
				if (elapsedTime < 10) { key = 10; time = null; }
				else if (time > 119)  { key = 11; time = Math.round(time / 60); }
				else if (time > 89)   { key = 11; time = 2; }
				else if (time > 57)   { key = 12; time = 1; }
				else if (time > 45)   { key = 13; time = 50; }
				else if (time > 35)   { key = 13; time = 40; }
				else if (time > 25)   { key = 13; time = 30; }
				else if (time > 15)   { key = 13; time = 20; }
				else                  { key = 13; time = 10; }
			}

			// pourcentage + débit + temps restant : à partir de 10 secondes écoulées (clef de traduction 11,12,13)
			// pourcentage + débit : à partir de 5 secondes écoulées (clef de traduction 10)
			// pourcentage : (pas clef de traduction)
			apijs.upload.animToValue(percent, key, rate, time);
		}
	};

	this.uploadOnLoad = function (ev) {

		var time = Math.round(new Date().getTime() / 1000) - apijs.upload.startTime,
		    rate = Math.round(ev.loaded / time / 1024), key = null;

		// mise en forme du temps total (grâce à la clef de traduction)
		// en minutes (au dessus de 59 secondes) ou en secondes (au dessus de 9 secondes)
		if (rate < 1) { rate = null; time = null; }
		else if (time > 90) { key = 21; time = Math.round(time / 60); }
		else if (time > 59) { key = 22; time = 1; }
		else if (time > 9)  { key = 23; }
		else if ((rate > 0) && (rate !== Infinity)) { key = 20; time = null; }
		else { rate = null; time = null; }

		// titre de la page
		apijs.upload.setPageTitle(100);

		// pourcentage + débit + temps total en minutes (clef de traduction 21,22)
		// pourcentage + débit + temps total en secondes (clef de traduction 23)
		// pourcentage + débit (clef de traduction 20)
		// pourcentage (clef de traduction null)
		apijs.upload.animToValue(100, key, rate, time);
	};

	this.uploadOnSuccess = function () {

		this.setPageTitle(null);
		this.callback(this.fileId[1], this.args);

		// réinitialise les variables
		this.maxsize = 0;
		this.extensions = null;
		this.callback = null;
		this.args = null;
		this.icon = null;

		this.startTime = 0;
		this.updatedTime = 0;
		this.fileid = null;
	};


	// #### Titre de la page ###################################################### private ### //
	// = révision : 2
	// » Met à jour le titre de la page avec le pourcentage d'avancement de l'envoi
	// » Permet de connaitre l'avancement même si l'utilisateur est sur un autre onglet
	this.setPageTitle = function (percent) {

		if (percent !== null) {
			document.title = (/^[0-9]{1,3}% - /.test(document.title)) ?
				percent + '% - ' + document.title.slice(document.title.indexOf(' - ') + 3) : percent + '% - ' + document.title;
		}
		else if (/^[0-9]{1,3}% - /.test(document.title)) {
			document.title = document.title.slice(document.title.indexOf(' - ') + 3);
		}
	};


	// #### Gestion de la barre de progression ############################# i18n ## private ### //
	// = révision : 107
	// » Fait avancer la barre de progression en fonction des paramètres d'appels (de 1 à 100%)
	// » Affiche entre autre : 5%, 5% (10 Ko/s), 20% (10 Ko/s - 2 minutes restantes), 100% (à 11 Ko/s en 2 minutes)
	// » Tous les paramètres peuvent être null sauf le premier
	this.animToValue = function (percent, key, rate, time) {

		var rect = document.getElementById('apijsProgress').querySelector('rect'),
		    text = document.getElementById('apijsProgress').querySelector('text').firstChild,
		    data;

		if (percent > 99) {
			rect.setAttribute('class', 'end');
			rect.style.width = '';
			data = '100%';
		}
		else {
			rect.style.width = data = percent + '%';
			if (rect.hasAttribute('class'))
				rect.removeAttribute('class');
		}

		if ((typeof key === 'number') && (typeof rate === 'number') && (typeof time === 'number'))
			data = apijs.i18n.translate('upload' + key, percent, rate, time);
		else if ((typeof key === 'number') && (typeof rate === 'number'))
			data = apijs.i18n.translate('upload' + key, percent, rate);

		text.replaceData(0, text.length, data);
	};
};