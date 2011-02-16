/**
 * Created L/13/04/2009
 * Updated D/19/12/2010
 * Version 20 (DOESN'T WORK)
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
	this.sens = 1;
	this.anim = 0;

	this.timer = null;
	this.upload = null;
	this.extension = null;
	this.clef = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES ENVOIS DE FICHIER (X)

	// #### Envoyer un Fichier ############################################# debug ## public ### // TODO
	// = révision : 11
	// » Permet à l'utilisateur d'envoyer un fichier (tous les fichiers sont acceptés)
	// » Le champ fichier du formulaire se nomme « fichier » ou « {data} »
	// » Le fichier s'affichera dans la div ayant pour id « mesFichiers » ou « {div} »
	// » Dépend de [TheDialogue]
	this.envoyerFichier = function (titre, taille, data, div) {

		// *** Mise en place du formulaire ********************** //
		if ((typeof titre === 'string') && (typeof taille === 'number')) {

			if (typeof data !== 'string')
				data = 'fichier';

			if (typeof div !== 'string')
				div = 'mesFichiers';

			this.setupUpload('fichier', div, ['*']);

			TheDialogue.creerDialogueUpload(titre, 'Taille maximum : ' + taille.toString().replace(/\./, ',') + ' Mo\nTous les fichiers sont acceptés.', data, this.clef);
		}

		// *** Message de debug ********************************* //
		else if (DEBUG) {

			TheDialogue.creerDialogueInformation('(debug) Appel invalide', 'TheUpload » EnvoyerFichier\n➩ (string) titre : ' + titre + '\n➩ (number) taille : ' + taille + '\n➩ (string) data : ' + data + '\n➩ (string) div : ' + div);
		}
	};


	//this.setupUpload('image', div, ['.jpg', '.gif', '.png', '.tif']);
	//TheDialogue.creerDialogueUpload(titre, 'Taille maximale : ' + taille.toString().replace(/\./, ',') + ' Mo\nFormats acceptés : jpg, gif, png et tif', data, this.clef);

	//this.setupUpload('avatar', 'avatar', ['.jpg', '.gif', '.png']);
	//TheDialogue.creerDialogueUpload(titre, 'Taille maximum : ' + taille.toString().replace(/\./, ',') + ' Mo\nFormats acceptés : jpg, gif et png', data, this.clef);

	//this.setupUpload('photo', 'album', ['.jpg', '.tif']);
	//TheDialogue.creerDialogueUpload(titre, 'Taille maximale : ' + taille.toString().replace(/\./, ',') + ' Mo\nFormats acceptés : jpg et tif', data, this.clef);

	//this.setupUpload('video', 'album', ['.ogv']);
	//TheDialogue.creerDialogueUpload(titre, 'Taille maximale : ' + taille.toString().replace(/\./, ',') + ' Mo\nFormat accepté : ogv', data, this.clef);




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// TODO (2)

	// #### Prépare le terrain ##################################################### private ### // TODO
	// = révision : 6
	// » Initialise les variables d'un nouvel envoi de fichier
	// » Génération d'une clef unique car il y a obligation d'utiliser un nom d'iframe unique
	this.setupUpload = function (type, extension) {

		this.sens = 1;
		this.anim = 8;

		this.upload = type;
		this.extension = extension;
		this.clef = uniqid();
	};


	// #### Prépare le terrain ##################################################### private ### // TODO
	// = révision : 1
	this.getExtensions = function () {

		var texte = null;

		// tous les fichiers
		if (this.extension[0] !== '*') {
			texte = 'Tous les fichiers sont acceptés.';
		}

		// un seul type de fichier
		else if (this.extension.length === 1) {
			texte = 'Format accepté : ' + this.extension.pop();
		}

		// plusieurs types de fichier
		else {
			texte = 'Formats acceptés : ' + this.extension.join(', ');
			texte = texte.slice(0, texte.lastIndexOf(',')) + ' et ' + texte.slice(texte.lastIndexOf(',')+2);
		}

		return texte.replace(/\./g, '');
	};


	// #### Action du bouton Valider ############################## i18n ## event ## private ### // TODO
	// = révision : 39
	// » Vérifie si le champ fichier du formulaire d'envoi de fichier est correct
	// » Affiche un message d'erreur détaillé si le fichier proposé n'est pas conforme
	// » Affiche une boite de dialogue de progression lors de l'envoi du fichier
	// » Renvoie le focus sur le champ fichier si celui-ci est vide
	this.actionConfirm = function () {

		var noeud = document.getElementById('formUpload').firstChild.firstChild.value;

		// *** Vérification du type de fichier ****************** //
		if ((noeud.length !== 0) && (this.extension[0] !== '*') && !in_array(noeud.slice(noeud.lastIndexOf('.')), this.extension)) {

			TheDialogue.creerDialogueInformation('Envoi de fichier', "Le format de fichier est invalide, l'envoi à donc été annulé.\n\nÀ titre d'information :\n➩ Fichier proposé : " + noeud + '\n➩ ' + this.getExtensions(), 'eeupload');
		}

		// *** Validation du formulaire ************************* //
		else if (noeud.length !== 0) {

			document.getElementById('iframeUpload').setAttribute('onload', 'TheUpload.uploadDone();');
			document.getElementById('formUpload').submit();

			TheDialogue.creerDialogueProgression('Envoi de fichier', 'Opération en cours...');

			this.timer = window.setTimeout(function () { TheUpload.animGeneric(); }, 100);
		}

		// *** Champ vide *************************************** //
		else {
			document.getElementById('formUpload').firstChild.firstChild.focus();
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'ENVOI DU FICHIER (2)

	// #### Envoi temps réel ###################################### i18n ## event ## private ### // TODO
	// = révision : 0
	// » Auto-rappel toutes les 1000 ms soit environ une mise à jour seconde
	// » Auto-rappel quelque soit l'état du graphique, et si l'animation n'a pas été désactivée
	// » Communique avec le serveur pour savoir ou en est l'avancement de l'envoi du fichier
	// » Met à jour la barre de progression en conséquence
	this.uploadRealTime = function () {
		// code
	};


	// #### Envoi terminé ######################################### i18n ## event ## private ### // TODO
	// = révision : 57
	// » Désactive l'animation de la barre de progression
	// » Suppression de la boite de dialogue retardée de 1000 ms
	// » En cas d'erreur affichage d'un message d'erreur détaillé
	this.uploadDone = function () {

		// *** Désactivation de l'animation ********************* //
		this.anim = 0;

		if (this.timer)
			clearTimeout(this.timer);

		// *** Envoi terminé avec succès ou pas ***************** //
		// Essaye de lire un fichier xml
		// # <root>
		// #  <statut>2</statut>
		// #  <titre>Kernel Panic</titre>
		// #  <message>Can't find root file system, sleeping forever.</message>
		// # </root>
		try {
			// cas 1 : envoi terminé avec succès
			if (window.frames['iframeUpload_' + this.clef].document.getElementsByTagName('statut')[0].firstChild.data === '1') {

				this.animDone();
				window.setTimeout(function () { TheDialogue.actionExterne(); }, 1000);
			}

			// cas 2 : envoi terminé avec erreur
			else if (window.frames['iframeUpload_' + this.clef].document.getElementsByTagName('statut')[0].firstChild.data === '2') {

				TheDialogue.creerDialogueInformation(window.frames['iframeUpload' + this.clef].document.getElementsByTagName('titre')[0].firstChild.data, window.frames['iframeUpload' + this.clef].document.getElementsByTagName('message')[0].firstChild.data, 'eeupload');
			}

			// autres cas
			else {
				TheDialogue.creerDialogueInformation('Gloups !', "Une erreur est survenue lors de l'envoi du fichier.\nVeuillez recommencer.", 'eeupload');
			}
		}

		// *** Erreur grave ************************************* //
		catch (e) {
			TheDialogue.creerDialogueInformation('Gloups !', "Une erreur fatale est survenue lors de l'envoi du fichier.\nVeuillez recommencer.\n\n" + e, 'eeupload');
		}

		// *** Nettoyage **************************************** //
		this.upload = null;
		this.extension = null;
		this.clef = null;
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE LA BARRE DE PROGRESSION (2)

	// #### Avancement générique ######################################## timeout ## private ### // TODO
	// = révision : 44
	// » Auto-rappel toutes les 100 ms soit environ dix images seconde
	// » Auto-rappel si le graphique existe mais n'est pas prêt, et si l'animation n'a pas été désactivée
	// » Auto-rappel si le graphique existe et est prêt, et si l'animation n'a pas été désactivée
	// » Se termine automatiquement à partir du moment où : l'animation est désactivée (le temps d'attente a expiré), le graphique n'existe plus
	// » Fait bouger la barre de progression de gauche à droite et de droite à gauche en boucle
	// ~ ids : progressbar
	this.animGeneric = function () {

		// *** Attente du graphique SVG ************************* //
		// Si l'animation n'a pas été désactivée (si le temps d'attente n'a pas expiré)
		// Si le graphique existe mais n'est pas prêt
		if ((this.anim > 0) && document.getElementById('progressbar') && !document.getElementById('progressbar').getSVGDocument()) {

			this.anim -= 1;
			this.timer = window.setTimeout(apijs.upload.animGeneric, 100);
		}

		// *** Animation du grapĥique SVG *********************** //
		// Si l'animation n'a pas été désactivée (si le temps d'attente n'a pas expiré)
		// Si le graphique existe et est prêt
		else if ((this.anim > 0) && document.getElementById('progressbar') && document.getElementById('progressbar').getSVGDocument()) {

			// animation de gauche à droite et inversement
			// gestion automatique du changement de sens
			var rect = document.getElementById('progressbar').getSVGDocument().getElementsByTagName('rect')[1];

			if (this.sens === 1) {
				rect.setAttribute('x', parseInt(rect.getAttribute('x'), 10) + 10);

				if (parseInt(rect.getAttribute('x'), 10) >= 250)
					this.sens = 2;
			}
			else {
				rect.setAttribute('x', parseInt(rect.getAttribute('x'), 10) - 10);

				if (parseInt(rect.getAttribute('x'), 10) <= 0)
					this.sens = 1;
			}

			// auto-rappel
			this.timer = window.setTimeout(apijs.upload.animGeneric, 100);
		}
	};


	// #### Avancement de la barre de progression ################################## private ### // TODO
	// = révision : 28
	// » Vérifie si le graphique existe et est prêt
	// » Fait avancer la barre de progression jusqu'à une certaine valeur
	// ~ ids : progressbar
	this.animRealTime = function (valeur) {

		if (document.getElementById('progressbar') && document.getElementById('progressbar').getSVGDocument()) {

			valeur = (typeof valeur !== number) ? 100 : valeur;

			var svg = document.getElementById('progressbar').getSVGDocument();
			svg.getElementsByTagName('rect')[1].setAttribute('width', 0 + valeur * 3);
			svg.getElementsByTagName('text')[0].firstChild.replaceData(0, svg.getElementsByTagName('text')[0].firstChild.length, valeur + '%');
		}
	};
}