/**
 * Created W/03/03/2010
 * Updated V/18/11/2011
 * Version 15
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

function Map() {

	// définition des attributs
	this.enabled = false;
	this.fullscreen = false;
	this.allButtons = ['Type', 'Center', 'Fullscreen', 'Close'];

	this.geoportalEnabled = false;
	this.geoportalMap = null;

	this.googleEnabled = false;
	this.googleMap = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALISATION DES CARTES (X)

	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.init = function () {

		if (document.getElementById('mapBtnType'))
			document.getElementById('mapBtnType').setAttribute('onclick', 'apijs.map.actionMode(); this.blur();');

		if (document.getElementById('mapBtnCenter'))
			document.getElementById('mapBtnCenter').setAttribute('onclick', 'apijs.map.actionRecenter(); this.blur();');

		if (document.getElementById('mapBtnFullscreen'))
			document.getElementById('mapBtnFullscreen').setAttribute('onclick', 'apijs.map.actionFullscreen(); this.blur();');

		document.getElementById('mapBtnGeoportal').removeAttribute('disabled');
		document.getElementById('mapBtnGeoportal').setAttribute('onclick', 'apijs.map.actionGeoportal(); this.blur();');

		document.getElementById('mapBtnGoogle').removeAttribute('disabled');
		document.getElementById('mapBtnGoogle').setAttribute('onclick', 'apijs.map.actionGoogle(); this.blur();');

		document.getElementById('mapBtnClose').setAttribute('onclick', 'apijs.map.actionClose(); this.blur();');

		// destructeur
		window.addEventListener('unload', apijs.map.destroy, false);
	};


	// #### ? ###################################################################### private ### // TODO
	// = révision : 1
	this.checkButtons = function () {

		if (!this.enabled) {

			for (var button in this.allButtons) if (this.allButtons.hasOwnProperty(button)) {

				button = 'mapBtn' + this.allButtons[button];

				if (document.getElementById(button))
					document.getElementById(button).removeAttribute('disabled');
			}

			document.getElementById('mapIntro').setAttribute('class', 'nodisplay');
			this.enabled = true;
		}
	};


	// #### Destructeur ############################################################ private ### //
	// = révision : 2
	// » Sort du mode plein écran et ferme les cartes
	// » Lorsque l'utilisateur quitte la page
	this.destroy = function () {
		apijs.map.actionClose();
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DES CARTES (X)

	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.showGeoportalMap = function () {

		this.geoportalEnabled = true;
		this.googleEnabled = false;

		var center = (this.googleMap !== null) ? this.getGoogleCenter() : apijs.config.map.defaultCoords;

		if (this.geoportalMap !== null) {
			if (this.googleMap !== null)
				this.setGeoportalCenter(center.lon, center.lat, center.zoom);
		}
		else {
			geoportalLoadmap('mapGeoportal', 'mini');
			this.geoportalMap = map;
			this.geoportalMap.addGeoportalLayer('GEOGRAPHICALGRIDSYSTEMS.MAPS:WMSC', { opacity:1.0, visibility:true });
			this.geoportalMap.addGeoportalLayer('ORTHOIMAGERY.ORTHOPHOTOS:WMSC', { opacity:1.0, visibility:false });
			this.geoportalMap.getMap().getControlsByClass('OpenLayers.Control.KeyboardDefaults')[0].deactivate();
			this.geoportalMap.getMap().setCenterAtLonLat(center.lon, center.lat, center.zoom);
		}
	};


	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.showGoogleMap = function () {

		this.geoportalEnabled = false;
		this.googleEnabled = true;

		var center = (this.geoportalMap !== null) ? this.getGeoportalCenter() : apijs.config.map.defaultCoords;

		if (this.googleMap !== null) {
			if (this.geoportalMap !== null)
				this.setGoogleCenter(center.lon, center.lat, center.zoom);
		}
		else {
			this.googleMap = new google.maps.Map(document.getElementById('mapGoogle'), {
				disableDefaultUI: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: new google.maps.LatLng(center.lat, center.lon),
				zoom: center.zoom,
			});
		}
	};


	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.getGeoportalCenter = function () {
		var center = this.geoportalMap.getMap().getCenter();
		center.transform(this.geoportalMap.getMap().getProjection(), OpenLayers.Projection.CRS84);
		return { lon: center.lon, lat: center.lat, zoom: this.geoportalMap.getMap().getZoom() };
	};


	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.getGoogleCenter = function () {
		var center = this.googleMap.getCenter();
		return { lon: center.lng(), lat: center.lat(), zoom: this.googleMap.getZoom() };
	};


	// #### Centre la carte sur des coordonnées [Géoportail] ######################## public ### //
	// = révision : 3
	// » Recentre la carte sur de nouvelles coordonnées
	// » Modifie le niveau de zoom lorsque nécessaire
	this.setGeoportalCenter = function (lon, lat, zoom) {

		zoom = (typeof zoom !== 'number') ? this.geoportalMap.getMap().getZoom() : zoom;
		this.geoportalMap.getMap().setCenterAtLonLat(lon, lat, zoom);
	};


	// #### Centre la carte sur des coordonnées [Google] ############################ public ### //
	// = révision : 3
	// » Recentre la carte sur de nouvelles coordonnées
	// » Modifie le niveau de zoom lorsque nécessaire
	this.setGoogleCenter = function (lon, lat, zoom) {

		zoom = (typeof zoom !== 'number') ? this.googleMap.getZoom() : zoom;
		this.googleMap.setCenter(new google.maps.LatLng(lat, lon));
		this.googleMap.setZoom(zoom);
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DES MARQUEURS (X)

	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.addMarkerByClick = function () {
		//
	};


	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.addMarkerByCoords = function () {
		//
	};


	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.addGeoportalMarker = function () {
		//
	};


	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.addGoogleMarker = function () {
		//
	};


	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.delGeoportalMarker = function () {
		//
	};


	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.delGoogleMarker = function () {
		//
	};


	// #### ? ####################################################################### public ### // TODO
	// = révision : 1
	this.syncAllMarkers = function () {
		//
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DÉFINITION DES ACTIONS DES BOUTONS (6)

	// #### Action du bouton Carte/Satellite ############################### event ## public ### //
	// = révision : 6
	// » Permet de changer rapidement de fond de carte
	// » Gère les cartes du Géoportail et de Google
	this.actionMode = function () {

		if (this.geoportalMap !== null) {

			for (var i = 0, layer = null; i < this.geoportalMap.getMap().layers.length; i++) {
				layer = this.geoportalMap.getMap().layers[i];
				if ((typeof layer.params === 'object') && (typeof layer.params.LAYERS === 'string'))
					layer.setVisibility((layer.visibility) ? false : true);
			}
		}

		if (this.googleMap !== null) {

			if (this.googleMap.getMapTypeId() === google.maps.MapTypeId.SATELLITE)
				this.googleMap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
			else
				this.googleMap.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		}
	};


	// #### Action du bouton Recentrer ##################################### event ## public ### //
	// = révision : 4
	// » Recentre la carte sur les coordonnées initiales
	// » Gère les cartes du Géoportail et de Google
	this.actionRecenter = function () {
		//
	};


	// #### Action du bouton Plein-écran ################################### event ## public ### //
	// = révision : 6
	// » Entre ou sort du mode plein écran
	// » Redimensionne la carte et recentre la carte sur la même position
	// » Gère les cartes du Géoportail et de Google
	this.actionFullscreen = function (close) {

		// gestion du mode plein écran
		if ((this.fullscreen === true) || (close === false)) {
			document.getElementById('map').removeAttribute('class');
			document.getElementById('mapBtnFullscreen').setAttribute('class', 'other');
			this.fullscreen = false;
		}
		else {
			document.getElementById('map').setAttribute('class', 'fullscreen');
			document.getElementById('mapBtnFullscreen').setAttribute('class', 'other actif');
			this.fullscreen = true;
		}

		// redimensionne et recentre la carte
		if (this.geoportalMap !== null) {
			var center = this.geoportalMap.getMap().getCenter();
			this.geoportalMap.setSize();
			this.geoportalMap.getMap().setCenter(center);
		}

		if (this.googleMap !== null) {
			var center = this.googleMap.getCenter();
			google.maps.event.trigger(this.googleMap, 'resize');
			this.googleMap.setCenter(center);
		}
	};


	// #### Action du bouton Géoportail #################################### event ## public ### //
	// = révision : 8
	// » Cache la carte de Google et affiche la carte du Géoportail
	// » Demande l'affichage de la carte ainsi que la synchronisation des marqueurs
	this.actionGeoportal = function () {

		// gestion des conteneurs
		document.getElementById('mapGoogle').setAttribute('class', 'nodisplay');
		document.getElementById('mapBtnGoogle').setAttribute('class', 'map');

		document.getElementById('mapGeoportal').removeAttribute('class');
		document.getElementById('mapBtnGeoportal').setAttribute('class', 'map actif');

		// gestion de la carte
		this.checkButtons();
		this.showGeoportalMap();
		this.syncAllMarkers();
	};


	// #### Action du bouton Google ######################################## event ## public ### //
	// = révision : 8
	// » Cache la carte du Géoportail et affiche la carte de Google
	// » Demande l'affichage de la carte ainsi que la synchronisation des marqueurs
	this.actionGoogle = function () {

		// gestion des conteneurs
		document.getElementById('mapGeoportal').setAttribute('class', 'nodisplay');
		document.getElementById('mapBtnGeoportal').setAttribute('class', 'map');

		document.getElementById('mapGoogle').removeAttribute('class');
		document.getElementById('mapBtnGoogle').setAttribute('class', 'map actif');

		// gestion de la carte
		this.checkButtons();
		this.showGoogleMap();
		this.syncAllMarkers();
	};


	// #### Action du bouton Fermer ######################################## event ## public ### //
	// = révision : 14
	// » Désactive les boutons de contrôle et quitte le mode plein écran
	// » Cache les cartes du Géoportail et de Google et affiche le message d'intro
	this.actionClose = function () {

		this.enabled = false;

		// désactivation des boutons
		for (var button in this.allButtons) if (this.allButtons.hasOwnProperty(button)) {

			button = 'mapBtn' + this.allButtons[button];

			if (document.getElementById(button) && (button === 'mapBtnClose')) {
				document.getElementById(button).setAttribute('disabled', 'disabled');
				document.getElementById(button).setAttribute('class', 'close');
			}
			else if (document.getElementById(button)) {
				document.getElementById(button).setAttribute('disabled', 'disabled');
				document.getElementById(button).setAttribute('class', 'other');
			}
		}

		// sortie du mode plein écran
		this.actionFullscreen(false);

		// gestion des conteneurs
		document.getElementById('mapBtnGeoportal').setAttribute('class', 'map');
		document.getElementById('mapBtnGoogle').setAttribute('class', 'map');

		document.getElementById('mapGeoportal').setAttribute('class', 'nodisplay');
		document.getElementById('mapGoogle').setAttribute('class', 'nodisplay');

		document.getElementById('mapIntro').removeAttribute('class');
	};
}