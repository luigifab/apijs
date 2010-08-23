/**
 * Created Me/03/03/2010
 * Updated L/09/08/2010
 * Version 13
 *
 * Copyright 2008-2010 | Fabrice Creuzot <contact@luigifab.info>
 * http://www.luigifab.info/apijs/
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

function Map() {

	// définition des attributs
	this.srvActuel = null;
	this.srvGeoportailPret = false;
	this.srvGeoportailActif = false;
	this.srvGooglePret = false;
	this.srvGoogleActif = false;

	this.width = config.map.width;
	this.height = config.map.height;
	this.modifiable = false;
	this.multipoint = false;

	this.coordonnees = false;
	this.latitude = 0;
	this.longitude = 0;

	this.geocodeur = null;
	this.layerGeoportail = null;
	this.dragGeoportail = null;

	this.mapGeoportail = null;
	this.mapGoogle = null;
	this.markerGeoportail = null;
	this.markerGoogle = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALISATION DES CARTES (4)

	// #### Initialisation ########################################################## public ### //
	// = révision : 50
	// » Affiche la carte interactive initialement masquée
	// » Applique la configuration dynamique de la carte courante
	// » Récupère les coordonnées du formulaire si cela est pertinent
	// » Active les boutons Géoportail et Google si les services sont disponibles
	// » Active les boutons Recentrer, Actualiser et Fermer
	// » Si aucun des services n'est disponible affichage d'un message d'erreur uniquement
	this.init = function () {

		document.getElementById('carteInteractive').style.display = 'block';

		// *** Configuration dynamique ************************** //
		if (document.getElementById('carteConfModifiable'))
			this.modifiable = (document.getElementById('carteConfModifiable').getAttribute('value') === 'true') ? true : false;

		if (document.getElementById('carteConfMultipoint'))
			this.multipoint = (document.getElementById('carteConfMultipoint').getAttribute('value') === 'true') ? true : false;

		if (document.getElementById('carteConfWidth') && document.getElementById('carteConfHeight')) {

			this.width = parseInt(document.getElementById('carteConfWidth').getAttribute('value'), 10);
			this.height = parseInt(document.getElementById('carteConfHeight').getAttribute('value'), 10);

			document.getElementById('carteInteractive').style.width = this.width + 'px';
			document.getElementById('carteInteractive').style.height = this.height + 'px';
		}

		// *** Configuration dynamique (coordonnées) ************ //
		if (parseFloat(document.getElementById('carteLatitude').getAttribute('value'), 10) !== 0) {

			this.latitude = parseFloat(document.getElementById('carteLatitude').getAttribute('value'), 10);
			this.longitude = parseFloat(document.getElementById('carteLongitude').getAttribute('value'), 10);
			this.coordonnees = true;
		}
		else if (document.getElementById('carteConfLatitude') && document.getElementById('carteConfLongitude')) {

			this.latitude = parseFloat(document.getElementById('carteConfLatitude').getAttribute('value'), 10);
			this.longitude = parseFloat(document.getElementById('carteConfLongitude').getAttribute('value'), 10);
		}


		// *** Mise en place du menu **************************** //
		if ((typeof geoportalLoadmap === 'function') || (typeof GMap2 === 'function')) {

			if (typeof geoportalLoadmap === 'function') {
				document.getElementById('mapControlGeoportail').addEventListener('click', function (ev) { TheMap.actionGeoportail(ev); }, false);
				document.getElementById('mapControlGeoportail').removeAttribute('disabled');
				this.srvGeoportailPret = true;
			}

			if ((typeof GMap2 === 'function') && GBrowserIsCompatible()) {
				document.getElementById('mapControlGoogle').addEventListener('click', function (ev) { TheMap.actionGoogle(ev); }, false);
				document.getElementById('mapControlGoogle').removeAttribute('disabled');
				this.srvGooglePret = true;
			}

			if (document.getElementById('mapControlRefresh'))
				document.getElementById('mapControlRefresh').addEventListener('click', function (ev) { TheMap.actionRefresh(ev); }, false);

			document.getElementById('mapControlRecenter').addEventListener('click', function (ev) { TheMap.actionRecenter(ev); }, false);
			document.getElementById('mapControlClose').addEventListener('click', function (ev) { TheMap.actionClose(ev); }, false);
		}

		// *** Aucun service de disponible ********************** //
		else {
			document.getElementById('carteIntro').style.display = 'none';
			document.getElementById('carteFatal').style.display = 'block';
		}

		// prépa destruction
		if (config.navigator)
			window.addEventListener('unload', function () { TheMap.destroy(); }, false);
		else
			window.onunload = TheMap.destroy;
	};


	// #### Géoportail ############################################################# private ### //
	// = révision : 50
	// » Utilise l'API Géoportail version 1 : https://api.ign.fr/geoportail/index.do
	// » Met en place la carte interactive du service Géoportail
	// » Paramétrage complet de la carte : menu de navigation, niveau de zoom, centrage et taille
	// » Ne s'occupe pas de la gestion des divs
	this.initGeoportail = function () {

		// *** Mise en place de la carte ************************ //
		if (!this.srvGeoportailActif) {

			this.srvGeoportailActif = true;
			this.srvActuel = 'geoportail';

			geoportalLoadmap('mapGeoportail', 'normal', 'FXX');
			this.mapGeoportail = map;
			this.mapGeoportail.setSize(this.width, this.height);
			this.mapGeoportail.getMap().getControlsByClass('OpenLayers.Control.KeyboardDefaults')[0].deactivate();
			this.mapGeoportail.getMap().setCenterAtLonLat(config.map.initLatitude, config.map.initLongitude, config.map.zoomInitial);
			this.mapGeoportail.addGeoportalLayer('GEOGRAPHICALGRIDSYSTEMS.MAPS:WMSC', { opacity:1.0 } );
			this.mapGeoportail.addGeoportalLayer('ORTHOIMAGERY.ORTHOPHOTOS:WMSC', { visibility:false } );
			this.mapGeoportail.openLayersPanel(false);
			this.mapGeoportail.openToolsPanel(true);
			this.mapGeoportail.setInformationPanelVisibility(false);
		}

		// *** Ré-affichage de la carte ************************* //
		else {
			this.srvGeoportailActif = true;
			this.srvActuel = 'geoportail';
		}
	};


	// #### Google ################################################################# private ### //
	// = révision : 54
	// » Utilise l'API Google Map version 2 : http://code.google.com/intl/fr/apis/maps
	// » Met en place la carte interactive du service Google
	// » Paramétrage complet de la carte : menu de navigation, niveau de zoom, centrage et taille
	// » Ne s'occupe pas de la gestion des divs
	this.initGoogle = function () {

		// *** Mise en place de la carte ************************ //
		if (!this.srvGoogleActif) {

			this.srvGoogleActif = true;
			this.srvActuel = 'google';

			this.mapGoogle = new GMap2(document.getElementById('mapGoogle'), { size: new GSize(this.width, this.height) } );
			this.mapGoogle.enableScrollWheelZoom();
			this.mapGoogle.setCenter(new GLatLng(config.map.initLatitude, config.map.initLongitude), config.map.zoomInitial + 1);
			this.mapGoogle.addControl(new GSmallMapControl());
			this.mapGoogle.addControl(new google.maps.MenuMapTypeControl());
		}

		// *** Ré-affichage de la carte ************************* //
		else {
			this.srvGoogleActif = true;
			this.srvActuel = 'google';
		}
	};


	// #### Destruction ############################################################# public ### //
	// = révision : 26
	// » Retour à l'état initial
	// » Juste avant de quitter la page
	this.destroy = function () {

		// *** Stop google *************************************** //
		if (typeof GUnload === 'function')
			GUnload();

		// *** Reset interface ********************************** //
		this.showIntro();

		if (!document.getElementById('mapControlGeoportail').hasAttribute('disabled'))
			document.getElementById('mapControlGeoportail').setAttribute('disabled', 'disabled');

		if (!document.getElementById('mapControlGoogle').hasAttribute('disabled'))
			document.getElementById('mapControlGoogle').setAttribute('disabled', 'disabled');

		// *** Reset attributs ********************************** //
		this.srvActuel = null;
		this.srvGeoportailPret = false;
		this.srvGeoportailActif = false;
		this.srvGooglePret = false;
		this.srvGoogleActif = false;

		this.modifiable = false;
		this.multipoint = false;

		this.coordonnees = false;
		this.latitude = 0;
		this.longitude = 0;

		this.geocodeur = null;
		this.layerGeoportail = null;
		this.dragGeoportail = null;

		this.mapGeoportail = null;
		this.mapGoogle = null;
		this.markerGeoportail = null;
		this.markerGoogle = null;
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES ACTIONS DES BOUTONS (5)

	// #### Action du bouton Fermer ####################################### event ## private ### //
	// = révision : 3
	// » Ferme les cartes et affiche le message d'introduction
	this.actionClose = function (ev) {

		ev.target.blur();
		this.showIntro();
	};


	// #### Action du bouton Recentrer #################################### event ## private ### //
	// = révision : 4
	// » Recentre la carte sur le marqueur
	this.actionRecenter = function (ev) {

		ev.target.blur();
		this.centerMap();
	};


	// #### Action du bouton Actualiser ################################### event ## private ### //
	// = révision : 10
	// » Actualise la position du marqueur en fonction de l'adresse saisie
	// » Fait une demande de coordonnées pour recentrer le marqueur et la carte
	// » Uniquement si l'adresse saisie est correcte
	this.actionRefresh = function (ev) {

		ev.target.blur();

		if (this.checkAddress())
			this.getCoordinates();
	};


	// #### Action du bouton Géoportail ################################### event ## private ### //
	// = révision : 23
	// » Affiche la carte Géoportail et son marqueur
	// » Vérifie si l'adresse saisie est correcte avant tout
	// » Création du marqueur si des coordonnées existent ou actualisation de la position du marqueur s'il existe déjà
	// » Fait une demande de coordonnées si elles sont nulles et si la carte est modifiable
	this.actionGeoportail = function (ev) {

		ev.target.blur();

		// *** Carte non modifiable ***************************** //
		if (!this.modifiable) {

			// init carte
			this.showGeoportail();
			this.initGeoportail();

			// init marqueur
			if (this.coordonnees && !this.markerGeoportail)
				this.setMarker(true);

			else if (this.coordonnees)
				this.synchroMarker(false);
		}

		// *** Carte modifiable ********************************* //
		else if (this.checkAddress()) {

			// init carte
			this.showGeoportail();
			this.initGeoportail();

			// init marqueur
			if (this.coordonnees && !this.markerGeoportail)
				this.setMarker(true);

			else if (this.coordonnees)
				this.synchroMarker(false);

			else if (!this.coordonnees)
				this.getCoordinates();
		}
	};


	// #### Action du bouton Google ####################################### event ## private ### //
	// = révision : 23
	// » Affiche la carte Google et son marqueur
	// » Vérifie si l'adresse saisie est correcte avant tout
	// » Création du marqueur si des coordonnées existent ou actualisation de la position du marqueur s'il existe déjà
	// » Fait une demande de coordonnées si elles sont nulles et si la carte est modifiable
	this.actionGoogle = function (ev) {

		ev.target.blur();

		// *** Carte non modifiable ***************************** //
		if (!this.modifiable) {

			// init carte
			this.showGoogle();
			this.initGoogle();

			// init marqueur
			if (this.coordonnees && !this.markerGoogle)
				this.setMarker(true);

			else if (this.coordonnees)
				this.synchroMarker(false);
		}

		// *** Carte modifiable ********************************* //
		else if (this.checkAddress()) {

			// init carte
			this.showGoogle();
			this.initGoogle();

			// init marqueur
			if (this.coordonnees && !this.markerGoogle)
				this.setMarker(true);

			else if (this.coordonnees)
				this.synchroMarker(false);

			else if (!this.coordonnees)
				this.getCoordinates();
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'AFFICHAGE DES CONTENEURS PARENTS (3)

	// #### Affiche l'introduction ################################################# private ### //
	// = révision : 15
	// » Active les boutons Géoportail et Google
	// » Désactive les boutons Recentrer, Actualiser et Fermer
	// » Affiche le conteneur de l'introduction et cache les autres
	this.showIntro = function () {

		// gestion des boutons des cartes
		if (this.srvGeoportailPret && document.getElementById('mapControlGeoportail').hasAttribute('class'))
			document.getElementById('mapControlGeoportail').removeAttribute('class');

		if (this.srvGeoportailPret && document.getElementById('mapControlGeoportail').hasAttribute('disabled'))
			document.getElementById('mapControlGeoportail').removeAttribute('disabled');

		if (this.srvGooglePret && document.getElementById('mapControlGoogle').hasAttribute('class'))
			document.getElementById('mapControlGoogle').removeAttribute('class');

		if (this.srvGooglePret && document.getElementById('mapControlGoogle').hasAttribute('disabled'))
			document.getElementById('mapControlGoogle').removeAttribute('disabled');

		// gestion des boutons de contrôles
		if (document.getElementById('mapControlRefresh') && !document.getElementById('mapControlRefresh').hasAttribute('disabled'))
			document.getElementById('mapControlRefresh').setAttribute('disabled', 'disabled');

		if (!document.getElementById('mapControlRecenter').hasAttribute('disabled'))
			document.getElementById('mapControlRecenter').setAttribute('disabled', 'disabled');

		if (!document.getElementById('mapControlClose').hasAttribute('disabled'))
			document.getElementById('mapControlClose').setAttribute('disabled', 'disabled');

		// gestion des conteneurs
		document.getElementById('mapGeoportail').style.display = 'none';
		document.getElementById('mapGoogle').style.display = 'none';
		document.getElementById('carteIntro').style.display = 'block';
		document.getElementById('carteFatal').style.display = 'none';
	};


	// #### Affiche la carte Géoportail ############################################ private ### //
	// = révision : 21
	// » Désactive le bouton Géoportail et active le bouton Google
	// » Active les boutons Recentrer, Actualiser et Fermer si nécessaire
	// » Affiche le conteneur de la carte Géoportail et cache les autres
	this.showGeoportail = function () {

		// gestion des boutons des cartes
		document.getElementById('mapControlGeoportail').setAttribute('class', 'actif');
		document.getElementById('mapControlGeoportail').setAttribute('disabled', 'disabled');

		if (document.getElementById('mapControlGoogle').hasAttribute('class')) {
			document.getElementById('mapControlGoogle').removeAttribute('class');
			document.getElementById('mapControlGoogle').removeAttribute('disabled');
		}

		// gestion des boutons de contrôles
		if (this.coordonnees && document.getElementById('mapControlRecenter').hasAttribute('disabled'))
			document.getElementById('mapControlRecenter').removeAttribute('disabled');

		if (this.modifiable && document.getElementById('mapControlRefresh').hasAttribute('disabled'))
			document.getElementById('mapControlRefresh').removeAttribute('disabled');

		if (document.getElementById('mapControlClose').hasAttribute('disabled'))
			document.getElementById('mapControlClose').removeAttribute('disabled');

		// gestion des conteneurs
		document.getElementById('mapGeoportail').style.display = 'block';
		document.getElementById('mapGoogle').style.display = 'none';
		document.getElementById('carteIntro').style.display = 'none';
	};


	// #### Affiche la carte Google ################################################ private ### //
	// = révision : 21
	// » Désactive le bouton Google et active le bouton Géoportail
	// » Active les boutons Recentrer, Actualiser et Fermer si nécessaire
	// » Affiche le conteneur de la carte Google et cache les autres
	this.showGoogle = function () {

		// gestion des boutons des cartes
		document.getElementById('mapControlGoogle').setAttribute('class', 'actif');
		document.getElementById('mapControlGoogle').setAttribute('disabled', 'disabled');

		if (document.getElementById('mapControlGeoportail').hasAttribute('class')) {
			document.getElementById('mapControlGeoportail').removeAttribute('class');
			document.getElementById('mapControlGeoportail').removeAttribute('disabled');
		}

		// gestion des boutons de contrôles
		if (this.coordonnees && document.getElementById('mapControlRecenter').hasAttribute('disabled'))
			document.getElementById('mapControlRecenter').removeAttribute('disabled');

		if (this.modifiable && document.getElementById('mapControlRefresh').hasAttribute('disabled'))
			document.getElementById('mapControlRefresh').removeAttribute('disabled');

		if (document.getElementById('mapControlClose').hasAttribute('disabled'))
			document.getElementById('mapControlClose').removeAttribute('disabled');

		// gestion des conteneurs
		document.getElementById('mapGeoportail').style.display = 'none';
		document.getElementById('mapGoogle').style.display = 'block';
		document.getElementById('carteIntro').style.display = 'none';
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DES COORDONNÉES (2)

	// #### Vérification de l'adresse ############################################## private ### // (bordel)
	// = révision : 20
	// » Vérifie si les champs « Code postal » et « Ville » sont correctement renseignés
	// » Affiche un message d'erreur si un des champs n'est pas conforme
	// » Dépend de [TheInput] pour la vérification des champs
	this.checkAddress = function () {

		//if (TheInput.tChamp.code_postal && TheInput.tChamp.ville)
			return true;
		//
		//else
		//	TheDialogue.creerDialogueInformation(
		//		'Attention',
		//		"Pour pouvoir afficher la carte, vous devez préalablement remplir au minimum les champs «\u00A0Code postal\u00A0» et «\u00A0Ville\u00A0».",
		//		'attention'
		//	);
		//	return false;
		//
	};


	// #### Recherche des coordonnées de l'adresse ################################# private ### // (bordel)
	// = révision : 39
	// » Apprendre à faire des commentaires !
	// » Demande à Google les coordonnées de l'adresse saisie
	// » Affiche un message d'erreur si l'adresse n'est pas trouvée
	// » Fabrique ou met à jour le marqueur correspondant aux coordonnées de l'adresse saisie
	// » En cas d'adresse introuvable ou si Google est absent l'utilisateur devra cliquer sur la carte pour afficher le marqueur
	this.getCoordinates = function () {

		// *** Initialisation *********************************** //
		if (!this.srvGooglePret) {
			this.setMarkerClick();
			return;
		}

		if (!this.geocodeur) {
			this.geocodeur = new GClientGeocoder();
			this.geocodeur.setBaseCountryCode('fr');
		}

		// *** Recherche des coordonnées ************************ //
		this.geocodeur.getLatLng(
			document.getElementById('txt_voie').value + ' ' + document.getElementById('txt_code_postal').value + ' ' + document.getElementById('txt_ville').value + ' France',
			function (pt) {

				// ** Adresse trouvée *************** //
				if (pt) {
					// sauvegarde des coordonnées
					TheMap.coordonnees = true;
					TheMap.latitude = pt.lat();
					TheMap.longitude = pt.lng();

					// création immédiate du marqueur
					if ((TheMap.srvActuel === 'geoportail') && !TheMap.markerGeoportail ||
					    (TheMap.srvActuel === 'google') && !TheMap.markerGoogle) {
						TheMap.setMarker(true);
					}
					else {
						TheMap.synchroMarker(true);
					}
				}
				// ** Adresse introuvable *********** //
				else {
					// création dynamique du marqueur
					if ((TheMap.srvActuel === 'geoportail') && !TheMap.markerGeoportail ||
					    (TheMap.srvActuel === 'google') && !TheMap.markerGoogle) {
						TheMap.setMarkerClick();
					}

					// information
					TheDialogue.creerDialogueInformation('Attention', 'Adresse introuvable.', 'attention');
				}
			}
		);
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DU MARQUEUR (4)

	// #### Création du marqueur dynamique ######################################### private ### //
	// = révision : 36
	// » Permet la création du marqueur lorsque l'utilisateur cliquera sur la carte
	// » Met en place le gestionnaire d'événement associé pour permettre la création du marqueur
	// » Un seul et unique marqueur par carte
	this.setMarkerClick = function () {

		// *** Géoportail *************************************** //
		if (this.srvActuel === 'geoportail') {

			this.mapGeoportail.getMap().events.register('click', TheMap.mapGeoportail, function (ev) {

				if (!TheMap.markerGeoportail) {

					var pt = TheMap.mapGeoportail.getMap().getLonLatFromViewPortPx(ev.xy);
					pt.transform(TheMap.mapGeoportail.getMap().getProjection(), OpenLayers.Projection.CRS84);

					TheMap.coordonnees = true;
					TheMap.latitude = pt.lat;
					TheMap.longitude = pt.lon;
					TheMap.setMarker(true);
				}
			});
		}

		// *** Google ******************************************* //
		else if (this.srvActuel === 'google') {

			// création du marqueur
			GEvent.addListener(this.mapGoogle, 'click', function (mk, pt) {

				if (!TheMap.markerGoogle) {

					TheMap.coordonnees = true;
					TheMap.latitude = pt.lat();
					TheMap.longitude = pt.lng();
					TheMap.setMarker(true);
				}
			});
		}
	};


	// #### Création du marqueur ######################################## (event) ## private ### //
	// = révision : 48
	// » Fabrique le marqueur qui sera positionné sur les coordonnées
	// » Met en place le gestionnaire d'événement associé au marqueur pour permettre son déplacement
	// » Sauvegarde par la même occasion les coordonnées dans le formulaire
	// » Active le bouton recentrer si nécessaire
	// » Recentre la carte si nécessaire
	this.setMarker = function (centrer) {

		// *** Géoportail *************************************** //
		if (this.srvActuel === 'geoportail') {

			// positionnement du marqueur
			var position = new OpenLayers.Geometry.Point(this.longitude, this.latitude);
			position.transform(OpenLayers.Projection.CRS84, this.mapGeoportail.getMap().getProjection());

			// création du marqueur
			this.markerGeoportail = new OpenLayers.Feature.Vector(
				position, null, { externalGraphic:config.map.imageMarker, graphicWidth:26, graphicHeight:32, graphicXOffset:-12, graphicYOffset:-32 }
			);

			// couche du marqueur
			if (!this.layerGeoportail)
				this.layerGeoportail = new OpenLayers.Layer.Vector('Marqueur');

			this.layerGeoportail.addFeatures([this.markerGeoportail]);
			this.mapGeoportail.getMap().addLayer(this.layerGeoportail);

			// déplacement du marqueur
			if (!this.dragGeoportail && this.modifiable) {

				this.dragGeoportail = new OpenLayers.Control.DragFeature(this.layerGeoportail);
				this.mapGeoportail.getMap().addControl(this.dragGeoportail);

				this.dragGeoportail.activate();
				this.dragGeoportail.onComplete = function (marker, point) {

					var pt = TheMap.mapGeoportail.getMap().getLonLatFromViewPortPx(point);
					pt.transform(TheMap.mapGeoportail.getMap().getProjection(), OpenLayers.Projection.CRS84);

					TheMap.latitude = pt.lat;
					TheMap.longitude = pt.lon;
					TheMap.centerMap();

					document.getElementById('carteLatitude').setAttribute('value', TheMap.latitude);
					document.getElementById('carteLongitude').setAttribute('value', TheMap.longitude);
				};
			}
		}

		// *** Google ******************************************* //
		else if (this.srvActuel === 'google') {

			var img = new GIcon();
			img.image = config.map.imageMarker;
			img.iconSize = new GSize(26, 32);
			img.iconAnchor = new GPoint(12, 32);

			// création du marqueur
			this.markerGoogle = new GMarker(
				new GLatLng(this.latitude, this.longitude), { icon:img, draggable:this.modifiable, clickable:false }
			);

			// affichage du marqueur
			this.mapGoogle.addOverlay(this.markerGoogle);

			// gestion du déplacement
			if (this.modifiable) {

				GEvent.addListener(this.markerGoogle, 'dragend', function () {

					var pt = TheMap.markerGoogle.getPoint();

					TheMap.latitude = pt.lat();
					TheMap.longitude = pt.lng();
					TheMap.mapGoogle.panTo(pt);

					document.getElementById('carteLatitude').setAttribute('value', TheMap.latitude);
					document.getElementById('carteLongitude').setAttribute('value', TheMap.longitude);
				});
			}
		}

		// *** Centre la carte ********************************** //
		if (centrer)
			this.centerMap(config.map.zoomSynchro);

		// *** Activation bouton recentrer ********************** //
		if (document.getElementById('mapControlRecenter').hasAttribute('disabled'))
			document.getElementById('mapControlRecenter').removeAttribute('disabled');

		// *** Sauvegarde des coordonnées *********************** //
		document.getElementById('carteLatitude').setAttribute('value', this.latitude);
		document.getElementById('carteLongitude').setAttribute('value', this.longitude);
	};


	// #### Actualise la position du marqueur ###################################### private ### //
	// = révision : 28
	// » Actualise la position du marqueur en fonction des coordonnées uniquement si la carte est modifiable
	// » Utile pour synchroniser les cartes Géoportail et Google
	// » En profite pour recentrer la carte si nécessaire
	this.synchroMarker = function (centrer) {

		// *** Géoportail *************************************** //
		if (this.srvActuel === 'geoportail') {

			if (this.modifiable && this.markerGeoportail) {
				this.layerGeoportail.removeFeatures([this.markerGeoportail]);
				this.setMarker(false);
			}

			if (!this.markerGeoportail)
				this.setMarker(true);

			if (centrer)
				this.centerMap();
		}

		// *** Google ******************************************* //
		else if (this.srvActuel === 'google') {

			if (this.modifiable && this.markerGoogle)
				this.markerGoogle.setLatLng(new GLatLng(this.latitude, this.longitude));

			if (!this.markerGoogle)
				this.setMarker(true);

			if (centrer)
				this.centerMap();
		}
	};


	// #### Centre la carte ######################################################## private ### //
	// = révision : 26
	// » Recentre la carte sur le marqueur
	// » Adapte le zoom si nécessaire (prend en charge la différence du niveau de zoom entre Géoportail et Google)
	// » Uniquement s'il y a des coordonnées et donc un marqueur
	this.centerMap = function (zoom) {

		// *** Géoportail *************************************** //
		if (this.coordonnees && (this.srvActuel === 'geoportail')) {

			if (typeof zoom === 'number')
				this.mapGeoportail.getMap().setCenterAtLonLat(this.longitude, this.latitude, zoom);

			else if (this.mapGeoportail.getMap().getZoom() < config.map.zoomCenter)
				this.mapGeoportail.getMap().setCenterAtLonLat(this.longitude, this.latitude, config.map.zoomCenter);

			else
				this.mapGeoportail.getMap().setCenterAtLonLat(this.longitude, this.latitude);
		}

		// *** Google ******************************************* //
		else if (this.coordonnees && (this.srvActuel === 'google')) {

			if (typeof zoom === 'number')
				this.mapGoogle.setCenter(new GLatLng(this.latitude, this.longitude), zoom + 1);

			else if (this.mapGoogle.getZoom() < config.map.zoomCenter)
				this.mapGoogle.setCenter(new GLatLng(this.latitude, this.longitude), config.map.zoomCenter + 1);

			else
				this.mapGoogle.setCenter(new GLatLng(this.latitude, this.longitude));
		}
	};
}
