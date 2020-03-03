/**
 * Created D/11/01/2015
 * Updated S/29/02/2020
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

	this.init = function (root, video, url) { // todo

		this.root  = root;
		this.video = video;

		video.removeAttribute('controls');
		video.onloadedmetadata = function () {
			this.onTimeupdate();
			this.onProgress();
		}.bind(this);

		// active les événements
		video.onprogress     = apijs.player.onProgress.bind(this);
		video.onplay         = apijs.player.onPlay.bind(this);
		video.onpause        = apijs.player.onPlay.bind(this);
		video.onended        = apijs.player.onEnded.bind(this);
		video.onseeking      = apijs.player.onTimeupdate.bind(this);
		video.ontimeupdate   = apijs.player.onTimeupdate.bind(this);
		video.onvolumechange = apijs.player.actionVolume.bind(this);

		// charge les sources
		if (url.indexOf('m3u') > 0) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					self.dispatchEvent(new CustomEvent('apijsajaxresponse', { detail: { from: 'apijs.player.init', xhr: xhr } }));
					if ([0, 200].has(xhr.status))
						apijs.player.createTags(xhr.responseText.split("\n"));
					else
						apijs.dialog.onMediaLoad({ type: 'error' });
				}
			};
			xhr.send(null);
		}
		else {
			this.createTags([url]);
		}
	};


	// GÉNÉRATION DES ÉLÉMENTS (private return domelement|void)

	this.html = function (selector) {
		return this.root.querySelector(selector);
	};

	this.createTags = function (data) { // todo

		var txt, elem, t = 0, v = 0, a = 1;
		if (this.video.querySelector('source'))
			return;

		data.forEach(function (url) {

			// #APIJS#attr|name|value
			if (url.indexOf('#APIJS#attr') === 0) {
				txt = url.split('|');
				this.video.setAttribute(txt[1], txt[2]);
			}
			// #APIJS#track|kind|label|srclang|src
			else if (url.indexOf('#APIJS#track') === 0) {
				t++;
				txt = url.split('|');
				// li
				elem = document.createElement('option');
				elem.appendChild(document.createTextNode(txt[3].trim() + ' - ' + txt[2].trim()));
				this.root.querySelector('.tracks.text select').appendChild(elem);
				// track
				elem = document.createElement('track');
				elem.setAttribute('kind', txt[1]);
				elem.setAttribute('label', txt[2].trim());
				elem.setAttribute('srclang', txt[3].trim());
				elem.setAttribute('src', txt[4].trim());
				this.video.appendChild(elem);
			}
			// #EXTINF: Text
			else if (url.indexOf('#EXTINF') === 0) {
				txt = url.trim().replace(/#EXTINF:[0-9]+,/, '');
			}
			// http...
			else if ((url.length > 5) && (url[0] !== '#')) {
				v++;
				// li
				elem = document.createElement('option');
				elem.appendChild(document.createTextNode(txt));
				this.root.querySelector('.tracks.video select').appendChild(elem);
				// source
				elem = document.createElement('source');
				elem.setAttribute('src', url.trim());
				elem.onerror = apijs.dialog.onMediaLoad;
				this.video.appendChild(elem);
			}

		}, this); // pour que ci-dessus this = this

		if (a > 1) {
			//this.root.querySelector('.tracks.audio').removeAttribute('style');
			this.root.querySelector('.tracks.audio em').textContent = ' (' + a + ')';
			this.root.querySelector('.tracks.audio select').setAttribute('size', (a < 10) ? a : 10);
			this.root.querySelector('.tracks.audio option').setAttribute('class', 'active');
		}
		if (v > 1) {
			this.root.querySelector('.tracks.video').removeAttribute('style');
			this.root.querySelector('.tracks.video em').textContent = ' (' + v + ')';
			this.root.querySelector('.tracks.video select').setAttribute('size', (v < 10) ? v : 10);
			this.root.querySelector('.tracks.video option').setAttribute('class', 'active');
		}
		if (t > 0) {
			this.root.querySelector('.tracks.text').removeAttribute('style');
			this.root.querySelector('.tracks.text em').textContent = ' (' + t + ')';
			this.root.querySelector('.tracks.text select').setAttribute('size', (t < 10) ? t : 10);
		}

		this.video.ondurationchange = apijs.dialog.onMediaLoad;
		this.video.onerror = apijs.dialog.onMediaLoad;
	};


	// GESTION DES INTERACTIONS (private return void)

	this.onTimeupdate = function () {

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
	};

	this.onProgress = function () { // todo

		var elem = this.html('svg.bar'), video = this.video, idx = video.buffered.length, buffer, width;

		if ((idx > 0) && (video.duration !== Infinity)) {

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

	this.onPlay = function () { // todo

		if (this.video.paused) {
			this.html('span.play').textContent = '▶';
			apijs.dialog.remove('playing');
		}
		else {
			this.html('span.play').textContent = '▮▮';
			apijs.dialog.add('playing');
		}
	};

	this.onEnded = function () {
		this.html('span.play').textContent = '⟲';
	};

	this.actionVolume = function (ev) {

		var elem = this.html('svg.vol'), width = elem.offsetWidth, value = 0, video = this.video;

		if (video.networkState !== 3) {

			if ((typeof ev === 'object') && !isNaN(ev.clientX)) {

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

		if ((video.networkState !== 3) && (typeof ev === 'object') && (video.duration !== Infinity)) {

			do { value += elem.offsetLeft; }
			while (elem = elem.offsetParent);

			value = (video.duration * (ev.clientX - value) * 100 / width) / 100;
			value = (value <= 1) ? 0 : value;

			//if (self.getComputedStyle(this.html('svg.vol')).direction === 'rtl')
			//	value = video.duration - value;

			video.currentTime = value;
		}
	};

	this.actionAudio = function () { // todo

	};

	this.actionVideo = function (elem) {

		elem.childNodes.forEach(function (node) { node.removeAttribute('class'); });
		elem.childNodes[elem.selectedIndex].setAttribute('class', 'active');
		elem.blur();

		this.html('svg.bar rect').style.width = '0';
		this.html('svg.bar').querySelectorAll('.buffer').forEach(function (node) { node.parentNode.removeChild(node); });
		this.html('span.play').textContent = '▶';

		this.video.src = this.video.querySelectorAll('source')[elem.selectedIndex].src;
	};

	this.actionText = function (elem) {

		elem.childNodes.forEach(function (node) { node.removeAttribute('class'); });
		elem.childNodes[elem.selectedIndex].setAttribute('class', 'active');
		elem.blur();

		for (var idx = 0; idx < this.video.textTracks.length; idx++)
			this.video.textTracks[idx].mode = (idx === (elem.selectedIndex - 1)) ? 'showing' : 'hidden';
	};
};