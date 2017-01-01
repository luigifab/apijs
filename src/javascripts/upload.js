/**
 * Created L/13/04/2009
 * Updated V/23/12/2016
 *
 * Copyright 2008-2017 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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

	// Totalement testé et approuvé sur
	// Debian testing/64 : Firefox 45, Chromium 53
	// Windows 7/32 : IE 11, Firefox 22, Chrome 55, Opera 42
	// Windows 10/64 : Edge 14

	"use strict";
	this.title = null;
	this.action = null;
	this.inputname = null;
	this.extensions = null;
	this.callback = null;
	this.args = null;
	this.icon = null;

	this.maxsize = 0;
	this.startTime = 0;
	this.lastTime = 0;


	// GESTION DU DIALOGUE D'UPLOAD

	// #### Dialogue d'upload ############################################### i18n ## public ### //
	// = révision : 64
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Enregistre toutes les variables pour une utilisation ultérieure
	// » Le paramètre title vaut true lorsque l'utilisateur clique sur réessayer
	// » Prépare et affiche le dialogue d'upload de [TheDialog]
	this.sendFile = function (title, action, inputname, maxsize, extensions, callback, args, icon) {

		var text;

		if (arguments.length >= 6) {
			this.title  = title;
			this.action = action;
			this.inputname  = inputname;
			this.extensions = (typeof extensions === 'string') ? extensions.split(',') : [];
			this.callback   = callback;
			this.args = args;
			this.icon = icon;
			this.maxsize = maxsize;
		}
		else if (title !== true) {
			this.title = null;
		}

		if ((typeof this.title === 'string') && (typeof this.action === 'string') && (typeof this.inputname === 'string') &&
		    (typeof this.maxsize === 'number') && (this.extensions.length > 0) && (typeof this.callback === 'function')) {

			maxsize = this.maxsize.toFixed(2).replace('.00', '').replace('.', apijs.i18n.translate('uploadDecimal'));

			if (this.extensions[0] === '*')
				text = apijs.i18n.translate('uploadAllType', maxsize);
			else if (this.extensions.length === 1)
				text = apijs.i18n.translate('uploadOneType', this.extensions.join(','), maxsize);
			else
				text = apijs.i18n.translate('uploadMultiType', this.extensions.slice(0, -1).join(', '), this.extensions.slice(-1), maxsize);

			apijs.dialog.dialogFormUpload(this.title, text, this.action, this.inputname, this.icon);
		}
		else {
			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.error('TheUpload:sendFile', {
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


	// #### Vérification du formulaire ##################################### i18n ## private ### // TODO
	// = révision : 141
	// » Vérifie la présence du fichier ; le type du fichier ; la taille du fichier (avec l'API File si disponible)
	// » Lorsque le fichier est bon lance l'envoi du fichier vers le serveur en mode asynchrone ou en mode synchrone
	// » Lorsque le fichier n'est pas bon (présence, type ou taille) affiche un message d'erreur détaillé
	// » Le mode asynchrone est déclenché uniquement si le paramètre noAjax est présent
	this.actionConfirm = function () {

		var tagInput = apijs.html('#File'),
		    tagError = apijs.html('div.status').firstChild,
		    checks = { filePresent: false, fileType: true, fileSize: false, type: '', size: this.maxsize };

		// vérifications du fichier
		// vérifie la présence du fichier, le type du fichier, la taille du fichier
		if ((this.extensions !== null) && (tagInput.value.length > 0)) {

			checks.filePresent = true;

			// type du fichier (à la base, admis valide)
			if (this.extensions[0] !== '*') {
				checks.type = tagInput.value.slice(tagInput.value.lastIndexOf('.') + 1).toLowerCase();
				if (!this.extensions.has(checks.type))
					checks.fileType = false;
			}

			// taille du fichier
			// size en octet, maxsize en Mo (donc transformé en octet, 1 Mo = 1048576 octet)
			// s'assure aussi que la taille du fichier est supérieur à 0 octet
			if (typeof tagInput.files === 'object')
				checks.size = tagInput.files[0].size;
			if ((checks.size > 0) && (checks.size <= this.maxsize * 1048576))
				checks.fileSize = true;
		}

		// traitement du fichier
		// lorsque le fichier est bon lance l'envoi du fichier vers le serveur en mode synchrone ou en mode asynchrone
		// lorsque le fichier n'est pas bon (présence, type ou taille) affiche un message d'erreur détaillé
		if (checks.filePresent && checks.fileType && checks.fileSize) {

			if (this.action.indexOf('noAjax') > 0) {
				apijs.html('form').submit();
				window.setTimeout(apijs.upload.onStart.bind(this), 12);
			}
			else {
				this.ajaxSend();
			}
		}
		else if (this.extensions !== null) {

			if (checks.filePresent && !checks.fileType) {
				tagError.replaceData(0, tagError.nodeValue.length, apijs.i18n.translate('uploadBadType', checks.type));
			}
			else if (checks.filePresent && !checks.fileSize && (checks.size > 0)) {
				checks.size = (checks.size / 1048576).toFixed(2).replace('.00', '').replace('.', apijs.i18n.translate('uploadDecimal'));
				tagError.replaceData(0, tagError.nodeValue.length, apijs.i18n.translate('uploadBadSize', checks.size));
			}
			else if (checks.filePresent && !checks.fileSize) {
				tagError.replaceData(0, tagError.nodeValue.length, apijs.i18n.translate('uploadEmpty'));
			}

			apijs.html('button.browse').focus();
		}
	};



	// GESTION DE L'UPLOAD

	// #### Gestion de l'envoi asynchrone ########################## xhr ## event ## private ### // TODO
	// = révision : 141
	// » Utilise l'adresse de l'action du formulaire de la boite de dialogue comme destination
	// » Crée un formulaire pour y envoyer le fichier sur POST et le paramètre isAjax=true sur GET
	// » Ajoute le champ X-CSRF-Token au formulaire si disponible
	// » Met en place les gestionnaires d'événements associés (lonreadystatechange/oadstart/progress/load/error)
	// » En cas de succès, appelle la fonction callback avec ses paramètres [ callback(fileid, args) ]
	this.ajaxSend = function () {

		var form = new FormData(), xhr = new XMLHttpRequest();
		form.append(apijs.html('#File').getAttribute('name'), apijs.html('#File').files[0]);

		xhr.open('POST', this.action + ((this.action.indexOf('?') > 0) ? '&isAjax=true' : '?isAjax=true'), true);

		if (typeof apijs.config.upload.tokenValue === 'string')
			xhr.setRequestHeader('X-CSRF-Token', apijs.config.upload.tokenValue);

		// https://bugzilla.mozilla.org/show_bug.cgi?id=637002
		// http://stackoverflow.com/a/15491086
		// 'loadstart' When the request starts
		//  'progress' While sending and loading data
		//      'load' When the request has successfully completed even if the server hasn't responded that it finished
		//   'loadend' When the request has completed even if the server hasn't responded that it finished processing the request
		//     'error' When the request has failed
		//     'abort' When the request has been aborted (by invoking the abort method)
		//   'timeout' When the author specified timeout has passed before the request could complete
		xhr.onreadystatechange = function () {

			if ((xhr.readyState === 4) && (xhr.status === 200)) {
				var text = xhr.responseText.trim();
				apijs.log('ajaxSend:onreadystatechange status:200 message:' + text);
				if (text.indexOf('success-') === 0) {
					apijs.upload.updateTitle();
					apijs.upload.callback(text.slice(8), apijs.upload.args);
				}
				else {
					apijs.upload.onError('uploadError2', text);
				}
			}
			else if (xhr.readyState === 4) {
				apijs.log('ajaxSend:onreadystatechange status:' + xhr.status + ' message: ' + xhr.responseText);
				apijs.upload.onError('uploadError1', xhr.status);
			}
		};

		xhr.upload.onloadstart = apijs.upload.onStart.bind(this);
		xhr.upload.onprogress  = apijs.upload.onProgress.bind(this);
		xhr.upload.onload      = apijs.upload.onProgress.bind(this);
		xhr.upload.onerror     = apijs.upload.onError.bind(this);

		xhr.send(form);
	};


	// #### Gestion des erreurs ################################### event ## i18n ## private ### //
	// = révision : 31
	// » Affiche un message d'erreur détaillé après avoir réinitialisé le titre de la page
	// » Ne réinitialise plus les variables, conserve tout pour pouvoir relancer l'opération
	// » key=uploadError2 ou key=uploadError1 ou key=null
	this.onError = function (key, txt) {

		this.updateTitle();

		txt = ((typeof key === 'string') ? apijs.i18n.translate(key, txt) : apijs.i18n.translate('uploadError0')) + '[br][br]' + apijs.i18n.translate('uploadRestart', 'href="apijs://restart" onclick="apijs.upload.sendFile(true); return false;"');

		apijs.dialog.dialogInformation(this.title, txt, ([null, undefined].indexOf(this.icon) < 0) ? 'upload error ' + this.icon : 'upload error');
	};



	// GESTION DE LA PROGRESSION
	// Math.floor = entier inférieur, Math.ceil = entier supérieur, Math.round = au mieux

	// #### Affichage du dialogue ################################# event ## i18n ## private ### //
	// = révision : 11
	// » Sauvegarde l'heure de démarrage et affiche le dialogue de progression (avec son animation indéterminée)
	this.onStart = function () {

		this.startTime = this.lastTime = Math.round(new Date().getTime() / 1000);
		apijs.dialog.dialogProgress(this.title, apijs.i18n.translate('uploadInProgress'), this.icon);

		apijs.log('onStart:sending...');
	};


	// #### Gestion de l'avancement ####################################### event ## private ### // TODO?
	// = révision : 131
	// » Cherche à actualiser la barre de progression toutes les 2 secondes (uniquement de 1 à 99%)
	//   affiche le pourcentage, la vitesse à partir de 25 secondes, le temps restant à partir de 40 secondes ET 90 secondes de temps total
	// » Cherche à actualiser la barre de progression lorsque l'envoi du fichier est terminé (donc à 100%)
	//   affiche le pourcentage, le temps total à partir de 20 secondes, la vitesse si possible
	// » Dans tous les cas actualise également le titre de la page avec le pourcentage
	this.onProgress = function (ev) {

		var percent, key, rate, time, elapsedTime, totalTime, currentTime = Math.round(new Date().getTime() / 1000), mins;

		if (ev.lengthComputable && (ev.type === 'progress') && (currentTime >= (this.lastTime + 2))) {

			this.lastTime = currentTime;

			// ev.loaded = nombre d'octet envoyé sur le serveur
			// ev.total  = nombre d'octet à envoyer sur le serveur
			// pourcentage = nombre d'octet envoyé * 100 / nombre d'octet à envoyer
			percent = Math.floor((ev.loaded * 100) / ev.total);

			if ((percent > 0) && (percent < 100)) {

				this.updateTitle(percent);

				// temps écoulé = maintenant - départ
				// temps total  = temps écoulé * 100 / pourcentage + 10 secondes
				elapsedTime = currentTime - this.startTime;
				totalTime   = elapsedTime * 100 / percent + 10;

				if (elapsedTime >= 25) {

					// temps restant = temps total - temps écoulé
					time = Math.round(totalTime - elapsedTime);
					time = Math.ceil(time / 10) * 10;
					mins = Math.ceil(time / 60);

					// vitesse = taille téléchargé / temps écoulé / 1024
					rate = Math.round(ev.loaded / elapsedTime / 1024);

					if ((elapsedTime < 40) || (totalTime < 90)) { key = 14; time = null; } // upload14 "§% - § ko/s"
					else if (mins > 1)  { key = 11; time = mins; } // upload11 "§% - § ko/s - § minutes restantes"
					else if (time > 50) { key = 12; time = 1; }    // upload12 "§% - § ko/s - § minute restante"
					else                { key = 13; }              // upload13 "§% - § ko/s - § secondes restantes"
				}

				this.updateProgress(percent, key, rate, time);
			}
		}
		else if (ev.type === 'load') {

			// temps total = temps actuel - temps du départ
			time = Math.round(new Date().getTime() / 1000) - this.startTime;
			mins = Math.ceil(time / 60);

			// vitesse = taille total / temps total / 1024
			rate = Math.round(ev.loaded / time / 1024);

			if ((rate > 0) && (rate !== Infinity)) {
				if      (mins > 1)  { key = 21; time = mins; } // upload21 "§% - à § ko/s en § minutes"
				else if (time > 50) { key = 22; time = 1; }    // upload22 "§% - à § ko/s en § minute"
				else if (time > 20) { key = 23; }              // upload23 "§% - à § ko/s en § secondes"
				else                { key = 24; time = null; } // upload24 "§% - à § ko/s"
			}
			else {
				rate = null; time = null; // 100%
			}

			this.updateTitle(100);
			this.updateProgress(100, key, rate, time);
		}
	};


	// #### Gestion du graphique ########################################### i18n ## private ### //
	// = révision : 114
	// » Fait avancer la barre de progression (de 1 à 100%)
	// » Les paramètres peuvent être null sauf le premier
	// » Lorsque la barre de progression atteint 100%, on change le texte du dialogue
	this.updateProgress = function (percent, key, rate, time) {

		var rect = apijs.html('rect'), text = apijs.html('span.info'), data;

		if (percent > 99) {
			rect.setAttribute('class', 'end');
			rect.style.width = '';
			data = '100%';
			apijs.html('p').textContent = apijs.i18n.translate('uploadInEnding');
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

		text.textContent = data;
	};


	// #### Titre de la page ####################################################### private ### //
	// = révision : 5
	// » Met à jour le titre de la page avec le pourcentage d'avancement
	// » Permet de connaitre l'avancement même si l'utilisateur est sur un autre onglet ou une autre fenêtre
	this.updateTitle = function (percent) {

		if (typeof percent === 'number') {
			document.title = (/^[0-9]{1,3}% - /.test(document.title)) ?
				percent + '% - ' + document.title.slice(document.title.indexOf(' - ') + 3) : percent + '% - ' + document.title;
		}
		else if (/^[0-9]{1,3}% - /.test(document.title)) {
			document.title = document.title.slice(document.title.indexOf(' - ') + 3);
		}
	};
};