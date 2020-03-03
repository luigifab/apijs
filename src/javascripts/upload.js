/**
 * Created L/13/04/2009
 * Updated J/06/02/2020
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

apijs.core.upload = function () {

	"use strict";
	this.title    = null;
	this.action   = null;
	this.input    = null;
	this.onemax   = 0; // taille d'un seul fichier
	this.allmax   = 0; // taille de tous les fichiers
	this.exts     = null;
	this.callback = null;
	this.args     = null;
	this.icon     = null;

	this.files = [];
	this.start = 0; // time
	this.end   = 0; // time


	// AFFICHAGE DE LA BOÎTE DE DIALOGUE (public return boolean)

	this.sendFile = function (title, action, input, onemax, exts, callback, args, icon) {

		var res = this.sendFiles(title, action, input, onemax, 0, exts, callback, args, icon);
		if (!res) console.error('apijs.upload.sendFile invalid arguments', apijs.toArray(arguments));

		return res;
	};

	this.sendFiles = function (title, action, input, onemax, allmax, exts, callback, args, icon) {

		this.files = [];
		if (title !== true) {
			this.title    = title;
			this.action   = action;
			this.input    = input;
			this.onemax   = onemax;
			this.allmax   = allmax;
			this.exts     = (typeof exts == 'string') ? exts.split(',') : ['*'];
			this.callback = callback;
			this.args     = args;
			this.icon     = icon;
		}

		if ((typeof this.title == 'string') && (typeof this.action == 'string') && (typeof this.input == 'string') &&
		    (typeof this.onemax == 'number') && (typeof this.allmax == 'number') && (typeof this.callback == 'function')) {

			var text, multiple = this.allmax > 0;

			if (this.exts[0] === '*')
				text = apijs.i18n.translate(161);
			else if (this.exts.length === 1)
				text = apijs.i18n.translate(162, this.exts[0]);
			else
				text = apijs.i18n.translate(163, this.exts.slice(0, -1).join(', '), this.exts.slice(-1));

			text += '[br]' + apijs.i18n.translate(
				multiple ? 165 : 164, // clef de traduction
				apijs.formatNumber(this.onemax), // taille d'un fichier
				multiple ? apijs.formatNumber(this.allmax) : '' // taille de tous les fichiers
			).replace('|', '[br]');

			return apijs.dialog.dialogFormUpload(this.title, text, this.action, this.input, multiple, this.icon);
		}

		if ((typeof this.allmax != 'number') || (this.allmax > 0))
			console.error('apijs.upload.sendFiles invalid arguments', apijs.toArray(arguments));

		return false;
	};


	// GESTION DES INTERACTIONS (private)

	this.actionChoose = function (elem) {

		var html = [], size = 0, text;
		this.files = [];

		if (this.exts) {

			// 1048576 octet = 1 Mo
			Array.prototype.forEach.call(elem.files, function (file) {

				text = file.name + ' <span class="sz">' + apijs.i18n.translate(166, apijs.formatNumber(file.size / 1048576)) + '</span>';

				if ((this.exts[0] !== '*') && !this.exts.has(file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()))
					text += ' <span class="ee">' + apijs.i18n.translate(167) + '</span>';
				else if (file.size > (this.onemax * 1048576))
					text += ' <span class="ee">' + apijs.i18n.translate(168) + '</span>';
				else if (file.size <= 0)
					text += ' <span class="ee">' + apijs.i18n.translate(169) + '</span>';
				else
					this.files.push(file);

				html.push('<div>' + text + '</div>');
				size += file.size / 1048576;

			}, this); // pour que ci-dessus this = this

			// multiple
			if ((this.allmax > 0) && (size >= this.allmax)) {
				html.push('<div class="tt"> = <span class="sz">' + apijs.i18n.translate(166, apijs.formatNumber(size)) + '</span> <span class="ee">' + apijs.i18n.translate(168) + '</span></div>');
			}

			// ok ou ko
			if (this.files.length === elem.files.length) {
				apijs.html('button.confirm').removeAttribute('disabled');
				apijs.html('button.confirm').focus();
			}
			else {
				apijs.html('button.confirm').setAttribute('disabled', 'disabled');
			}

			apijs.html('div.filenames').innerHTML = html.join(' ');
		}
	};

	this.actionConfirm = function () {

		if (this.files.length > 0) {

			var name = this.input, form = new FormData(), xhr = new XMLHttpRequest();
			xhr.open('POST', this.action + ((this.action.indexOf('?') > 0) ? '&isAjax=true' : '?isAjax=true'), true);

			// token
			if (typeof apijs.config.upload.tokenValue == 'string') {
				xhr.setRequestHeader(apijs.config.upload.tokenName, apijs.config.upload.tokenValue);
				form.append(apijs.config.upload.tokenName, apijs.config.upload.tokenValue);
			}

			// fichier(s)
			this.files.forEach(function (file, idx, files) {
				if ((files.length > 1) && (name.indexOf('[') < 0))
					form.append(name + '_' + idx, file);
				else
					form.append(name, file);
			});

			// https://bugzilla.mozilla.org/show_bug.cgi?id=637002
			// https://stackoverflow.com/a/15491086
			// 'loadstart' When the request starts
			//  'progress' While sending and loading data
			//      'load' When the request has successfully completed even if the server hasn't responded that it finished
			//   'loadend' When the request has completed even if the server hasn't responded that it finished processing the request
			//     'error' When the request has failed
			//     'abort' When the request has been aborted (by invoking the abort method)
			//   'timeout' When the author specified timeout has passed before the request could complete
			xhr.onreadystatechange = function () {

				if (xhr.readyState === 4) {
					if ([0, 200].has(xhr.status)) {
						self.dispatchEvent(new CustomEvent('apijsajaxresponse', { detail: { from: 'apijs.upload.send', xhr: xhr } }));
						var text = xhr.responseText.trim();
						apijs.log('upload:onreadystatechange status:200 message:' + text);
						if (text.indexOf('success-') === 0) {
							apijs.upload.updateTitle();
							apijs.upload.callback(text.slice(8), apijs.upload.args);
						}
						else {
							apijs.upload.onError(195, text);
						}
					}
					else {
						apijs.log('upload:onreadystatechange status:' + xhr.status + ' message: ' + xhr.responseText);
						apijs.upload.onError(194, xhr.status);
					}
				}
			};

			xhr.upload.onloadstart = apijs.upload.onStart.bind(this);
			xhr.upload.onprogress  = apijs.upload.onProgress.bind(this);
			xhr.upload.onload      = apijs.upload.onProgress.bind(this);
			xhr.upload.onerror     = apijs.upload.onError.bind(this);
			xhr.send(form);
		}
		else {
			apijs.html('button.browse').focus();
		}

		return false; // très important
	};

	this.onStart = function () {

		this.start = this.end = Math.round(new Date().getTime() / 1000);
		apijs.dialog.dialogProgress(this.title, apijs.i18n.translate(125), this.icon);
	};

	this.onError = function (key, txt) {

		this.updateTitle();

		if (typeof key == 'number')
			txt = '[p]' + apijs.i18n.translate(key) + '[/p] ' + txt;
		else if (typeof txt != 'string')
			txt = '[p]' + apijs.i18n.translate(193) + '[/p]';

		txt += '[p]' + apijs.i18n.translate(196, 'href="apijs://restart" onclick="apijs.upload.sendFile(true); return false;"') + '[/p]';
		apijs.dialog.dialogInformation(this.title, txt, (typeof this.icon == 'string') ? 'upload error ' + this.icon : 'upload error');
	};

	this.onProgress = function (ev) {

		var percent, key, rate, time, elapsedTime, totalTime, currentTime = Math.round(new Date().getTime() / 1000), mins;

		// Cherche à actualiser la barre de progression toutes les 2 secondes (uniquement de 1 à 99%)
		// affiche le pourcentage, la vitesse à partir de 25 secondes, le temps restant à partir de 40 secondes ET 90 secondes de temps total
		if (ev.lengthComputable && (ev.type === 'progress') && (currentTime >= (this.end + 2))) {

			this.end = currentTime;

			// Math.floor = entier inférieur, Math.ceil = entier supérieur, Math.round = au mieux
			// ev.loaded = nombre d'octet envoyé sur le serveur
			// ev.total  = nombre d'octet à envoyer sur le serveur
			// pourcentage = nombre d'octet envoyé * 100 / nombre d'octet à envoyer
			percent = Math.floor((ev.loaded * 100) / ev.total);

			if ((percent > 0) && (percent < 100)) {

				this.updateTitle(percent);

				// temps écoulé = maintenant - départ
				// temps total  = temps écoulé * 100 / pourcentage + 10 secondes
				elapsedTime = currentTime - this.start;
				totalTime   = elapsedTime * 100 / percent + 10;

				if (elapsedTime > 24) {

					// temps restant = temps total - temps écoulé
					time = Math.round(totalTime - elapsedTime);
					time = Math.ceil(time / 10) * 10;
					mins = Math.ceil(time / 60);

					// vitesse = taille téléchargé / temps écoulé / 1024
					rate = Math.round(ev.loaded / elapsedTime / 1024);

					if ((elapsedTime < 40) || (totalTime < 90)) { key = 184; time = null; } // "§% - § ko/s"
					else if (mins > 1)  { key = 181; time = mins; } // "§% - § ko/s - § minutes restantes"
					else if (time > 50) { key = 182; time = 1; }    // "§% - § ko/s - § minute restante"
					else                { key = 183; }              // "§% - § ko/s - § secondes restantes"
				}

				this.updateProgress(percent, key, rate, time);
			}
		}
		// Cherche à actualiser la barre de progression lorsque l'envoi du fichier est terminé (donc à 100%)
		// affiche le pourcentage, le temps total à partir de 20 secondes, la vitesse si possible
		else if (ev.type === 'load') {

			// temps total = temps actuel - temps du départ
			time = Math.round(new Date().getTime() / 1000) - this.start;
			mins = Math.ceil(time / 60);

			// vitesse = taille total / temps total / 1024
			rate = Math.round(ev.loaded / time / 1024);

			if ((rate > 0) && (rate !== Infinity)) {
				if      (mins > 1)  { key = 185; time = mins; } // "§% - à § ko/s en § minutes"
				else if (time > 50) { key = 186; time = 1; }    // "§% - à § ko/s en § minute"
				else if (time > 20) { key = 187; }              // "§% - à § ko/s en § secondes"
				else                { key = 188; time = null; } // "§% - à § ko/s"
			}
			else {
				rate = null; time = null; // 100%
			}

			this.updateTitle(100);
			this.updateProgress(100, key, rate, time);
		}
	};

	this.updateProgress = function (percent, key, rate, time) {

		var rect = apijs.html('rect'), text = apijs.html('span.info'), data;

		if (percent > 99) {
			data = '100%';
			rect.setAttribute('class', 'end');
			rect.style.width = '';
			apijs.html('p').textContent = apijs.i18n.translate(126);
		}
		else {
			rect.style.width = data = percent + '%';
			if (rect.hasAttribute('class'))
				rect.removeAttribute('class');
		}

		if ((typeof key == 'number') && (typeof rate == 'number') && (typeof time == 'number'))
			data = apijs.i18n.translate(key, percent, apijs.formatNumber(rate, false), time);
		else if ((typeof key == 'number') && (typeof rate == 'number'))
			data = apijs.i18n.translate(key, percent, apijs.formatNumber(rate, false));

		text.textContent = data;
	};

	this.updateTitle = function (percent) {

		if (typeof percent == 'number') {
			document.title = (/^\d{1,3}% - /.test(document.title)) ?
				percent + '% - ' + document.title.slice(document.title.indexOf(' - ') + 3) : percent + '% - ' + document.title;
		}
		else if (/^\d{1,3}% - /.test(document.title)) {
			document.title = document.title.slice(document.title.indexOf(' - ') + 3);
		}
	};
};