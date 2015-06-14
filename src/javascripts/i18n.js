/**
 * Created S/05/06/2010
 * Updated V/12/06/2015
 * Version 50
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

apijs.core.i18n = function () {

	this.data = [];

	// ici et ailleurs, remplacer ~ par @ et .
	// dernière version sur le document magique
	// https://docs.google.com/spreadsheets/d/1UUpKZ-YAAlcfvGHYwt6aUM9io390j0-fIL0vMRh1pW0/edit?usp=sharing

	// = de-DE (deutsch/Deutschland)
	// » Philip Junietz <info~label-park~com>
	this.data.de = {
		buttonOk: "Ok",
		buttonCancel: "Abbrechen",
		buttonConfirm: "Bestätigen",
		buttonClose: "Schließen",
		buttonPrev: "Zurück",
		buttonNext: "Weiter",
		buttonBrowse: "Datei wählen",

		userLeavePage: "Du bist dabei die Seite zu verlassen...",
		operationTooLong: "Diese Operation dauert zu lange? ",
		warningLostChange: "Achtung: Alle derzeitigen Änderungen werden nicht gespeichert!",
		reloadLink: "laden Sie diese Seite",
		operationInProgress: "Verarbeitung läuft...",
		uploadInProgress: "Upload Vorgang...",
		imageError404: "Fehler 404\nDie Datei nicht existiert.",
		videoError: "Leider kann das Video momentan nicht wiedergegeben werden. Es ist möglich, dass die Datei vorübergehend nicht verfügbar ist oder dass Dein Browser das Video Format nicht lesen kann.[br][br]Versuche das Video [a href='§' title='§' download='§']downzuloaden[/a].",

		ctrlSlideshowFirstLast: "anfang/ende",
		ctrlSlideshowNextPrev: "zurück/weiter",
		ctrlVideoPause: "wiedergabe/pause",
		ctrlVideoTime: "rückwärts/vorwärts",
		ctrlVideoSound: "leiser/lauter",
		ctrlVideoMute: "stumm",
		ctrlDialogFullscreen: "vollbild",
		ctrlDialogQuit: "beenden",
		ctrlKeyEnd: "Ende",
		ctrlKeyEsc: "Esc",

		uploadAllType: "Alle Dateien wurden akzeptiert.[br]Maximale Grösse: § MB.",
		uploadOneType: "Aakzeptiertes Dateiformat: §.[br]Maximale Grösse: § MB.",
		uploadMultiType: "Aakzeptierte Dateiformate: § und §.[br]Maximale Grösse: § MB.",
		uploadDecimal: ",",
		upload11: "§% - § KB/s - Noch § Minuten",
		upload12: "§% - § KB/s - Noch § Minute",
		upload13: "§% - § KB/s - Noch § Sekunden",
		upload14: "§% - § KB/s",
		upload21: "§% - bis § KB/s in § Minuten",
		upload22: "§% - bis § KB/s in § Minute",
		upload23: "§% - bis § KB/s in § Sekunden",
		upload24: "§% - bis § KB/s",

		uploadBadType: "Es ist nicht möglich die Datei zu senden weil das Dateiformat nicht unterstützt wird. Aktuelles Dateiformat: §.",
		uploadBadSize: "Es ist nicht möglich die Datei zu senden weil die Datei zu gross ist. Aktuelle Dateigrösse: § MB.",
		uploadEmpty: "Es ist nicht möglich die Datei zu senden weil die Datei keine Daten enthält.",
		uploadError0: "Es ist eun unerwarteter Fehler aufgetreten... Bitte versuchen Sie es noch einmal.",
		uploadError1: "Es ist ein Fehler beim Senden der Datei aufgetreten.[br][em]➩ Fehler §.[em]",
		uploadError2: "Es ist ein Fehler bei der Verarbeitung der Datei aufgetreten.[br][em]➩ §[/em]"
	};

	// = en-GB (english/United-Kingdom)
	// » Brian Legrand
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	this.data.en = {
		buttonOk: "Ok",
		buttonCancel: "Cancel",
		buttonConfirm: "Confirm",
		buttonClose: "Close",
		buttonPrev: "Previous",
		buttonNext: "Next",
		buttonBrowse: "Choose a file",

		userLeavePage: "You are about to leave...",
		operationTooLong: "This operation is too long? ",
		warningLostChange: "Warning: all changes in progress will be lost.",
		reloadLink: "Reload this page",
		operationInProgress: "Operation in progress...",
		uploadInProgress: "Upload in progress...",
		imageError404: "Error 404\nThe file does not exist.",
		videoError: "Unfortunately, it is not possible to play this video for now. Maybe the file is temporarily unavailable or your browser can't read the format of the video.[br][br]Try to [a href='§' title='§' download='§']download[/a] the video.",

		ctrlSlideshowFirstLast: "start/end",
		ctrlSlideshowNextPrev: "previous/next",
		ctrlVideoPause: "play/pause",
		ctrlVideoTime: "backward/forward",
		ctrlVideoSound: "decrease/increase the volume",
		ctrlVideoMute: "mute",
		ctrlDialogFullscreen: "full screen",
		ctrlDialogQuit: "quit",
		ctrlKeyEnd: "End",
		ctrlKeyEsc: "Escape",

		uploadAllType: "All files are accepted.[br]Maximum size: § MB.",
		uploadOneType: "Accepted file format: §.[br]Maximum size: § MB.",
		uploadMultiType: "Accepted file formats: § and §.[br]Maximum size: § MB.",
		uploadDecimal: ".",
		upload11: "§% - § KB/s - § minutes left",
		upload12: "§% - § KB/s - § minute left",
		upload13: "§% - § KB/s - § seconds left",
		upload14: "§% - § KB/s",
		upload21: "§% - at § KB/s in § minutes",
		upload22: "§% - at § KB/s in § minute",
		upload23: "§% - at § KB/s in § seconds",
		upload24: "§% - at § KB/s",

		uploadBadType: "It's impossible to send the file because the proposed file format isn't allowed. Proposed file format: §.",
		uploadBadSize: "It's impossible to send the file because the file size is too large. Proposed file size: § MB.",
		uploadEmpty: "It's impossible to send the file because the file is empty.",
		uploadError0: "It seems that a unlikely mistake just happened... Please try again.",
		uploadError1: "An error occurred while sending the file.[br][em]➩ Error §.[/em]",
		uploadError2: "An error occurred while processing the file.[br][em]➩ §[/em]"
	};

	// = es-ES (español/España)
	// » Paco Aguayo <francisco.aguayocanela~gmail~com>
	// » Hugo Baugé <info~label-park~com>
	this.data.es = {
		buttonOk: "Aceptar",
		buttonCancel: "Cancelar",
		buttonConfirm: "Confirmar",
		buttonClose: "Cerrar",
		buttonPrev: "Anterior",
		buttonNext: "Siguiente",
		buttonBrowse: "Eligir un fichero",

		userLeavePage: "Está a punto de quitar...",
		operationTooLong: "Esta operación toma demasiado tiempo? ",
		warningLostChange: "Atención: todos los cambios en curso se perderán.",
		reloadLink: "Recargar esta página",
		operationInProgress: "Operación en curso...",
		uploadInProgress: "Subida de datos en curso...",
		imageError404: "Error 404\nEl fichero no existe.",
		videoError: "Desgraciadamente, no se puede leer esta video por el momento. Se puede que el fichero no sea accesible o que su navegador no pueda leer el formato de la video.[br][br]Intente [a href='§' title='§' download='§']cargar[/a] la video.",

		ctrlSlideshowFirstLast: "inicio/fin",
		ctrlSlideshowNextPrev: "anterior/siguiente",
		ctrlVideoPause: "reproducir/pausa",
		ctrlVideoTime: "atrás/adelante",
		ctrlVideoSound: "bajar/subir el volumen",
		ctrlVideoMute: "silenciar",
		ctrlDialogFullscreen: "pantalla completa",
		ctrlDialogQuit: "salir",
		ctrlKeyEnd: "Fin",
		ctrlKeyEsc: "Esc",

		uploadAllType: "Se aceptan todos los archivos.[br]Tamaño máximo: § MB.",
		uploadOneType: "Formato de archivo aceptado: §.[br]Tamaño máximo: § MB.",
		uploadMultiType: "Formatos de archivos aceptados: § y §.[br]Tamaño máximo: § MB.",
		uploadDecimal: ".",
		upload11: "§% - § KB/s - § minutos restantes",
		upload12: "§% - § KB/s - § minuto restantes",
		upload13: "§% - § KB/s - § segundos restantes",
		upload14: "§% - § KB/s",
		upload21: "§% - a § KB/s en § minutos",
		upload22: "§% - a § KB/s en § minuto",
		upload23: "§% - a § KB/s en § segundos",
		upload24: "§% - a § KB/s",

		uploadBadType: "Fue imposible enviar el archivo porque no se permite el formato del archivo. El formato del archivo es: §.",
		uploadBadSize: "Fue imposible enviar el archivo porque el tamaño es demasiado elevado. El tamaño del archivo es: § MB.",
		uploadEmpty: "Fue imposible enviar el archivo porque el archivo está vacío.",
		uploadError0: "Parece que un error improbable acabo de pasar... Por favor, inténtelo de nuevo.",
		uploadError1: "Se produjo un error durante el envío del archivo.[br][em]➩ Error §.[/em]",
		uploadError2: "Se produjo un error durante el procesamiento del archivo.[br][em]➩ §[/em]"
	};

	// = fr-FR (français/France)
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	this.data.fr = {
		buttonOk: "Ok",
		buttonCancel: "Annuler",
		buttonConfirm: "Valider",
		buttonClose: "Fermer",
		buttonPrev: "Précédent",
		buttonNext: "Suivant",
		buttonBrowse: "Choisir un fichier",

		userLeavePage: "Vous vous apprêtez à partir...",
		operationTooLong: "Cette opération prend trop de temps ? ",
		warningLostChange: "Attention : toutes les modifications en cours seront perdues.",
		reloadLink: "Rechargez la page",
		operationInProgress: "Opération en cours...",
		uploadInProgress: "Envoi du fichier en cours...",
		imageError404: "Erreur 404\nLe fichier n'existe pas.",
		videoError: "Malheureusement, il n'est pas possible de lire cette vidéo pour le moment. Il se peut que le fichier soit temporairement inaccessible ou que votre navigateur ne puisse pas lire le format de la vidéo.[br][br]Essayez de [a href='§' title='§' download='§']télécharger[/a] la vidéo.",

		ctrlSlideshowFirstLast: "début/fin",
		ctrlSlideshowNextPrev: "précédent/suivant",
		ctrlVideoPause: "lecture/pause",
		ctrlVideoTime: "reculer/avancer",
		ctrlVideoSound: "baisser/augmenter le volume",
		ctrlVideoMute: "couper le son",
		ctrlDialogFullscreen: "plein écran",
		ctrlDialogQuit: "quitter",
		ctrlKeyEnd: "Fin",
		ctrlKeyEsc: "Échap",

		uploadAllType: "Tous les fichiers sont acceptés.[br]Taille maximale : § Mo.",
		uploadOneType: "Format de fichier accepté : §.[br]Taille maximale : § Mo.",
		uploadMultiType: "Formats de fichier acceptés : § et §.[br]Taille maximale : § Mo.",
		uploadDecimal: ",",
		upload11: "§% - § Ko/s - § minutes restantes",
		upload12: "§% - § Ko/s - § minute restante",
		upload13: "§% - § Ko/s - § secondes restantes",
		upload14: "§% - § Ko/s",
		upload21: "§% - à § Ko/s en § minutes",
		upload22: "§% - à § Ko/s en § minute",
		upload23: "§% - à § Ko/s en § secondes",
		upload24: "§% - à § Ko/s",

		uploadBadType: "Il est impossible d'envoyer le fichier car le format du fichier proposé n'est pas autorisé. Format du fichier proposé : §.",
		uploadBadSize: "Il est impossible d'envoyer le fichier car la taille du fichier proposé est trop importante. Taille du fichier proposé : § Mo.",
		uploadEmpty: "Il est impossible d'envoyer le fichier car le fichier est vide.",
		uploadError0: "Il semblerait qu'une erreur improbable vient de se produire... Veuillez réessayer.",
		uploadError1: "Une erreur est survenue lors de l'envoi du fichier.[br][em]➩ Erreur §.[/em]",
		uploadError2: "Une erreur est survenue lors du traitement du fichier.[br][em]➩ §[/em]"
	};

	// = ru-RU (russian/Russia)
	// » Eugene Parfenov (igro) <admin~mytona~com>
	this.data.ru = {
		buttonOk: "Ок",
		buttonCancel: "Отмена",
		buttonConfirm: "Подтвердить",
		buttonClose: "Закрыть",
		buttonPrev: "Предыдущий",
		buttonNext: "Следующий",
		buttonBrowse: "Выберите файл",

		userLeavePage: "Вы собираетесь покинуть...",
		operationTooLong: "Операция длится слишком долго? ",
		warningLostChange: "Внимание: все изменения будут потеряны.",
		reloadLink: "Обновить страницу",
		operationInProgress: "Операция в процессе...",
		uploadInProgress: "Загрузка в процессе...",
		imageError404: "Ошибка 404\nФайл не существует.",

		ctrlSlideshowFirstLast: "начало/конец",
		ctrlSlideshowNextPrev: "предыдущий/следующий",
		ctrlVideoPause: "воспроизведение/пауза",
		ctrlVideoTime: "назад/вперед",
		ctrlVideoSound: "понизить/повысить громкость",
		ctrlVideoMute: "отключить звук",
		ctrlDialogFullscreen: "на весь экран",
		ctrlDialogQuit: "выйти",
		ctrlKeyEnd: "End",
		ctrlKeyEsc: "Escape",

		uploadAllType: "Все файлы приняты.[br]Максимальный размер: § MB.",
		uploadOneType: "Формат файла: §.[br]Максимальный размер: § MB.",
		uploadMultiType: "Форматы файлов: § и §.[br]Максимальный размер: § MB.",
		uploadDecimal: ".",
		upload11: "§% - § KB/s - осталось § минут",
		upload12: "§% - § KB/s - осталось § минут",
		upload13: "§% - § KB/s - осталось § секунд",
		upload14: "§% - § KB/s",
		upload21: "§% - § KB/s за § минут",
		upload22: "§% - § KB/s за § минут",
		upload23: "§% - § KB/s за § секунд",
		upload24: "§% - § KB/s",

		uploadBadType: "Нельзя отправить файл потому что формат файла запрещен. Рекомендуемый формат файла: §.",
		uploadBadSize: "Нельзя отправить файл потому что размер файла слишком велик. Рекомендуемый размер файла: § MB.",
		uploadEmpty: "Нельзя отправить файл поскольку он пуст.",
		uploadError0: "Кажется произошла не предусмотренная ошибка... Попробуйте еще раз.",
		uploadError1: "Возникла ошибка при отправке файла.[br][em]➩ Ошибка §.[/em]",
		uploadError2: "Возникла ошибка при обработке файла.[br][em]➩ §[/em]"
	};


	// #### Auto-détection de la langue ############################################ private ### //
	// = révision : 17
	// » Essaye de récupérer la langue utilisée par la page web
	// » Prend soin de vérifier que la configuration de la langue est correcte
	this.init = function () {

		var autolang, html = document.querySelector('html');

		// langue automatique (auto, auto-fr...)
		if (apijs.config.lang.indexOf('auto') > -1) {

			// recherche du nœud html
			if (html.getAttribute('xml:lang'))
				autolang = html.getAttribute('xml:lang').slice(0, 2);
			else if (html.getAttribute('lang'))
				autolang = html.getAttribute('lang').slice(0, 2);

			// définition de la langue
			if ((typeof autolang === 'string') && this.data.hasOwnProperty(autolang))
				apijs.config.lang = autolang;
			else if (apijs.config.lang.indexOf('auto-') > -1)
				apijs.config.lang = apijs.config.lang.slice(5);
		}

		// langue par défaut
		if (!this.data.hasOwnProperty(apijs.config.lang))
			apijs.config.lang = 'en';
	};


	// #### Traduction par mot clef ################################################# public ### //
	// = révision : 29
	// » Vérifie si le mot clef existe dans les traductions
	// » Renvoie la chaîne de caractères correspondante à un mot clef
	// » Renvoie un nœud texte en plus de la traduction si besoin
	this.translate = function (word) {

		var lang = apijs.config.lang, i = 0, arg = 1, translation = '', data;

		// mot clef inexistant dans la langue configurée
		// test avec la langue par défaut pour éventuellement continuer
		if (typeof this.data[lang][word] !== 'string') {

			if ((lang !== 'en') && (typeof this.data.en[word] === 'string'))
				lang = 'en';
			else
				return word;
		}

		// chaîne de caractères configurable
		if (arguments.length > 1) {

			for (data = this.data[lang][word].split('§'); i < data.length; i++)
				translation += (arg < arguments.length) ? data[i] + arguments[arg++] : data[i];

			return translation;
		}

		// chaîne de caractères simple
		return this.data[lang][word];
	};

	this.nodeTranslate = function (word) {
		return document.createTextNode(this.translate(word));
	};


	// #### Changement de langue #################################################### public ### //
	// = révision : 6
	// » Vérifie si la langue demandée existe dans la liste des langues disponibles ou utilise la détection automatique
	// » Renvoie true si la langue a été modifiée et false dans le cas contraire
	this.changeLang = function (lang) {

		if (typeof lang === 'string') {

			if (this.data.hasOwnProperty(lang)) {
				apijs.config.lang = lang;
				return true;
			}
			if (lang.indexOf('auto') > -1) {
				apijs.config.lang = lang;
				this.init();
				return true;
			}
		}

		return false;
	};
};