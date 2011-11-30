/**
 * Created L/13/04/2009
 * Updated M/29/11/2011
 * Version 27
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
	// GESTION DES ACTIONS DE L'UTILISATEUR (3)

	// #### Dialogue d'upload ###################################### i18n ## debug ## public ### //
	// = révision : 29
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Utilise une iframe à nom unique pour l'envoi des fichiers
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



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'ENVOI DU FICHIER (4)

	// #### Vérification du formulaire ################################### i18n ## protected ### //
	// = révision : 57
	// » Vérifie si un fichier a été proposé et si son extension est autorisée
	// » Fait bien attention à ne pas modifier la liste des extensions originale
	// » Valide le formulaire et affiche le dialogue de progression de [TheDialogue] si tout semble correct
	// » Prépare et lance l'animation de la barre de progression (appels différés de 50 et 1000 millisecondes)
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

			this.percent = 0;

			this.svgDirection = 0;
			this.svgWaiting = 10;
			this.svgTimer = window.setInterval(apijs.upload.animGeneric, 50);

			this.apcWaiting = 15;
			this.apcTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);

			window.setTimeout(function () {
				apijs.dialogue.dialogProgress(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('uploadInProgress'));
			}, 1);
		}

		return result;
	};


	// #### Suppression d'un fichier ####################################### i18n ## private ### //
	// = révision : 13
	// » Demande la suppression d'un fichier en appelant le serveur via XMLHttpRequest (réponse au format XML)
	// » Affiche un message de confirmation et appel la fonction de rappel si la suppression a réussie (appel immédiat)
	// » Affiche un message d'erreur le plus détaillé possible dans le cas contraire
	this.actionDelete = function (key) {

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {

			// *** Réponse apparemment concluante ************** //
			if ((xhr.readyState === 4) && (xhr.status === 200)) {

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
				catch (ee) {
					apijs.dialogue.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, '[pre]' + ee + '[/pre]', 'error');
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


	// #### Suivi en temps réel ############################## firebug ## timeout ## private ### //
	// = révision : 32
	// » Récupère l'avancement de l'envoi du fichier en appelant le serveur via XMLHttpRequest (réponse au format XML)
	// » Fait avancer la barre de progression en fonction de l'avancement de l'envoi du fichier
	// » Auto-rappel toutes les 1000 millisecondes si nécessaire
	this.uploadRealTime = function () {

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {

			// *** Réponse apparemment concluante ************** //
			// Temps d'attente non dépassé et envoi en cours
			if ((xhr.readyState === 4) && (xhr.status === 200) && (apijs.upload.apcWaiting > 0) && (apijs.upload.percent < 100)) {

				try {
					var result = null, status = null, percent = null, rate = null, time = null;

					// récupération des données XML
					result = xhr.responseXML;
					status = result.getElementsByTagName('status')[0].firstChild.nodeValue;

					// extension APC disponible et réception du fichier en cours
					// met à jour la barre de progression en conséquence
					// auto-rappel dans 1000 millisecondes
					if (status === 'uploading') {

						percent = parseInt(result.getElementsByTagName('percent')[0].firstChild.nodeValue, 10);
						rate = result.getElementsByTagName('rate')[0].firstChild.nodeValue;
						time = result.getElementsByTagName('time')[0].firstChild.nodeValue;

						if ((percent > 0) && (percent < 100) && (percent > apijs.upload.percent)) {

							if (apijs.upload.svgTimer)
								clearInterval(apijs.upload.svgTimer);

							rate = ((rate === 'false') || (rate.length < 1)) ? false : parseInt(rate, 10);
							time = ((time === 'false') || (time.length < 1)) ? false : time;

							apijs.upload.animToValue(percent, rate, time);
						}

						apijs.upload.percent = percent;
						apijs.upload.apcTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);
					}

					// extension APC disponible mais réception du fichier pas encore commencée
					// auto-rappel dans 1000 millisecondes
					else if (status === 'pending') {
						apijs.upload.apcWaiting -= 1;
						apijs.upload.apcTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);
					}
				}
				catch (ee) {
					apijs.upload.apcWaiting -= 1;
					apijs.upload.apcTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);

					if (typeof console === 'object')
						console.log('apijs.upload.uploadRealTime : ' + xhr.status + ' ' + xhr.statusText + ' ' + ee);
				}
			}

			// *** Réponse désastreuse sans dommage ************ //
			// Firebug présent pour un message d'information
			else if ((xhr.readyState === 4) && (xhr.status !== 200) && (typeof console === 'object')) {
				console.log('apijs.upload.uploadRealTime : ' + xhr.status + ' ' + xhr.statusText);
			}
		};

		xhr.open('GET', apijs.config.dialogue.fileUpload + '?realtime=' + apijs.upload.key, true);
		xhr.send(null);
	};


	// #### Terminus ########################################## firebug ## event ## private ### //
	// = révision : 82
	// » Désactive l'animation de la barre de progression et réinitialise la plupart des variables
	// » Récupère le résultat de l'envoi du fichier ET du traitement du fichier depuis l'iframe (réponse au format XML)
	// » Termine la barre de progression et appel la fonction de rappel si l'envoi du fichier a réussi (appel différé de 1500 millisecondes)
	// » Affiche un message d'erreur le plus détaillé possible dans le cas contraire
	this.endUpload = function () {

		// *** Désactivation de l'animation ********************* //
		if (this.apcTimer)
			clearTimeout(this.apcTimer);

		if (this.svgTimer)
			clearInterval(this.svgTimer);

		this.percent = 100;

		this.svgTimer = null;
		this.svgDirection = 0;
		this.svgWaiting = 0;

		this.apcTimer = null;
		this.apcWaiting = 0;

		// *** Traitement du rapport **************************** //
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
				result = result.replace(/[\r\n\t]|<[^>]+>|&[a-z]+;/g, '');
				status = (/status(.+)\/status/i).test(result);
				status = RegExp.$1;
				message = (/message(.+)\/message/i).test(result);
				message = RegExp.$1;

				if (status.length < 1)
					throw 'TypeError: status is undefined';
			}

			// évite le transfère de données inutile sur Firefox (et les autres ? bug ?)
			if (apijs.config.navigator && document.getElementById('progressbar')) {
				document.getElementById('iframeUpload').removeAttribute('onload');
				document.getElementById('iframeUpload').setAttribute('src', apijs.config.dialogue.imageUpload.src);
			}

			// fait avancer la barre de progression à 100% et appel la fonction de rappel
			// ou affiche un message d'erreur dont le message provient du document XML de l'iframe
			if (status === 'success') {
				this.animToValue(100);
				window.setTimeout(function () { apijs.upload.callback(apijs.upload.key, apijs.upload.params); }, 1500);
			}
			else {
				apijs.dialogue.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, message, 'eeupload');
			}
		}
		catch (ee) {
			try {
				// tentative de récupération
				// récupération des données HTML
				if (apijs.config.navigator) {
					result  = window.frames['iframeUpload.' + this.key].document;
					status  = result.getElementsByTagName('title')[0].firstChild.nodeValue;
					message = result.getElementsByTagName('p')[0].firstChild.nodeValue;
				}
				else {
					result = window.frames['iframeUpload.' + this.key].document.documentElement.innerHTML;
					status = (/<title>(.+)<\/title>/i).test(result);
					status = RegExp.$1;
					message = (/<p>(.+)<\/p>/i).test(result);
					message = RegExp.$1;
				}

				// message d'erreur
				apijs.dialogue.dialogInformation(status, message, 'eeupload');
				return;
			}
			catch (ff) {
				if (typeof console === 'object')
					console.log('apijs.upload.endUpload : ' + ff);
			}

			apijs.dialogue.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, '[pre]' + ee + '[/pre]', 'eeupload');
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE LA BARRE DE PROGRESSION (2)

	// #### Avancement générique ####################################### interval ## private ### //
	// = révision : 82
	// » Fait bouger la barre de progression de gauche à droite et de droite à gauche
	// » Appel automatique toutes les 50 millisecondes histoire que l'animation générique soit fluide
	// » Se termine automatiquement lorsque le temps d'attente est dépassé, l'envoi est terminé, le graphique n'existe plus
	// » Recherche silencieusement l'accès au graphique SVG
	this.animGeneric = function () {

		// *** Animation du grapĥique *************************** //
		// Temps d'attente non dépassé et envoi en cours / graphique existant et prêt à l'emploi
		// Essaye d'accéder silencieusement au graphique SVG
		if ((apijs.upload.apcWaiting > 0) && (apijs.upload.percent < 100) && document.getElementById('progressbar')) {

			try {
				var rect = (apijs.config.navigator) ? document.getElementById('progressbar').getSVGDocument().getElementById('bar') : document.getElementById('progressbar').getSVGDocument().rootElement.getElementById('bar');
			}
			catch (ee) {
				apijs.upload.svgWaiting -= 1;
				return;
			}

			if (apijs.upload.svgDirection === 0) {
				rect.setAttribute('x', parseFloat(rect.getAttribute('x'), 10) + 1 + '%');

				if (parseInt(rect.getAttribute('x'), 10) >= (100 - parseFloat(rect.getAttribute('width'), 10)))
					apijs.upload.svgDirection = 1;
			}
			else {
				rect.setAttribute('x', parseFloat(rect.getAttribute('x'), 10) - 1 + '%');

				if (parseInt(rect.getAttribute('x'), 10) <= 0)
					apijs.upload.svgDirection = 0;
			}
		}

		// *** Annulation *************************************** //
		// Temps d'attente dépassé ou envoi terminé / graphique inexistant
		else {
			apijs.upload.svgWaiting = 0;
			clearInterval(apijs.upload.svgTimer);
		}

	};


	// #### Avancement de la barre de progression ########################## i18n ## private ### //
	// = révision : 73
	// » Fait avancer la barre de progression jusqu'à une certaine valeur
	// » Affiche en fonction des données : 5% (25 Ko/s) / 5% (15 secondes restantes) / 5% (25 Ko/s - 15 secondes restantes) / 100%
	// » Recherche silencieusement l'accès au graphique SVG
	this.animToValue = function (percent, rate, time) {

		// *** Recherche silencieuse **************************** //
		// Essaye d'accéder au graphique SVG
		try {
			var rect = null, text = null;

			rect = (apijs.config.navigator) ? document.getElementById('progressbar').getSVGDocument().getElementById('bar') : document.getElementById('progressbar').getSVGDocument().rootElement.getElementById('bar');

			text = (apijs.config.navigator) ? document.getElementById('progressbar').getSVGDocument().getElementById('text') : document.getElementById('progressbar').getSVGDocument().rootElement.getElementById('text');
		}
		catch (ee) {
			return;
		}

		// *** Animation du graphique *************************** //
		// Graphique existant et prêt à l'emploi
		if (percent < 100) {

			if (rect.getAttribute('x') !== '0')
				rect.setAttribute('x', '0');

			rect.setAttribute('width', percent + '%');

			if ((typeof rate === 'number') && (typeof time === 'string'))
				text.firstChild.replaceData(0, text.firstChild.length, apijs.i18n.translate('uploadRateTime', percent, rate, time));
			else if (typeof rate === 'number')
				text.firstChild.replaceData(0, text.firstChild.length, apijs.i18n.translate('uploadRate', percent, rate));
			else if (typeof time === 'string')
				text.firstChild.replaceData(0, text.firstChild.length, apijs.i18n.translate('uploadTime', percent, time));
			else
				text.firstChild.replaceData(0, text.firstChild.length, percent + '%');
		}
		else {
			rect.setAttribute('x', '0');
			rect.setAttribute('width', '101%');
			text.firstChild.replaceData(0, text.firstChild.length, '100%');
		}
	};
}