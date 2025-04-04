/**
 * Created D/11/01/2015
 * Updated D/03/12/2023
 *
 * Copyright 2008-2025 | Fabrice Creuzot (luigifab) <code~luigifab~fr>
 * https://github.com/luigifab/apijs
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

apijs.core.player = function (video, url) {

	"use strict";
	this.video   = video;
	this.stalled = false;
	this.subload = false;


	// GÉNÉRATION DES ÉLÉMENTS (private return this|void|domelement)

	this.autoRun = function (video, url) { // todo

		video.removeAttribute('src');
		video.removeAttribute('data-src');
		video.removeAttribute('controls');
		video.classList.add('apijsplayer');

		// @see https://developer.mozilla.org/fr/docs/Web/Guide/DOM/Events/evenement_medias
		video.onloadedmetadata = function (ev) {
			this.stalled = false;
			this.onTimeupdate(ev);
			this.onProgress(ev);
			this.onVideotrack();
			this.onAudiotrack();
		}.bind(this);
		video.onstalled = function (ev) {
			this.stalled = true;
			this.onWaiting(ev);
		}.bind(this);
		video.onplaying        = this.onPlay.bind(this);
		video.onpause          = this.onPlay.bind(this);
		video.onended          = this.onPlay.bind(this);
		video.onprogress       = this.onProgress.bind(this);
		video.ontimeupdate     = this.onTimeupdate.bind(this);
		video.onseeking        = this.onTimeupdate.bind(this);
		video.onseeked         = this.onWaiting.bind(this);
		video.onwaiting        = this.onWaiting.bind(this);
		video.onloadstart      = this.onWaiting.bind(this);
		video.oncanplay        = this.onWaiting.bind(this);
		video.onclick          = this.actionPlay.bind(this);
		video.onvolumechange   = this.actionVolume.bind(this);
		video.ondurationchange = apijs.dialog.onMediaLoad;
		video.onerror          = apijs.dialog.onMediaLoad;

		// ajoute les contrôles
		video.parentNode.appendChild(this.htmlSvgPlayer());

		// charge les sources
		if (url.indexOf('m3u') < 0) {
			video.appendChild(this.htmlSource(url));
			return this;
		}

		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				self.dispatchEvent(new CustomEvent('apijsajaxresponse', { detail: { from: 'apijsplayer.init', xhr: xhr } }));
				if (!video || (video.childNodes.length > 0)) {
					xhr.abort();
				}
				else if ([0, 200].has(xhr.status)) {

					var url, txt = 0, nbv = 0, nbt = 0, data = xhr.responseText.trim().split("\n");
					while (typeof (url = data.shift()) == 'string') {

						// #APIJS#attr|name|value
						if (url.indexOf('#APIJS#attr') === 0) {
							txt = url.split('|');
							video.setAttribute(txt[1], txt[2]);
						}
						// #APIJS#track|kind|label|srclang|src
						else if (url.indexOf('#APIJS#track|subtitles') === 0) {
							txt = url.split('|');
							this.html('.tracks.texttrack select').appendChild(this.htmlOption(nbt++, txt[3] + ' - ' + txt[2]));
							video.appendChild(this.htmlTrack(txt));
						}
						// #EXTINF: Text
						else if (url.indexOf('#EXTINF') === 0) {
							txt = url.replace(/#EXTINF:\d+,/, '');
						}
						// http
						else if ((url.length > 5) && (url[0] !== '#')) {
							this.html('.tracks.video select').appendChild(this.htmlOption(nbv++, (typeof txt == 'string') ? txt : nbv));
							video.appendChild(this.htmlSource(url));
						}
					}

					this.updateSelect('video', nbv);
					if (typeof video.textTracks == 'object')
						this.updateSelect('texttrack', video.textTracks.length || nbt);
				}
				else {
					apijs.dialog.onMediaLoad({ type: 'error' });
				}
			}
		}.bind(this);
		xhr.send();

		return this;
	};

	this.updateSelect = function (css, total) {

		// s'il y une seule option on affiche pas, sauf pour les sous titres
		var adjust = (css === 'texttrack') ? 1 : 0;
		if (total > adjust) {
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
		return this.video.parentNode.querySelector(selector);
	};


	// GESTION DES ÉVÉNEMENTS (private return void)

	this.onVideotrack = function () {

		var tracks = this.video.videoTracks, select = this.html('.tracks.videotrack select'), lang = apijs.config.lang, auto = -1, idx;

		if (typeof tracks == 'object') {

			// si la vidéo contient plusieurs pistes vidéo
			// @see https://developer.mozilla.org/en-US/docs/Web/API/VideoTrack
			if (tracks.length > 1) {
				for (idx = 0; idx < tracks.length; idx++) {
					if (tracks[idx].language && (tracks[idx].language.toLowerCase().replace(/[-_]/g, '').indexOf(lang) == 0))
						auto = (auto < 0) ? idx : auto;
					select.appendChild(this.htmlOption(idx, tracks[idx]));
				}
				this.updateSelect('videotrack', tracks.length);
			}

			// sélectionne éventuellement la piste dans la bonne langue
			select.selectedIndex = Math.max(0, auto);
			if (auto >= 0)
				this.actionVideotrack(auto);
		}
	};

	this.onAudiotrack = function () {

		var tracks = this.video.audioTracks, select = this.html('.tracks.audiotrack select'), lang = apijs.config.lang, auto = -1, idx;

		if (typeof tracks == 'object') {

			// si la vidéo contient plusieurs pistes audio
			// @see https://developer.mozilla.org/en-US/docs/Web/API/AudioTrack
			if (tracks.length > 1) {
				for (idx = 0; idx < tracks.length; idx++) {
					if (tracks[idx].language && (tracks[idx].language.toLowerCase().replace(/[-_]/g, '').indexOf(lang) == 0))
						auto = (auto < 0) ? idx : auto;
					select.appendChild(this.htmlOption(idx, tracks[idx]));
				}
				this.updateSelect('audiotrack', tracks.length);
			}

			// sélectionne éventuellement la piste dans la bonne langue
			select.selectedIndex = Math.max(0, auto);
			if (auto >= 0)
				this.actionAudiotrack(auto);
		}
	};

	this.onTimeupdate = function (ev) {

		var time = this.video.currentTime, duration = this.video.duration, text = '--:--', hh, mm, ss;

		if (!isNaN(time) && (duration !== Infinity) && !isNaN(duration)) {

			hh = Math.floor(time / 3600);
			mm = Math.floor((time % 3600) / 60);
			ss = Math.floor(time % 60);
			if (ss < 10) ss = '0' + ss;
			if (mm < 10) mm = '0' + mm;

			hh = (hh > 0) ? hh + ':' : '';
			text = hh + mm + ':' + ss;

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

		// loader stalled sauf par les tracks
		if (this.stalled && !this.subload) {
			this.stalled = false;
			this.onWaiting(ev);
		}
	};

	this.onProgress = function () {

		var video = this.video, elem = this.html('svg.bar'), idx = video.buffered.length, width, buffer;

		if ((idx > 0) && (video.duration !== Infinity) && !isNaN(video.duration)) {

			elem.querySelectorAll('.buffer').forEach(function (node) { node.remove(); });
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

	this.onPlay = function () { // todo

		// NETWORK_IDLE, NETWORK_LOADING
		if ([1,2].has(this.video.networkState)) {

			if (this.video.paused) {
				this.html('span.play').textContent = '\uE810';
				// via un dialogue ou en direct
				if (apijs.dialog.t1)
					apijs.dialog.remove('playing');
				else
					this.video.parentNode.classList.remove('playing');
			}
			else {
				this.html('span.play').textContent = '\uE811';
				// via un dialogue ou en direct
				if (apijs.dialog.t1)
					apijs.dialog.add('playing');
				else
					this.video.parentNode.classList.add('playing');
			}
		}
	};

	this.onWaiting = function (ev) { // todo
		apijs.log('player:video:onWaiting:' + ev.type + '  stalled:' + this.stalled + '/subload:' + this.subload);
		apijs.dialog[['loadstart', 'waiting', 'seeking', 'stalled'].has(ev.type) ? 'add' : 'remove']('loading');
	};


	// GESTION DES INTERACTIONS (private return void)

	this.actionPlay = function () {

		var video = this.video;

		// ignore le clic du swipe en mode slideshow
		if (apijs.dialog.swipe)
			return false;

		// NETWORK_IDLE, NETWORK_LOADING
		if ([1,2].has(video.networkState)) {
			if (video.ended || video.paused)
				video.play();
			else
				video.pause();
		}
	};

	this.actionVolume = function (ev) {

		var video = this.video, elem = this.html('svg.vol'), width = elem.offsetWidth, value = 0;

		// NETWORK_IDLE, NETWORK_LOADING
		if ([1,2].has(video.networkState)) {

			if ((typeof ev == 'object') && !isNaN(ev.clientX)) {

				do { value += elem.offsetLeft; }
				while (elem = elem.offsetParent);

				value = ((ev.clientX - value) * 100 / width) / 100;
				value = (value < 0.2) ? 0 : ((value > 0.92) ? 1 : value);

				//if (self.getComputedStyle(this.html('svg.vol')).direction === 'rtl')
				//	value = 1 - value;

				video.volume = value;
				video.muted  = false;
			}

			this.html('svg.vol rect').style.width = video.muted ? 0 : (video.volume * 100) + '%';
		}
	};

	this.actionPosition = function (ev) {

		var video = this.video, elem = this.html('svg.bar'), width = elem.offsetWidth, value = 0;

		// NETWORK_IDLE, NETWORK_LOADING
		if (([1,2].has(video.networkState)) && (video.duration !== Infinity) && !isNaN(video.duration) && (typeof ev == 'object')) {

			do { value += elem.offsetLeft; }
			while (elem = elem.offsetParent);

			value = (video.duration * (ev.clientX - value) * 100 / width) / 100;
			value = (value <= 1) ? 0 : value;

			//if (self.getComputedStyle(this.html('svg.vol')).direction === 'rtl')
			//	value = video.duration - value;

			video.currentTime = value;
		}
	};

	this.actionVideotrack = function (ev) {

		var tracks = this.video.videoTracks, value = (typeof ev == 'object') ? ev.target.value : ev, idx;

		// NETWORK_IDLE, NETWORK_LOADING
		if ([1,2].has(this.video.networkState)) {

			for (idx = 0; idx < tracks.length; idx++)
				tracks[idx].enabled = (idx == value);

			video.currentTime -= 1;
		}

		if (typeof ev == 'object')
			ev.target.blur();
	};

	this.actionAudiotrack = function (ev) {

		var tracks = this.video.audioTracks, value = (typeof ev == 'object') ? ev.target.value : ev, idx;

		// NETWORK_IDLE, NETWORK_LOADING
		if ([1,2].has(this.video.networkState)) {

			for (idx = 0; idx < tracks.length; idx++)
				tracks[idx].enabled = (idx == value);

			video.currentTime -= 1;
		}

		if (typeof ev == 'object')
			ev.target.blur();
	};

	this.actionTexttrack = function (ev) {

		var tracks = this.video.textTracks, value = (typeof ev == 'object') ? ev.target.value : ev, idx;

		// NETWORK_IDLE, NETWORK_LOADING
		if ([1,2].has(this.video.networkState)) {

			for (idx = 0; idx < tracks.length; idx++)
				tracks[idx].mode = (idx == value) ? 'showing' : 'hidden';

			this.subload = true;
		}

		if (typeof ev == 'object')
			ev.target.blur();
	};

	this.actionVideo = function (ev) {

		this.html('svg.bar rect').style.width = '0';
		this.html('svg.bar').querySelectorAll('.buffer').forEach(function (node) { node.remove(); });
		this.html('span.play').textContent = '\uE810';

		this.updateSelect('videotrack', 0);
		this.updateSelect('audiotrack', 0);

		this.video.src = this.video.querySelectorAll('source')[(typeof ev == 'object') ? ev.target.value : ev].src;
		if (typeof ev == 'object')
			ev.target.blur();
	};

	this.actionFullscreen = function () {

		// en direct
		var res = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		this.video.parentNode.classList[res ? 'add' : 'remove']('fullscreen');
	},


	// GÉNÉRATION DES ÉLÉMENTS (private return domelement)

	this.htmlSvgPlayer = function () {

		var d, c, b, a = document.createElement('div');
		a.setAttribute('class', 'apijsplayer noplaying');

			b = document.createElement('span');
			b.setAttribute('class', 'btn play fnt');
			b.appendChild(document.createTextNode('\uE810'));
			b.onclick = this.actionPlay.bind(this);

		a.appendChild(b);

			b = document.createElement('span');
			b.setAttribute('class', 'svg bar');

				c = document.createElement('svg');
				c.setAttribute('class', 'bar');
				c.onclick = this.actionPosition.bind(this);

					d = document.createElement('rect');

				c.appendChild(d);

			b.appendChild(c);

		a.appendChild(b);

			b = document.createElement('span');
			b.setAttribute('class', 'time');
			b.appendChild(document.createTextNode('--:--'));

		a.appendChild(b);

			b = document.createElement('span');
			b.setAttribute('class', 'svg vol');

				c = document.createElement('svg');
				c.setAttribute('class', 'vol');
				c.onclick = this.actionVolume.bind(this);

					d = document.createElement('rect');

				c.appendChild(d);

			b.appendChild(c);

		a.appendChild(b);

			b = document.createElement('label');
			b.setAttribute('class', 'tracks audiotrack');
			b.setAttribute('style', 'display:none;');
			b.appendChild(apijs.i18n.translateNode(133));

				c = document.createElement('em');

			b.appendChild(c);

				c = document.createElement('select');
				c.setAttribute('lang', 'mul');
				c.onchange = this.actionAudiotrack.bind(this);

			b.appendChild(c);

		a.appendChild(b);

			b = document.createElement('label');
			b.setAttribute('class', 'tracks videotrack');
			b.setAttribute('style', 'display:none;');
			b.appendChild(apijs.i18n.translateNode(132));

				c = document.createElement('em');

			b.appendChild(c);

				c = document.createElement('select');
				c.setAttribute('lang', 'mul');
				c.onchange = this.actionVideotrack.bind(this);

			b.appendChild(c);

		a.appendChild(b);

			b = document.createElement('label');
			b.setAttribute('class', 'tracks video');
			b.setAttribute('style', 'display:none;');
			b.appendChild(apijs.i18n.translateNode(131));

				c = document.createElement('em');

			b.appendChild(c);

				c = document.createElement('select');
				c.setAttribute('lang', 'mul');
				c.onchange = this.actionVideo.bind(this);

			b.appendChild(c);

		a.appendChild(b);

			b = document.createElement('label');
			b.setAttribute('class', 'tracks texttrack');
			b.setAttribute('style', 'display:none;');
			b.appendChild(apijs.i18n.translateNode(134));

				c = document.createElement('em');

			b.appendChild(c);

				c = document.createElement('select');
				c.setAttribute('lang', 'mul');
				c.onchange = this.actionTexttrack.bind(this);

					d = document.createElement('option');
					d.appendChild(apijs.i18n.translateNode(135)); // off

				c.appendChild(d);

			b.appendChild(c);

		a.appendChild(b);

			b = document.createElement('span');
			b.setAttribute('class', 'btn full fnt');
			b.appendChild(document.createTextNode('\uE80F'));
			b.onclick = function () {
				// via un dialogue ou en direct
				if (apijs.dialog.t1) {
					apijs.requestFullscreen(apijs.dialog.t1);
				}
				else {
					if (document.webkitFullscreenEnabled)
						document.addEventListener('webkitfullscreenchange', this.actionFullscreen.bind(this));
					else if (document.fullscreenEnabled)
						document.addEventListener('fullscreenchange', this.actionFullscreen.bind(this));
					else if (document.mozFullScreenEnabled)
						document.addEventListener('mozfullscreenchange', this.actionFullscreen.bind(this));
					apijs.requestFullscreen(this.video.parentNode);
				}

			}.bind(this);

		a.appendChild(b);

		return a;
	};

	this.htmlTrack = function (data) { // todo

		var a = document.createElement('track');
		a.setAttribute('kind', data[1]);
		a.setAttribute('label', data[2]);
		a.setAttribute('srclang', data[3]);
		a.setAttribute('src', data[4]);

		a.onload = function (ev) {
			apijs.log('player:track:onload ' + ev.target.src.slice(ev.target.src.lastIndexOf('/') + 1));
			if (ev.target.track.mode === 'showing') {
				this.onWaiting(ev);
				this.subload = false;
			}
		}.bind(this);

		a.onerror = function (ev) {
			apijs.log('player:track:onerror ' + ev.target.src.slice(ev.target.src.lastIndexOf('/') + 1));
			if (ev.target.track.mode === 'showing') {
				this.onWaiting(ev);
				this.subload = false;
			}
		}.bind(this);

		return a;
	};

	this.htmlSource = function (url) {

		var a = document.createElement('source');
		a.setAttribute('src', url);
		a.onerror = apijs.dialog.onMediaLoad;

		return a;
	};

	this.htmlOption = function (idx, txt) {

		if (typeof txt == 'object')
			txt = (txt.label === '') ? txt.language.toLowerCase() : txt.language.toLowerCase() + ' - ' + txt.label;

		var a = document.createElement('option');
		a.setAttribute('value', idx);
		a.appendChild(document.createTextNode(txt));

		return a;
	};


	this.autoRun(video, url);
};