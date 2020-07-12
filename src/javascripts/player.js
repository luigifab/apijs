/**
 * Created D/11/01/2015
 * Updated D/12/07/2020
 *
 * Copyright 2008-2020 | Fabrice Creuzot (luigifab) <code~luigifab~fr>
 * https://www.luigifab.fr/apijs
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

apijs.core.player = function () {

	"use strict";
	this.root  = null;
	this.video = null;
	this.stalled = false;
	this.subload = false;


	// GÉNÉRATION DES ÉLÉMENTS (private return this|void|domelement)

	this.init = function (root, video, url) { // todo

		var idx, tracks;

		this.root  = root;
		this.video = video;

		video.removeAttribute('controls');

		// https://developer.mozilla.org/fr/docs/Web/Guide/DOM/Events/evenement_medias
		// envoyé lorsque les métadonnées du média ont fini de se télécharger
		// tous les attributs ont désormais toutes les informations utiles qu'ils peuvent contenir
		video.onloadedmetadata = function (ev) {

			this.stalled = false;
			this.onTimeupdate(ev);
			this.onProgress(ev);

			if (typeof this.video.videoTracks == 'object') {

				// si la vidéo contient plusieurs pistes audio
				tracks = this.video.videoTracks;
				if (tracks.length > 1) {
					for (idx = 0; idx < tracks.length; idx++)
						this.createOption('videotrack', idx, (tracks[idx].label === '') ? tracks[idx].language : tracks[idx].language + ' - ' + tracks[idx].label);
					this.updateSelect('videotrack', tracks.length, 0);
				}

				this.html('.tracks.videotrack select').selectedIndex = 0;
			}

			if (typeof this.video.audioTracks == 'object') {

				// si la vidéo contient plusieurs pistes audio
				tracks = this.video.audioTracks;
				if (tracks.length > 1) {
					for (idx = 0; idx < tracks.length; idx++)
						this.createOption('audiotrack', idx, (tracks[idx].label === '') ? tracks[idx].language : tracks[idx].language + ' - ' + tracks[idx].label);
					this.updateSelect('audiotrack', tracks.length, 0);
				}

				this.html('.tracks.audiotrack select').selectedIndex = 0;
			}

		}.bind(this);

		// envoyé lorsque l'agent utilisateur essaye de télécharger des données du média mais que celle-ci sont indisponibles
		video.onstalled = function (ev) {
			this.stalled = true;
			this.onWaiting(ev);
		}.bind(this);

		// envoyé lorsque la lecture du média commence
		video.onplaying      = apijs.player.onPlay.bind(this);
		// envoyé lorsque la lecture du média est mise en pause
		video.onpause        = apijs.player.onPlay.bind(this);
		// envoyé lorsque la lecture du média est terminée
		video.onended        = apijs.player.onEnded.bind(this);
		// envoyé de manière périodique pour informer de la progression du téléchargement du média
		video.onprogress     = apijs.player.onProgress.bind(this);
		// envoyé lorsque la position de la tête de lecture dans le média indiquée par l'attribut currentTime change
		video.ontimeupdate   = apijs.player.onTimeupdate.bind(this);
		// envoyé lorsqu'une opération de déplacement dans le média commence
		video.onseeking      = apijs.player.onTimeupdate.bind(this);
		// envoyé lorsqu'une opération de déplacement dans le média est terminée
		video.onseeked       = apijs.player.onWaiting.bind(this);
		// envoyé lorsqu'une opération demandée est reportée en attendant la fin d'une autre opération
		video.onwaiting      = apijs.player.onWaiting.bind(this);
		// envoyé lorsque le téléchargement du média commence
		video.onloadstart    = apijs.player.onWaiting.bind(this);
		// envoyé lorsqu'il y a assez de données disponibles pour que le média puisse être lu
		video.oncanplay      = apijs.player.onWaiting.bind(this);
		// envoyé lorsque le volume sonore du lecteur ou que l'attribut muted de l'élément changent
		video.onvolumechange = apijs.player.actionVolume.bind(this);

		// charge les sources
		if (url.indexOf('m3u') < 0)
			return this.createTags([url]);

		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				self.dispatchEvent(new CustomEvent('apijsajaxresponse', { detail: { from: 'apijs.player.init', xhr: xhr } }));
				if ([0, 200].has(xhr.status))
					apijs.player.createTags(xhr.responseText.trim().split("\n"));
				else
					apijs.dialog.onMediaLoad({ type: 'error' });
			}
		};
		xhr.send();

		return this;
	};

	this.createTags = function (data) { // todo

		var url, txt, elem;
		if (this.video.childNodes.length > 0)
			return;

		this.vv = 0;
		this.tt = 0;

		while (typeof (url = data.shift()) == 'string') {
			// #APIJS#attr|name|value
			if (url.indexOf('#APIJS#attr') === 0) {
				txt = url.split('|');
				this.video.setAttribute(txt[1], txt[2]);
			}
			// #APIJS#track|kind|label|srclang|src
			else if (url.indexOf('#APIJS#track|subtitles') === 0) {
				txt = url.split('|');
				// option
				this.createOption('text', this.tt++, txt[3] + ' - ' + txt[2]);
				// track
				elem = document.createElement('track');
				elem.setAttribute('kind', txt[1]);
				elem.setAttribute('label', txt[2]);
				elem.setAttribute('srclang', txt[3]);
				elem.setAttribute('src', txt[4]);
				elem.onload = function (ev) {
					if (ev.target.track.mode === 'showing') {
						apijs.log('player:track:onload');
						this.onWaiting(ev);
						this.subload = false;
					}
				}.bind(this);
				elem.onerror = function (ev) {
					if (ev.target.track.mode === 'showing') {
						apijs.log('player:track:onerror');
						this.onWaiting(ev);
						this.subload = false;
					}
				}.bind(this);
				this.video.appendChild(elem);
			}
			// #EXTINF: Text
			else if (url.indexOf('#EXTINF') === 0) {
				txt = url.replace(/#EXTINF:[0-9]+,/, '');
			}
			// http
			else if ((url.length > 5) && (url[0] !== '#')) {
				// option
				this.createOption('video', this.vv++, (typeof txt == 'string') ? txt : this.vv);
				// source
				elem = document.createElement('source');
				elem.setAttribute('src', url);
				elem.onerror = apijs.dialog.onMediaLoad;
				this.video.appendChild(elem);
			}
		}

		this.updateSelect('video', this.vv, 0);
		if (typeof this.video.textTracks == 'object')
			this.updateSelect('text', this.tt, 1, true); // 1 pour off

		return this;
	};

	this.createOption = function (css, idx, txt) {

		var elem = document.createElement('option');
		elem.setAttribute('value', idx);
		elem.appendChild(document.createTextNode(txt));

		this.html('.tracks.' + css + ' select').appendChild(elem);
	};

	this.updateSelect = function (css, total, adjust, alone) {

		// s'il y en a 1 on affiche pas, sauf si demandé
		if (total > ((alone === true) ? 0 : 1)) {
			this.html('.tracks.' + css).removeAttribute('style');
			this.html('.tracks.' + css + ' em').textContent = '(' + total + ')';
			this.html('.tracks.' + css + ' select').setAttribute('size', (total < 10) ? total + adjust : 10);
		}
		else {
			this.html('.tracks.' + css).setAttribute('style', 'display:none;');
			this.html('.tracks.' + css + ' select').innerHTML = '';
		}
	};

	this.html = function (selector) {
		return this.root.querySelector(selector);
	};


	// GESTION DES INTERACTIONS (private return void)

	this.onTimeupdate = function (ev) {

		var hh, mm, ss, time, duration, text = '00:00';

		time = this.video.currentTime;
		if (time > 0) {

			hh = Math.floor(time / 3600);
			mm = Math.floor((time % 3600) / 60);
			ss = Math.floor(time % 60);

			if (ss < 10) ss = '0' + ss;
			if (mm < 10) mm = '0' + mm;

			hh = (hh > 0) ? hh + ':' : '';
			text = hh + mm + ':' + ss;
		}

		duration = this.video.duration;
		if ((duration !== Infinity) && !isNaN(duration)) {

			hh = Math.floor(duration / 3600);
			mm = Math.floor((duration % 3600) / 60);
			ss = Math.floor(duration % 60);

			if (ss < 10) ss = '0' + ss;
			if (mm < 10) mm = '0' + mm;

			hh = (hh > 0) ? hh + ':' : '';
			text += ' / ' + hh + mm + ':' + ss;

			this.html('svg.bar rect').style.width = (time / duration * 100) + '%';
		}

		this.html('span.time').textContent = text;

		// loader stalled pas par les tracks
		if (this.stalled && !this.subload) {
			this.stalled = false;
			this.onWaiting(ev);
		}
	};

	this.onProgress = function () {

		var elem = this.html('svg.bar'), video = this.video, idx = video.buffered.length, buffer, width;

		if ((idx > 0) && (video.duration !== Infinity) && !isNaN(video.duration)) {

			elem.querySelectorAll('.buffer').forEach(function (node) { node.parentNode.removeChild(node); });

			while (idx-- > 0) {

				buffer = document.createElement('rect');
				buffer.setAttribute('class', 'buffer');

				width = (video.buffered.end(idx) - video.buffered.start(idx)) / video.duration * 100;
				if (width > 99.8)
					buffer.setAttribute('style', 'left:0%; width:100%;');
				else
					buffer.setAttribute('style', 'left:' + (video.buffered.start(idx) / video.duration * 100) + '%; width:' + width + '%;');

				elem.appendChild(buffer);
			}
		}
	};

	this.onPlay = function () {

		if (this.video.paused) {
			this.html('span.play').textContent = '\uE810';
			apijs.dialog.remove('playing');
		}
		else {
			this.html('span.play').textContent = '\uE811';
			apijs.dialog.add('playing');
		}
	};

	this.onEnded = function () {
		this.html('span.play').textContent = '⟲';
	};

	this.onWaiting = function (ev) {
		apijs.log('player:onWaiting:' + ev.type + '  stalled:' + this.stalled + '/subload:' + this.subload);
		apijs.dialog[['loadstart', 'waiting', 'seeking', 'stalled'].has(ev.type) ? 'add' : 'remove']('loading');
	},

	this.actionVolume = function (ev) {

		var elem = this.html('svg.vol'), width = elem.offsetWidth, value = 0, video = this.video;

		if (video.networkState !== 3) {

			if ((typeof ev == 'object') && !isNaN(ev.clientX)) {

				do { value += elem.offsetLeft; }
				while (elem = elem.offsetParent);

				value = ((ev.clientX - value) * 100 / width) / 100;
				value = (value <= 0.1) ? 0 : ((value > 0.92) ? 1 : value);

				//if (self.getComputedStyle(this.html('svg.vol')).direction === 'rtl')
				//	value = 1 - value;

				video.volume = value;
				video.muted  = false;
			}

			this.html('svg.vol rect').style.width = video.muted ? 0 : (video.volume * 100) + '%';
		}
	};

	this.actionPosition = function (ev) {

		var elem = this.html('svg.bar'), width = elem.offsetWidth, value = 0, video = this.video;

		if ((video.networkState !== 3) && (typeof ev == 'object') && (video.duration !== Infinity) && !isNaN(video.duration)) {

			do { value += elem.offsetLeft; }
			while (elem = elem.offsetParent);

			value = (video.duration * (ev.clientX - value) * 100 / width) / 100;
			value = (value <= 1) ? 0 : value;

			//if (self.getComputedStyle(this.html('svg.vol')).direction === 'rtl')
			//	value = video.duration - value;

			video.currentTime = value;
		}
	};

	this.actionVideo = function (elem) {

		this.html('svg.bar rect').style.width = '0';
		this.html('svg.bar').querySelectorAll('.buffer').forEach(function (node) { node.parentNode.removeChild(node); });
		this.html('span.play').textContent = '\uE810';

		this.updateSelect('videotrack', 0, 0);
		this.updateSelect('audiotrack', 0, 0);

		this.video.src = this.video.querySelectorAll('source')[elem.value].src;

		elem.blur();
	};

	this.actionVideotrack = function (elem) {

		var idx, tracks = this.video.videoTracks;
		for (idx = 0; idx < tracks.length; idx++)
			tracks[idx].enabled = (idx == elem.value);

		elem.blur();
	};

	this.actionAudiotrack = function (elem) {

		var idx, tracks = this.video.audioTracks;
		for (idx = 0; idx < tracks.length; idx++)
			tracks[idx].enabled = (idx == elem.value);

		elem.blur();
	};

	this.actionText = function (elem) {

		var idx, tracks = this.video.textTracks;
		for (idx = 0; idx < tracks.length; idx++)
			tracks[idx].mode = (idx == elem.value) ? 'showing' : 'hidden';

		elem.blur();
		this.subload = true;
	};
};