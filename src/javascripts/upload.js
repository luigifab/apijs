/**
 * Created L/13/04/2009
 * Updated V/18/11/2011
 * Version 25
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

function Upload() {

	// définition des attributs
	this.extensions = null;
	this.callback = null;
	this.params = null;
	this.key = null;

	this.percent = 0;

	this.svgTimer = null;
	this.svgDirection = 0;
	this.svgWaiting = 0;

	this.apcTimer = null;
	this.apcWaiting = 0;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DES ACTIONS DE L'UTILISATEUR (5)

	// #### Dialogue d'upload ###################################### i18n ## debug ## public ### //
	// = révision : 28
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Utilise une iframe à nom unique pour l'envoi de fichier
	// » Prépare et affiche le dialogue d'upload de [TheDialogue]
	this.sendFile = function (title, maxsize, extensions, callback, params, data, icon) {

		// *** Mise en place du formulaire ********************** //
		if ((typeof title === 'string') && (typeof maxsize === 'number') && (typeof extensions === 'object') && (typeof callback === 'function')  && (typeof params !== 'undefined') && (typeof data === 'string') && (extensions !== null)) {

			this.extensions = extensions;
			this.callback = callback;
			this.params = params;
			this.key = uniqid();

			apijs.dialogue.dialogFormUpload(title, this.prepareText(maxsize), data, this.key, icon);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.dialogue.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheUpload » sendFile[br]➩ (string) title : ' + title + '[br]➩ (number) maxsize : ' + maxsize + '[br]➩ (array) extensions : ' + extensions + '[br]➩ (funcion) callback : ' + callback + '[br]➩ (object) params : ' + params + '[br]➩ (string) data : ' + data + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue de suppression ################################ i18n ## debug ## public ### //
	// = révision : 7
	// » Permet à l'utilisateur la suppression d'un fichier sans avoir à recharger la page
	// » Prépare et affiche le dialogue de confirmation de [TheDialogue]
	this.deleteFile = function (title, text, callback, params, key, icon) {

		// *** Mise en place du formulaire ********************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof callback === 'function') && (typeof params !== 'undefined') && (typeof key === 'string')) {

			this.callback = callback;
			this.params = params;

			icon = (typeof icon !== 'string') ? 'delete' : icon;
			apijs.dialogue.dialogConfirmation(title, text, apijs.upload.actionDelete, key, icon);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.dialogue.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheUpload » deleteFile[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (funcion) callback : ' + callback + '[br]➩ (object) params : ' + params + '[br]➩ (string) key : ' + key + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Texte d'information ############################################ i18n ## private ### //
	// = révision : 14
	// » Génère le texte d'information du dialogue d'upload
	// » Affiche la liste des extensions acceptées et la taille maximale autorisée
	// » Fait bien attention à ne pas modifier la liste des extensions originale
	this.prepareText = function (maxsize) {

		var text = null, extensions = null, lastExtension = null;

		extensions = apijs.dialogue.clone(this.extensions);
		lastExtension = extensions.pop();

		if (lastExtension === '*') {
			text = apijs.i18n.translate('uploadAllType', maxsize);
		}
		else if (extensions.length < 1) {
			text = apijs.i18n.translate('uploadOneType', lastExtension, maxsize);
		}
		else {
			extensions = extensions.join(', ');
			text = apijs.i18n.translate('uploadMultiType', extensions, lastExtension, maxsize);
		}

		return text;
	};


	// #### Suppression d'un fichier ####################################### i18n ## private ### //
	// = révision : 10
	// » Demande la suppression d'un fichier en appelant le serveur via XMLHttpRequest (réponse au format XML)
	// » Affiche un message de confirmation et appel la fonction de rappel si la suppression a réussie (appel immédiat)
	// » Affiche un message d'erreur détaillé dans le cas contraire
	this.actionDelete = function (key) {

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {

			// *** Réponse apparemment concluante ************** //
			if ((xhr.readyState === 4) && (xhr.status === 200)) {

				// lecture du document XML
				// à partir de la réponse du serveur
				try {
					var result = null, status = null, message = null, icon = null;

					result  = xhr.responseXML;
					status  = result.getElementsByTagName('status')[0].firstChild.nodeValue;
					message = result.getElementsByTagName('message')[0].firstChild.nodeValue;
					icon    = (status === 'success') ? 'information' : 'error';

					apijs.dialogue.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, message, icon);

					if (status === 'success')
						apijs.upload.callback(apijs.upload.params);
				}
				// erreur grave
				// affiche les détails en mode debug
				catch (ee) {
					if (apijs.config.debug)
						alert(ee);
				}
			}

			// *** Réponse désastreuse ************************* //
			else if ((xhr.readyState === 4) && (xhr.status !== 200)) {

				apijs.dialogue.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('deleteNotFound', xhr.status, xhr.statusText), 'error');
			}
		};

		xhr.open('GET', apijs.config.dialogue.fileUpload + '?delete=' + key, true);
		xhr.send(null);
	};


	// #### Vérification du formulaire ################################### i18n ## protected ### //
	// = révision : 56
	// » Vérifie si un fichier a été proposé et si son extension est autorisée
	// » Fait bien attention à ne pas modifier la liste des extensions originale
	// » Valide le formulaire et demande l'affichage du dialogue de progression si tout semble correct
	// » Afin de permettre l'envoi du formulaire l'affichage du dialogue est différée dans le temps (1 milliseconde)
	this.actionConfirm = function () {

		var filename = document.getElementById('box').getElementsByTagName('input')[1].value;
		var result = false, extensions = null, lastExtension = null;

		extensions = apijs.dialogue.clone(this.extensions);
		lastExtension = extensions.pop();

		// *** Aucun fichier ************************************ //
		if (filename.length < 1) {
			document.getElementById('box').getElementsByTagName('input')[1].focus();
		}

		// *** Extension invalide ******************************* //
		else if ((lastExtension !== '*') && !in_array(filename.slice(filename.lastIndexOf('.') + 1).toLowerCase(), this.extensions)) {

			if (filename.lastIndexOf('/') > 0)
				filename = filename.slice(filename.lastIndexOf('/') + 1);
			else if (filename.lastIndexOf('\\') > 0)
				filename = filename.slice(filename.lastIndexOf('\\') + 1);

			if (extensions.length < 1) {
				apijs.dialogue.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('uploadBadOneType', filename, lastExtension), 'eeupload');
			}
			else {
				extensions = extensions.join(', ');
				apijs.dialogue.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('uploadBadMultiType', filename, extensions, lastExtension), 'eeupload');
			}
		}

		// *** Validation du formulaire ************************* //
		else {
			result = true;
			document.getElementById('iframeUpload').setAttribute('onload', 'apijs.upload.endUpload();');
			window.setTimeout(apijs.upload.startUpload, 1);
		}

		return result;
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'ENVOI DU FICHIER (3)

	// #### Lancement ########################################### i18n ## timeout ## private ### //
	// = révision : 13
	// » Affiche le dialogue de progression de [TheDialogue]
	// » Prépare et lance l'animation de la barre de progression (appels différés de 50 et 1000 millisecondes)
	this.startUpload = function () {

		apijs.dialogue.dialogProgress(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('uploadInProgress'));

		apijs.upload.percent = 0;
		apijs.upload.svgDirection = 0;
		apijs.upload.svgWaiting = 10;
		apijs.upload.apcWaiting = 15;
		apijs.upload.svgTimer = window.setInterval(apijs.upload.animGeneric, 50);
		apijs.upload.apcTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);
	};


	// #### Suivi en temps réel ################################ debug ## timeout ## private ### //
	// = révision : 23
	// » Auto-rappel toutes les 1000 millisecondes
	// » Récupère l'avancement de l'envoi du fichier en appelant le serveur via XMLHttpRequest (réponse au format XML)
	// » Fait avancer la barre de progression en fonction de l'avancement de l'envoi du fichier
	this.uploadRealTime = function () {

		// *** Annulation *************************************** //
		// Temps d'attente dépassé ou envoi terminé
		if (apijs.upload.apcWaiting < 1)
			return;

		// *** Appel du serveur ********************************* //
		// Temps d'attente non dépassé ou envoi en cours / extension APC disponible ou pas
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {

			if ((xhr.readyState === 4) && (xhr.status === 200)) {

				// lecture du document XML
				// à partir de la réponse du serveur
				try {
					var result = null, status = null, rate = null, percent = null;

					// récupération des données XML
					result = xhr.responseXML;
					status = result.getElementsByTagName('status')[0].firstChild.nodeValue;

					// réponse concluante
					// extension APC disponible et réception du fichier en cours
					// met à jour la barre de progression en conséquence
					if (status === 'uploading') {

						if (apijs.upload.svgTimer)
							clearInterval(apijs.upload.svgTimer);

						rate = parseInt(result.getElementsByTagName('rate')[0].firstChild.nodeValue, 10);
						percent = parseInt(result.getElementsByTagName('percent')[0].firstChild.nodeValue, 10);

						if ((percent > 0) && (percent < 100) && (percent > this.percent)) {
							this.percent = percent;
							apijs.upload.animToValue(percent, rate);
							apijs.upload.apcTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);
						}
						else if (percent < 1) {
							apijs.upload.apcWaiting -= 1;
							apijs.upload.apcTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);
						}
					}

					// attente du serveur
					// extension APC disponible mais réception du fichier pas encore commencée
					else if ((status === 'pending') && (apijs.upload.apcWaiting > 0)) {
						apijs.upload.apcWaiting -= 1;
						apijs.upload.apcTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);
					}
				}
				// erreur grave
				// affiche les détails en mode debug
				catch (ee) {
					if (apijs.config.debug)
						alert(ee);
				}
			}
		};

		xhr.open('GET', apijs.config.dialogue.fileUpload + '?realtime=' + apijs.upload.key, true);
		xhr.send(null);
	};


	// #### Terminus ###################################################### event ## private ### //
	// = révision : 75
	// » Désactive l'animation de la barre de progression
	// » Récupère le résultat de l'envoi ET du traitement du fichier depuis l'iframe (réponse au format XML)
	// » Termine la barre de progression et appel la fonction de rappel si l'envoi du fichier a réussi (appel différé de 1000 millisecondes)
	// » Affiche un message d'erreur détaillé dans le cas contraire
	this.endUpload = function () {

		// *** Désactivation de l'animation ********************* //
		if (this.apcTimer)
			clearTimeout(this.apcTimer);

		if (this.svgTimer)
			clearInterval(this.svgTimer);

		this.extensions = null;

		this.svgTimer = null;
		this.svgDirection = 0;
		this.svgWaiting = 0;

		this.apcTimer = null;
		this.apcWaiting = 0;

		// *** Traitement du rapport **************************** //
		// lecture du document XML
		// à partir du contenu de l'iframe
		try {
			var result = null, status = null, message = null;

			// récupération des données XML
			if (apijs.config.navigator) {
				result  = window.frames['iframeUpload.' + this.key].document;
				status  = result.getElementsByTagName('status')[0].firstChild.nodeValue;
				message = result.getElementsByTagName('message')[0].firstChild.nodeValue;
			}
			else {
				result = window.frames['iframeUpload.' + this.key].document.documentElement.getElementsByTagName('body')[0].innerHTML;
				result = result.replace(/[\s\r\n\t]|<[^>]+>|&[a-z]+;/g, '');
				result = result.replace('?xmlversion="1.0"encoding="utf-8"?', '');

				status = (/status(.+)\/status/i).test(result);
				status = RegExp.$1;
				message = (/message(.+)\/message/i).test(result);
				message = RegExp.$1;
			}

			// évite le transfère de données inutile sur Firefox (et les autres ? bug ?)
			if (document.getElementById('progressbar') && (navigator.userAgent.indexOf('MSIE') < 0)) {
				document.getElementById('iframeUpload').removeAttribute('onload');
				document.getElementById('iframeUpload').setAttribute('src', apijs.config.dialogue.imageUpload.src);
			}

			// fait avancer la barre de progression à 100%
			// ou affiche un message d'erreur
			if (status === 'success') {
				this.animToValue(100);
				window.setTimeout(function () { apijs.upload.callback(apijs.upload.key, apijs.upload.params); }, 1000);
			}
			else {
				apijs.dialogue.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, message, 'eeupload');
			}
		}
		// erreur grave
		// affiche les détails
		catch (ee) {
			apijs.dialogue.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, '[pre]' + ee + '[/pre]', 'eeupload');
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE LA BARRE DE PROGRESSION (2)

	// #### Avancement générique ####################################### interval ## private ### //
	// = révision : 75
	// » Fait bouger la barre de progression de gauche à droite et de droite à gauche
	// » Appel automatique toutes les 50 millisecondes histoire que l'animation soit fluide
	// » Aussi étonnant que cela puisse paraître, sous IE8, getSVGDocument est soit undefined, soit unknown
	// » Recherche silencieusement l'accès au graphique SVG
	this.animGeneric = function () {

		// *** Annulation *************************************** //
		// Temps d'attente dépassé ou envoi terminé / graphique inexistant
		if ((apijs.upload.svgWaiting < 1) || !document.getElementById('progressbar')) {
			clearInterval(apijs.upload.svgTimer);
		}

		// *** Animation du grapĥique *************************** //
		// Temps d'attente non dépassé ou envoi en cours / graphique existant et prêt à l'emploi
		else if (document.getElementById('progressbar') && (typeof document.getElementById('progressbar').getSVGDocument !== 'undefined')) {

			var rect = null, ee = null;

			// recherche silentieuse
			try {
				rect = (apijs.config.navigator) ? document.getElementById('progressbar').getSVGDocument().getElementsByTagName('rect')[0] : document.getElementById('progressbar').getSVGDocument().rootElement.getElementsByTagName('rect').item(0);
			}
			catch (ee) {
				return;
			}

			// animation
			if (apijs.upload.svgDirection === 0) {
				rect.setAttribute('x', parseInt(rect.getAttribute('x'), 10) + 5);

				if (parseInt(rect.getAttribute('x'), 10) >= 250)
					apijs.upload.svgDirection = 1;
			}
			else {
				rect.setAttribute('x', parseInt(rect.getAttribute('x'), 10) - 5);

				if (parseInt(rect.getAttribute('x'), 10) <= 0)
					apijs.upload.svgDirection = 0;
			}
		}

		// *** Attente du graphique ***************************** //
		// Temps d'attente non dépassé ou envoi en cours / graphique existant mais pas encore prêt
		else if (document.getElementById('progressbar')) {
			apijs.upload.svgWaiting -= 1;
		}
	};


	// #### Avancement de la barre de progression ########################## i18n ## private ### //
	// = révision : 63
	// » Fait avancer la barre de progression jusqu'à une certaine valeur
	// » Recherche silencieusement l'accès au graphique SVG
	this.animToValue = function (value, rate) {

		if (document.getElementById('progressbar') && (typeof document.getElementById('progressbar').getSVGDocument !== 'undefined')) {

			var rect = null, text = null;

			// recherche silentieuse
			try {
				rect = (apijs.config.navigator) ? document.getElementById('progressbar').getSVGDocument().getElementsByTagName('rect')[0] : document.getElementById('progressbar').getSVGDocument().rootElement.getElementsByTagName('rect').item(0);

				text = (apijs.config.navigator) ? document.getElementById('progressbar').getSVGDocument().getElementsByTagName('text')[0] : document.getElementById('progressbar').getSVGDocument().rootElement.getElementsByTagName('text').item(0);
			}
			catch (ee) {
				return;
			}

			// animation (XX%)
			if (value < 100) {

				if (rect.getAttribute('x') !== '0')
					rect.setAttribute('x', '0');

				rect.setAttribute('width', value * 3);

				if (typeof rate === 'number')
					text.firstChild.replaceData(0, text.firstChild.length, apijs.i18n.translate('uploadRate', value, rate));
				else
					text.firstChild.replaceData(0, text.firstChild.length, value + '%');
			}
			// terminus (100%)
			else {
				rect.setAttribute('x', '0');
				rect.setAttribute('width', '301');
				text.firstChild.replaceData(0, text.firstChild.length, '100%');
			}
		}
	};
}