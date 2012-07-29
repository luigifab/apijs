/**
 * Created L/13/04/2009
 * Updated J/24/05/2012
 * Version 32
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

apijs.core.upload = function () {

	// définition des attributs
	this.extensions = null;
	this.callback = null;
	this.params = null;
	this.key = null;

	this.percent = 0;

	this.svgTimer = null;
	this.svgDirection = 0;
	this.svgWaiting = 0;

	this.progressTimer = null;
	this.progressWaiting = 0;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DES ACTIONS DE L'UTILISATEUR (3)

	// #### Dialogue d'upload ###################################### i18n ## debug ## public ### //
	// = révision : 30
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Utilise une iframe à nom unique pour l'envoi des fichiers
	// » Prépare et affiche le dialogue d'upload de [TheDialog]
	this.sendFile = function (title, maxsize, extensions, callback, params, data, icon) {

		// *** Mise en place du formulaire ********************** //
		if ((typeof title === 'string') && (typeof maxsize === 'number') && (typeof extensions === 'object') && (typeof callback === 'function')  && (typeof params !== 'undefined') && (typeof data === 'string') && (extensions !== null)) {

			this.extensions = extensions;
			this.callback = callback;
			this.params = params;
			this.key = uniqid();

			apijs.dialog.dialogFormUpload(title, this.prepareText(maxsize), data, this.key, icon);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheUpload » sendFile[br]➩ (string) title : ' + title + '[br]➩ (number) maxsize : ' + maxsize + '[br]➩ (array) extensions : ' + extensions + '[br]➩ (funcion) callback : ' + callback + '[br]➩ (object) params : ' + params + '[br]➩ (string) data : ' + data + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue de suppression ################################ i18n ## debug ## public ### //
	// = révision : 8
	// » Permet à l'utilisateur la suppression d'un fichier sans avoir à recharger la page
	// » Prépare et affiche le dialogue de confirmation de [TheDialog]
	this.deleteFile = function (title, text, callback, params, key, icon) {

		// *** Mise en place du formulaire ********************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof callback === 'function') && (typeof params !== 'undefined') && (typeof key === 'string')) {

			this.callback = callback;
			this.params = params;

			icon = (typeof icon !== 'string') ? 'delete' : icon;
			apijs.dialog.dialogConfirmation(title, text, apijs.upload.actionDelete, key, icon);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheUpload » deleteFile[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (funcion) callback : ' + callback + '[br]➩ (object) params : ' + params + '[br]➩ (string) key : ' + key + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Texte d'information ############################################ i18n ## private ### //
	// = révision : 15
	// » Génère le texte d'information du dialogue d'upload
	// » Affiche la liste des extensions acceptées et la taille maximale autorisée
	// » Fait bien attention à ne pas modifier la liste des extensions originale
	this.prepareText = function (maxsize) {

		var text = null, extensions = null, lastExtension = null;

		extensions = apijs.dialog.clone(this.extensions);
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
	// = révision : 60
	// » Vérifie si un fichier a été proposé et si son extension est autorisée
	// » Fait bien attention à ne pas modifier la liste des extensions originale
	// » Valide le formulaire et affiche le dialogue de progression de [TheDialog] si tout semble correct
	// » Prépare et lance l'animation de la barre de progression (appels différés de 50 et 1000 millisecondes)
	// » Afin de permettre l'envoi du formulaire l'affichage du dialogue est différée dans le temps (1 milliseconde)
	this.actionConfirm = function () {

		var filename = document.getElementById('box').getElementsByTagName('input')[1].value;
		var result = false, extensions = null, lastExtension = null;

		extensions = apijs.dialog.clone(this.extensions);
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
				apijs.dialog.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('uploadBadOneType', filename, lastExtension), 'eeupload');
			}
			else {
				extensions = extensions.join(', ');
				apijs.dialog.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('uploadBadMultiType', filename, extensions, lastExtension), 'eeupload');
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

			this.progressWaiting = 15;
			this.progressTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);

			window.setTimeout(function () {
				apijs.dialog.dialogProgress(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('uploadInProgress'), apijs.dialog.dialogType.replace(/upload | lock/g, ''));
			}, 1);
		}

		return result;
	};


	// #### Suppression d'un fichier ####################################### i18n ## private ### //
	// = révision : 14
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

					apijs.dialog.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, message, icon);

					if (status === 'success')
						apijs.upload.callback(apijs.upload.params);
				}
				catch (ee) {
					apijs.dialog.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, '[pre]' + ee + '[/pre]', 'error');
				}
			}

			// *** Réponse désastreuse ************************* //
			else if ((xhr.readyState === 4) && (xhr.status !== 200)) {
				apijs.dialog.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, apijs.i18n.translate('deleteNotFound', xhr.status, xhr.statusText), 'error');
			}
		};

		xhr.open('GET', apijs.config.dialog.fileUpload + '?delete=' + key, true);
		xhr.send(null);
	};


	// #### Suivi en temps réel ############################## firebug ## timeout ## private ### //
	// = révision : 34
	// » Récupère l'avancement de l'envoi du fichier en appelant le serveur via XMLHttpRequest (réponse au format XML)
	// » Fait avancer la barre de progression en fonction de l'avancement de l'envoi du fichier
	// » Auto-rappel toutes les 1000 millisecondes si nécessaire
	this.uploadRealTime = function () {

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {

			// *** Réponse apparemment concluante ************** //
			// Temps d'attente non dépassé et envoi en cours
			if ((xhr.readyState === 4) && (xhr.status === 200) && (apijs.upload.progressWaiting > 0) && (apijs.upload.percent < 100)) {

				try {
					var result = null, status = null, percent = null, rate = null, time = null;

					// récupération des données XML
					result = xhr.responseXML;
					status = result.getElementsByTagName('status')[0].firstChild.nodeValue;

					// suivi possible et réception du fichier en cours
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
						apijs.upload.progressTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);
					}

					// suivi possible disponible mais réception du fichier pas encore commencée
					// auto-rappel dans 1000 millisecondes
					else if (status === 'pending') {
						apijs.upload.progressWaiting -= 1;
						apijs.upload.progressTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);
					}
				}
				catch (ee) {
					apijs.upload.progressWaiting -= 1;
					apijs.upload.progressTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);

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

		xhr.open('GET', apijs.config.dialog.fileUpload + '?realtime=' + apijs.upload.key, true);
		xhr.send(null);
	};


	// #### Terminus ########################################## firebug ## event ## private ### //
	// = révision : 84
	// » Désactive l'animation de la barre de progression et réinitialise la plupart des variables
	// » Récupère le résultat de l'envoi du fichier ET du traitement du fichier depuis l'iframe (réponse au format XML)
	// » Termine la barre de progression et appel la fonction de rappel si l'envoi du fichier a réussi (appel différé de 1500 millisecondes)
	// » Affiche un message d'erreur le plus détaillé possible dans le cas contraire
	this.endUpload = function () {

		// *** Désactivation de l'animation ********************* //
		if (this.progressTimer)
			clearTimeout(this.progressTimer);

		if (this.svgTimer)
			clearInterval(this.svgTimer);

		this.percent = 100;

		this.svgTimer = null;
		this.svgDirection = 0;
		this.svgWaiting = 0;

		this.progressTimer = null;
		this.progressWaiting = 0;

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
				document.getElementById('iframeUpload').setAttribute('src', apijs.config.dialog.imageUpload.src);
			}

			// fait avancer la barre de progression à 100% et appel la fonction de rappel
			// ou affiche un message d'erreur dont le message provient du document XML de l'iframe
			if (status === 'success') {
				this.animToValue(100);
				window.setTimeout(function () { apijs.upload.callback(apijs.upload.key, apijs.upload.params); }, 1500);
			}
			else {
				apijs.dialog.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, message, 'eeupload');
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
				apijs.dialog.dialogInformation(status, message, 'eeupload');
				return;
			}
			catch (ff) {
				if (typeof console === 'object')
					console.log('apijs.upload.endUpload : ' + ff);
			}

			apijs.dialog.dialogInformation(document.getElementById('box').firstChild.firstChild.nodeValue, '[pre]' + ee + '[/pre]', 'eeupload');
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE LA BARRE DE PROGRESSION (2)

	// #### Avancement générique ####################################### interval ## private ### //
	// = révision : 84
	// » Fait bouger la barre de progression de gauche à droite et de droite à gauche
	// » Appel automatique toutes les 50 millisecondes histoire que l'animation générique soit fluide
	// » Se termine automatiquement lorsque le temps d'attente est dépassé, l'envoi est terminé, le graphique n'existe plus
	// » Recherche silencieusement l'accès au graphique SVG
	this.animGeneric = function () {

		// *** Animation du grapĥique *************************** //
		// Envoi en cours / graphique existant et prêt à l'emploi
		// Essaye d'accéder silencieusement au graphique SVG
		if ((apijs.upload.percent < 100) && document.getElementById('progressbar')) {

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
	// = révision : 75
	// » Fait avancer la barre de progression jusqu'à une certaine valeur
	// » Affiche à l'intérieur du graphique SVG : 5% (25 Ko/s) / 5% (15 secondes restantes) / 5% (25 Ko/s - 15 secondes restantes) / 100%
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
};