/**
 * Created D/11/01/2015
 * Updated J/11/06/2015
 * Version 3
 *
 * Copyright 2008-2015 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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

apijs.core.player = function () {

	this.media = null;
	this.player = null;


	// GESTION DU LECTEUR

	// #### Initialisation ######################################################### private ### //
	// = révision : 5
	// » Met en place les gestionnaires d'événements associés
	// » (onloadedmetadata/ontimeupdate/onseeking/onprogress/onpause/onended/onvolumechange)
	// » Sauvegarde un accès direct aux éléments clefs
	this.init = function (media, player) {

		this.media = media;
		this.player = player;

		this.media.removeAttribute('controls');

		this.media.onloadedmetadata = function () {
			apijs.dialog.actionResizeMedia();
			apijs.dialog.player.onTimeupdateSeeking();
			apijs.dialog.player.onProgress();
		}.bind(this);

		this.media.ontimeupdate   = apijs.dialog.player.onTimeupdateSeeking.bind(this);
		this.media.onseeking      = apijs.dialog.player.onTimeupdateSeeking.bind(this);
		this.media.onprogress     = apijs.dialog.player.onProgress.bind(this);
		this.media.onplay         = apijs.dialog.player.onPlayPause.bind(this);
		this.media.onpause        = apijs.dialog.player.onPlayPause.bind(this);
		this.media.onended        = apijs.dialog.player.onEnded.bind(this);
		this.media.onvolumechange = apijs.dialog.player.onVolumeChange.bind(this);

		// this.media.error n'est pas valable, voir http://stackoverflow.com/a/6154490
		this.media.addEventListener('error', apijs.dialog.player.onError.bind(this), true);
	};


	// #### Affiche les temps ############################################# event ## private ### // TODO
	// = révision : 6
	// » Affiche la position actuelle sur l'image SVG (SVG bar)
	// » Affiche également la position actuelle sous forme de seconde et le temps total
	// » Math.floor = entier inférieur, Math.ceil = entier supérieur, Math.round = au mieux
	// # event = onloadedmetadata + ontimeupdate + onseeking
	this.onTimeupdateSeeking = function () {

		var hours, mins, secs, time, currentTime, duration;

		time  = currentTime = this.media.currentTime;
		hours = Math.floor(time / 3600);
		mins  = Math.floor((time % 3600) / 60);
		secs  = Math.floor(time % 60);

		if (secs < 10)
			secs = '0' + secs;
		if (mins < 10)
			mins = '0' + mins;
		hours = (hours > 0) ? hours + ':' : '';

		this.player.querySelector('span.time').innerHTML = hours + mins + ':' + secs;

		if ((this.media.duration !== Infinity) && !isNaN(this.media.duration)) {

			time  = duration = this.media.duration;
			hours = Math.floor(time / 3600);
			mins  = Math.floor((time % 3600) / 60);
			secs  = Math.floor(time % 60);

			if (secs < 10)
				secs = '0' + secs;
			if (mins < 10)
				mins = '0' + mins;
			hours = (hours > 0) ? hours + ':' : '';
		}

		this.player.querySelector('span.time').innerHTML += ' / ' + hours + mins + ':' + secs;

		if (this.media.duration !== Infinity)
			this.player.querySelector('svg.bar rect').style.width = (currentTime / duration * 100) + '%';
	};


	// #### Affiche la mémoire tampon ##################################### event ## private ### // TODO
	// = révision : 5
	// » Affiche l'avancement du téléchargement de la vidéo (SVG bar)
	// » Utilise plusieurs rect pour l'affichage des différents morceaux en mémoire
	// # event = onloadedmetadata + onprogress
	this.onProgress = function () {

		var i, elem, left, width;

		if ((this.media.buffered.length > 0) && (this.media.duration > 0) && (this.media.duration !== Infinity)) {

			elem = this.player.querySelector('svg.bar');
			i = this.player.querySelectorAll('svg.bar rect.buffer').length;

			while (i-- > 0)
				elem.removeChild(elem.lastChild);

			i = this.media.buffered.length;

			while (i-- > 0) {

				left = (this.media.buffered.start(i) / this.media.duration) * 100;
				width = ((this.media.buffered.end(i) - this.media.buffered.start(i)) / this.media.duration) * 100;

				if (width >= 100) {
					left = 0; width = 100;
					this.media.removeAttribute('onprogress');
				}

				elem = document.createElement('rect');
				elem.setAttribute('class', 'buffer');
				elem.setAttribute('style', 'left:' + left + '%; width:' + width + '%;');

				this.player.querySelector('svg.bar').appendChild(elem);
			}
		}
	};


	// #### Affiche les contrôles de lecture ############################## event ## private ### //
	// = révision : 3
	// » Affiche le symbole lecture ou le symbole pause
	// » Éventuellement cache le grand symbole lecture
	// # event = onplay + onpause
	this.onPlayPause = function () {

		var elem = this.player.querySelector('span.play');
		elem.innerHTML = (this.media.paused) ? '▶' : '▮▮';

		elem = this.player.querySelector('span.run');
		if (!elem.hasAttribute('style'))
			elem.setAttribute('style', 'display:none;');
	};


	// #### Réaffiche les contrôles de lecture ############################ event ## private ### //
	// = révision : 3
	// » Affiche le symbole recommencer et affiche le grand symbole recommencer
	// # event = onended
	this.onEnded = function () {

		this.player.querySelector('span.run').removeAttribute('style');
		this.player.querySelector('span.run').innerHTML = '⟲';
		this.player.querySelector('span.play').innerHTML = '⟲';
	};


	// #### Écran d'erreur ######################################## event ## i18n ## private ### // TODO
	// = révision : 3
	// » Affiche en message d'erreur si la vidéo ne peut être lue
	// # event = onerror
	this.onError = function () {

		if (this.media.networkState === 3) {

			var elem = this.media.querySelector('source'), src = elem.getAttribute('src');

			this.player.setAttribute('class', 'player error');
			this.player.querySelector('span.run').innerHTML = apijs.i18n.translate(
				'videoError', src, src.substr(src.lastIndexOf('/') + 1), src.substr(src.lastIndexOf('/') + 1)
			).replace(/\[/g, '<').replace(/\]/g, '>');

			if (elem.hasAttribute('type'))
				this.player.querySelector('span.run a').setAttribute('type', elem.getAttribute('type'));
		}
	};


	// ACTIONS DES CONTRÔLES SVG

	// #### ? ############################################################# event ## private ### // TODO
	// = révision : 7
	// » Change le volume (SVG vol)
	// # event = onvolumechange + onclick-contrôle-svg
	this.actionVolumeVideo = this.onVolumeChange = function (ev) {

		var value, left = 0, media = apijs.dialog.media, elem = apijs.dialog.tBox.querySelector('svg.vol');

		if (media.networkState !== 3) {

			if ((typeof ev === 'object') && !isNaN(ev.clientX)) {

				value = elem.offsetWidth;

				do { left += elem.offsetLeft; }
				while ((elem = elem.offsetParent) !== null);

				value = (1 * (ev.clientX - left) * 100 / value) / 100;
				value = (value <= 0.1) ? 0 : ((value > 0.92) ? 1 : value);

				media.volume = value;

				if (media.muted)
					media.muted = false;
			}

			apijs.dialog.tBox.querySelector('svg.vol rect').style.width = (media.muted) ? 0 : (media.volume * 100) + '%';
		}
	};


	// #### ? ############################################################# event ## private ### // TODO
	// = révision : 7
	// » Change la position (SVG bar)
	// # event = onclick-contrôle-svg
	this.actionPositionVideo = function (ev) {

		var value, left = 0, media = apijs.dialog.media, elem = apijs.dialog.tBox.querySelector('svg.bar');

		if (media.networkState !== 3) {

			if ((typeof ev === 'object') && (media.duration !== Infinity)) {

				value = elem.offsetWidth;

				do { left += elem.offsetLeft; }
				while ((elem = elem.offsetParent) !== null);

				value = (media.duration * (ev.clientX - left) * 100 / value) / 100;
				value = (value <= 1) ? 0 : value;

				media.currentTime = value;
			}
		}
	};
};