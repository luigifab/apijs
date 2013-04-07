/**
 * Created L/13/04/2009
 * Updated V/05/04/2013
 * Version 39
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

apijs.core.upload = function () {

	// définition des attributs
	this.percent = 0;
	this.maxsize = 0;
	this.extensions = null;
	this.uploadkey = null;
	this.callback = null;
	this.callbackParam = null;

	this.svgTimer = null;
	this.svgDirection = 0;
	this.svgWaiting = 0;
	this.progressTimer = null;
	this.progressWaiting = 0;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DES ACTIONS DE L'UTILISATEUR

	// #### Dialogue d'upload ###################################### i18n ## debug ## public ### //
	// = révision : 43
	// » Permet à l'utilisateur l'envoi de fichier sans avoir à recharger la page
	// » Utilise une iframe à nom unique pour permettre l'envoi des fichiers
	// » Prépare et affiche le dialogue d'upload de [TheDialog]
	this.sendFile = function (title, inputname, maxsize, extensions, callback, callbackParam, icon) {

		// *** Mise en place du formulaire ********************** //
		if ((typeof title === 'string') && (typeof inputname === 'string') && (typeof maxsize === 'number') && (typeof extensions === 'object') && (extensions instanceof Array) && (typeof callback === 'function')) {

			this.callback = callback;
			this.callbackParam = callbackParam;
			this.extensions = extensions;
			this.uploadkey = uniqid();
			this.maxsize = maxsize;

			apijs.dialog.dialogFormUpload(title, this.prepareText(maxsize), inputname, this.uploadkey, icon);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheUpload » sendFile[br]➩ (string) title : ' + title + '[br]➩ (string) inputname : ' + inputname + '[br]➩ (number) maxsize : ' + maxsize + '[br]➩ (array) extensions : ' + extensions + '[br]➩ (function) callback : ' + callback + '[br]➩ (mixed) callbackParam : ' + callbackParam + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Dialogue de suppression ################################ i18n ## debug ## public ### //
	// = révision : 14
	// » Permet à l'utilisateur la suppression d'un fichier sans avoir à recharger la page
	// » Prépare et affiche le dialogue de confirmation de [TheDialog]
	this.deleteFile = function (title, text, fileid, callback, callbackParam, icon) {

		// *** Mise en place du formulaire ********************** //
		if ((typeof title === 'string') && (typeof text === 'string') && (typeof fileid === 'string') && (typeof callback === 'function')) {

			this.callback = callback;
			this.callbackParam = callbackParam;

			icon = (typeof icon !== 'string') ? 'delete' : icon;
			apijs.dialog.dialogConfirmation(title, text, apijs.upload.actionDelete, fileid, icon);
		}

		// *** Message de debug ********************************* //
		else if (apijs.config.debug) {

			if ((typeof callback === 'function') && (typeof callback.name === 'string') && (callback.name.length > 0))
				callback = callback.name;

			apijs.dialog.dialogInformation(apijs.i18n.translate('debugInvalidCall'), '[pre]TheUpload » deleteFile[br]➩ (string) title : ' + title + '[br]➩ (string) text : ' + text + '[br]➩ (string) fileid : ' + fileid + '[br]➩ (function) callback : ' + callback + '[br]➩ (mixed) callbackParam : ' + callbackParam + '[br]➩ (string) icon : ' + icon + '[/pre]');
		}
	};


	// #### Texte d'information ############################################ i18n ## private ### //
	// = révision : 23
	// » Génère le texte d'information du dialogue d'upload
	// » Affiche la liste des extensions acceptées et la taille maximale autorisée
	this.prepareText = function (maxsize) {

		var text, last = this.extensions[this.extensions.length - 1];

		if (last === '*')
			text = apijs.i18n.translate('uploadAllType', maxsize);
		else if (this.extensions.length === 1)
			text = apijs.i18n.translate('uploadOneType', last, maxsize);
		else
			text = apijs.i18n.translate('uploadMultiType', this.extensions.slice(0, -1).join(', '), last, maxsize);

		return text;
	};


	// #### Message d'erreur ############################################## i18n ## private  ### //
	// = révision : 6
	// » Affiche le dialogue d'information avec un message d'erreur
	// » Supprime l'iframe et remplace le bouton Ok par le bouton Réessayer
	this.showRetry = function (text, input) {

		var callbackname = this.callback.name, title = document.getElementById('box').querySelector('h1').firstChild.nodeValue, button;

		apijs.dialog.dialogInformation(title, text, 'eeupload');
		document.getElementById('iframeUpload').parentNode.removeChild(document.getElementById('iframeUpload'));

		if (callbackname !== 'string') {
			callbackname = this.callback.toString().match(/function ([^\(]+)\(/)[0];
			callbackname = callbackname.slice(9, -1);
		}

		button = document.getElementById('box').querySelector('button');
		button.firstChild.nodeValue = apijs.i18n.translate('buttonRetry');
		button.setAttribute('class', 'back');
		button.setAttribute('onclick', "apijs.upload.sendFile('" + title + "', '" + input + "', " + this.maxsize + ", ['" + this.extensions.toString().replace(/,/g, "','") + "'], " + callbackname + ", " + this.callbackParam + ");");
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'ENVOI DU FICHIER

	// #### Vérification du formulaire ################################### i18n ## protected ### //
	// = révision : 82
	// » Vérifie si un fichier a été proposé et si ce fichier est autorisée (extension + taille)
	// » Valide le formulaire et affiche le dialogue de progression de [TheDialog]
	// » Lance l'animation générique et temps réel de la barre de progression (appels différés de 50 et 1000 millisecondes)
	// » Afin de permettre l'envoi du formulaire l'affichage du dialogue est différé dans le temps (1 milliseconde)
	this.actionConfirm = function () {

		var input = document.getElementById('box').getElementsByTagName('input')[1],
		    filename = input.value.replace('C:\\fakepath\\', ''),
		    decimal, size = -1, maxsize = this.maxsize * 1024 * 1024,
		    text, last = this.extensions[this.extensions.length - 1];

		// *** Aucun fichier ************************************ //
		if (filename.length < 1) {
			document.getElementById('box').getElementsByTagName('input')[1].focus();
		}

		// *** Extension invalide ******************************* //
		else if ((last !== '*') && !in_array(filename.slice(filename.lastIndexOf('.') + 1).toLowerCase(), this.extensions)) {

			if (filename.lastIndexOf('/') > 0)
				filename = filename.slice(filename.lastIndexOf('/') + 1);
			else if (filename.lastIndexOf('\\') > 0)
				filename = filename.slice(filename.lastIndexOf('\\') + 1);

			text = (this.extensions.length < 2) ? apijs.i18n.translate('uploadBadOneType', filename, last) :
			       apijs.i18n.translate('uploadBadMultiType', filename, this.extensions.slice(0, -1).join(', '), last);

			this.showRetry(text, input.getAttribute('name'));
		}

		// *** Validation du formulaire ************************* //
		// ou taille supérieure (FileApi)
		else {
			if (typeof input.files === 'object')
				size = input.files[0].size;

			if ((size > -1) && (size > maxsize)) {

				if (maxsize > 1048576) {
					size = apijs.i18n.translate('uploadBadSizeM', (size / 1048576).toFixed(2));
					maxsize = apijs.i18n.translate('uploadBadSizeM', (maxsize / 1048576).toFixed(2));
				}
				else {
					size = apijs.i18n.translate('uploadBadSizeK', (size / 1024).toFixed(2));
					maxsize = apijs.i18n.translate('uploadBadSizeK', (maxsize / 1024).toFixed(2));
				}

				decimal = apijs.i18n.translate('uploadBadSizeDecimal');
				size = size.replace('.00', '').replace('.', decimal);
				maxsize = maxsize.replace('.00', '').replace('.', decimal);

				this.showRetry(apijs.i18n.translate('uploadBadSize', filename, size, maxsize), input.getAttribute('name'));
			}
			else {
				document.getElementById('iframeUpload').setAttribute('onload', 'apijs.upload.endUpload();');

				this.percent = 0;
				this.svgDirection = 0;
				this.svgWaiting = 10;
				this.progressWaiting = 15;
				this.svgTimer = window.setInterval(apijs.upload.animGeneric.bind(this), 50);
				this.progressTimer = window.setTimeout(apijs.upload.uploadRealTime, 1000);

				window.setTimeout(function () {
					apijs.dialog.dialogProgress(document.getElementById('box').querySelector('h1').firstChild.nodeValue, apijs.i18n.translate('uploadInProgress'), apijs.dialog.classNames.replace(/upload|lock/, ''));
				}, 1);

				return true;
			}
		}

		return false;
	};


	// #### Suppression d'un fichier ####################################### i18n ## private ### //
	// = révision : 22
	// » Demande la suppression d'un fichier en appelant le serveur via XMLHttpRequest (réponse au format XML)
	// » Affiche un message de confirmation de suppression et appel la fonction de rappel si la suppression a réussie (appel immédiat)
	// » Affiche un message d'erreur le plus détaillé possible dans le cas contraire
	this.actionDelete = function (fileid) {

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {

			// *** Réponse apparemment concluante ************** //
			if ((xhr.readyState === 4) && (xhr.status === 200)) {

				var result, status, message, icon, title = document.getElementById('box').querySelector('h1').firstChild.nodeValue;

				try {
					result  = xhr.responseXML;
					status  = result.getElementsByTagName('status')[0].firstChild.nodeValue;
					message = result.getElementsByTagName('message')[0].firstChild.nodeValue;
					icon    = (status === 'success') ? 'information' : 'error';

					apijs.dialog.dialogInformation(title, message, icon);

					if (status === 'success')
						apijs.upload.callback(apijs.upload.callbackParam);
				}
				catch (ee) {
					apijs.dialog.dialogInformation(title, '[pre]' + ee + '[/pre]', 'error');
				}
			}

			// *** Réponse désastreuse ************************* //
			else if ((xhr.readyState === 4) && (xhr.status !== 200)) {
				apijs.dialog.dialogInformation(document.getElementById('box').querySelector('h1').firstChild.nodeValue, apijs.i18n.translate('deleteNotFound', xhr.status, xhr.statusText), 'error');
			}
		};

		xhr.open('GET', apijs.config.dialog.fileUpload + '?delete=' + fileid, true);
		xhr.send(null);
	};


	// #### Suivi en temps réel ############################## firebug ## timeout ## private ### //
	// = révision : 37
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
					var result, status, percent, rate, time;

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
						console.log('apijs.upload.uploadRealTime: ' + xhr.status + ' ' + xhr.statusText + ' ' + ee);
				}
			}

			// *** Réponse désastreuse sans dommage ************ //
			// Firebug présent pour un message d'information
			else if ((xhr.readyState === 4) && (xhr.status !== 200) && (typeof console === 'object')) {
				console.log('apijs.upload.uploadRealTime: ' + xhr.status + ' ' + xhr.statusText);
			}
		};

		xhr.open('GET', apijs.config.dialog.fileUpload + '?realtime=' + apijs.upload.uploadkey, true);
		xhr.send(null);
	};


	// #### Terminus ########################################## firebug ## event ## private ### //
	// = révision : 97
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

		if (this.extensions === null)
			return;

		this.percent = 100;
		this.maxsize = 0;
		this.extensions = null;
		//this.uploadkey = null;
		this.svgTimer = null;
		this.svgDirection = 0;
		this.svgWaiting = 0;
		this.progressTimer = null;
		this.progressWaiting = 0;

		// *** Traitement du rapport **************************** //
		var result, status, message;

		try {
			// récupération des données XML
			if (apijs.config.navigator) {
				result  = window.frames['iframeUpload.' + this.uploadkey].document;
				status  = result.querySelector('status').firstChild.nodeValue;
				message = result.querySelector('message').firstChild.nodeValue;
			}
			else {
				result = window.frames['iframeUpload.' + this.uploadkey].document.documentElement.querySelector('body').innerHTML;
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
				window.setTimeout(function () { this.callback(this.uploadkey, this.callbackParam); }.bind(this), 1500);
			}
			else {
				apijs.dialog.dialogInformation(document.getElementById('box').querySelector('h1').firstChild.nodeValue, message, 'eeupload');
			}
		}
		catch (ee) {
			try {
				// tentative de récupération
				// récupération des données HTML
				if (apijs.config.navigator) {
					result  = window.frames['iframeUpload.' + this.uploadkey].document;
					status  = result.querySelector('title').firstChild.nodeValue;
					message = result.querySelector('p').firstChild.nodeValue;
				}
				else {
					result = window.frames['iframeUpload.' + this.uploadkey].document.documentElement.innerHTML;
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
					console.log('apijs.upload.endUpload: ' + ff);
			}

			apijs.dialog.dialogInformation(document.getElementById('box').querySelector('h1').firstChild.nodeValue, '[pre]' + ee + '[/pre]', 'eeupload');
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE LA BARRE DE PROGRESSION

	// #### Avancement générique ####################################### interval ## private ### //
	// = révision : 85
	// » Fait bouger la barre de progression de gauche à droite et de droite à gauche
	// » Appel automatique toutes les 50 millisecondes histoire que l'animation générique soit fluide
	// » Se termine automatiquement lorsque le temps d'attente est dépassé, l'envoi est terminé, le graphique n'existe plus
	// » Recherche silencieusement l'accès au graphique SVG
	this.animGeneric = function () {

		// *** Animation du grapĥique *************************** //
		// Envoi en cours / graphique existant et prêt à l'emploi
		// Essaye d'accéder silencieusement au graphique SVG
		if ((this.percent < 100) && document.getElementById('progressbar')) {

			try {
				var rect = (apijs.config.navigator) ? document.getElementById('progressbar').getSVGDocument().getElementById('bar') : document.getElementById('progressbar').getSVGDocument().rootElement.getElementById('bar');
			}
			catch (ee) {
				this.svgWaiting -= 1;
				return;
			}

			if (this.svgDirection === 0) {
				rect.setAttribute('x', parseFloat(rect.getAttribute('x'), 10) + 1 + '%');

				if (parseInt(rect.getAttribute('x'), 10) >= (100 - parseFloat(rect.getAttribute('width'), 10)))
					this.svgDirection = 1;
			}
			else {
				rect.setAttribute('x', parseFloat(rect.getAttribute('x'), 10) - 1 + '%');

				if (parseInt(rect.getAttribute('x'), 10) <= 0)
					this.svgDirection = 0;
			}
		}

		// *** Annulation *************************************** //
		// Temps d'attente dépassé ou envoi terminé / graphique inexistant
		else {
			this.svgWaiting = 0;
			clearInterval(this.svgTimer);
		}

	};


	// #### Avancement de la barre de progression ########################## i18n ## private ### //
	// = révision : 76
	// » Fait avancer la barre de progression jusqu'à une certaine valeur
	// » Affiche à l'intérieur du graphique SVG : 5% (25 Ko/s) / 5% (15 secondes restantes) / 5% (25 Ko/s - 15 secondes restantes) / 100%
	// » Recherche silencieusement l'accès au graphique SVG
	this.animToValue = function (percent, rate, time) {

		// *** Recherche silencieuse **************************** //
		// Essaye d'accéder au graphique SVG
		try {
			var rect, text;

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