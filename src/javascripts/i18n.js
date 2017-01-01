/**
 * Created S/05/06/2010
 * Updated D/18/12/2016
 *
 * Copyright 2008-2017 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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

	"use strict";
	this.data = {};

	// ici et ailleurs, dans les adresses emails, remplacer ~ par @ et .
	// dernière version des traductions sur le document magique
	// https://docs.google.com/spreadsheets/d/1UUpKZ-YAAlcfvGHYwt6aUM9io390j0-fIL0vMRh1pW0/edit?usp=sharing

	// = de-DE (deutsch/Deutschland) = 44/44
	// » Philip Junietz <info~label-park~com>
	// » Pamela Steinborn <st.pamela~laposte~net>
	this.data.de = {
		buttonOk: "Ok",
		buttonCancel: "Abbrechen",
		buttonConfirm: "Bestätigen",
		buttonClose: "Schließen",
		buttonPrev: "Zurück",
		buttonNext: "Weiter",
		buttonBrowse: "Datei wählen",
		operationTooLong: "Diese Operation dauert zu lange? ",
		warningLostChange: "Achtung: Alle derzeitigen Änderungen werden nicht gespeichert!",
		reloadLink: "laden Sie diese Seite",
		operationInProgress: "Verarbeitung läuft...",
		uploadInProgress: "Upload Vorgang...",
		uploadInEnding: "Datenverarbeitung im Vorgang...",
		imageError: "Leider kann das Bild momentan nicht angezeigt werden. Es ist möglich, dass die Datei vorübergehend nicht verfügbar ist.",
		videoError: "Leider kann das Video momentan nicht wiedergegeben werden. Es ist möglich, dass die Datei vorübergehend nicht verfügbar ist oder dass Dein Browser das Video Format nicht lesen kann.[br][br]Versuche das Video [a href='§' download='']downzuloaden[/a].",
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
		uploadAllType: "Alle Dateien wurden akzeptiert.[br]Maximale Größe: § MB.",
		uploadOneType: "Akzeptiertes Dateiformat: §.[br]Maximale Größe: § MB.",
		uploadMultiType: "Akzeptiertes Dateiformate: § und §.[br]Maximale Größe: § MB.",
		uploadDecimal: ",",
		upload11: "§% - § kB/s - Noch § Minuten",
		upload12: "§% - § kB/s - Noch § Minute",
		upload13: "§% - § kB/s - Noch § Sekunden",
		upload14: "§% - § kB/s",
		upload21: "§% - bis § kB/s in § Minuten",
		upload22: "§% - bis § kB/s in § Minute",
		upload23: "§% - bis § kB/s in § Sekunden",
		upload24: "§% - bis § kB/s",
		uploadBadType: "Es ist nicht möglich die Datei zu senden weil das Dateiformat nicht unterstützt wird. Aktuelles Dateiformat: §.",
		uploadBadSize: "Es ist nicht möglich die Datei zu senden weil die Datei zu gross ist. Aktuelle Dateigrösse: §\u00a0MB.",
		uploadEmpty: "Es ist nicht möglich die Datei zu senden weil die Datei keine Daten enthält.",
		uploadError0: "Es ist ein unerwarteter Fehler aufgetreten... Bitte versuchen Sie es noch einmal.",
		uploadError1: "Es ist ein Fehler beim Senden der Datei aufgetreten.[br][em]➩ Fehler §.[/em]",
		uploadError2: "Es ist ein Fehler bei der Verarbeitung der Datei aufgetreten.[br][em]➩ §[/em]",
		uploadRestart: "Wir laden Sie ein es erneut zu [a §]versuchen[/a]."
	};

	// = en-GB (english/United-Kingdom) = 44/44
	// » Brian Legrand
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	// » Pascale Scellier <scellier.pascale~orange~fr>
	this.data.en = {
		buttonOk: "Ok",
		buttonCancel: "Cancel",
		buttonConfirm: "Confirm",
		buttonClose: "Close",
		buttonPrev: "Previous",
		buttonNext: "Next",
		buttonBrowse: "Choose a file",
		operationTooLong: "This operation is too long? ",
		warningLostChange: "Warning: all changes in progress will be lost.",
		reloadLink: "Reload this page",
		operationInProgress: "Operation in progress...",
		uploadInProgress: "Upload in progress...",
		uploadInEnding: "Processing file in progress...",
		imageError: "Unfortunately, it is not possible to display this picture for now. Maybe the file is temporarily unavailable.",
		videoError: "Unfortunately, it is not possible to play this video for now. Maybe the file is temporarily unavailable or your browser can't read the format of the video.[br][br]Try to [a href='§' download='']download[/a] the video.",
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
		upload11: "§% - § kB/s - § minutes left",
		upload12: "§% - § kB/s - § minute left",
		upload13: "§% - § kB/s - § seconds left",
		upload14: "§% - § kB/s",
		upload21: "§% - at § kB/s in § minutes",
		upload22: "§% - at § kB/s in § minute",
		upload23: "§% - at § kB/s in § seconds",
		upload24: "§% - at § kB/s",
		uploadBadType: "It's impossible to send the file because the proposed file format isn't allowed. Proposed file format: §.",
		uploadBadSize: "It's impossible to send the file because the file size is too large. Proposed file size: §\u00a0MB.",
		uploadEmpty: "It's impossible to send the file because the file is empty.",
		uploadError0: "It seems that an unlikely mistake just happened... Please try again.",
		uploadError1: "An error occurred while sending the file.[br][em]➩ Error §.[/em]",
		uploadError2: "An error occurred while processing the file.[br][em]➩ §[/em]",
		uploadRestart: "We invite you to [a §]try again[/a]."
	};

	// = es-ES (español/España) = 44/44
	// » Paco Aguayo <francisco.aguayocanela~gmail~com>
	// » Hugo Baugé & Cédric Scaramuzza <info~label-park~com>
	// » Pascale Scellier <scellier.pascale~orange~fr>
	this.data.es = {
		buttonOk: "Aceptar",
		buttonCancel: "Cancelar",
		buttonConfirm: "Confirmar",
		buttonClose: "Cerrar",
		buttonPrev: "Anterior",
		buttonNext: "Siguiente",
		buttonBrowse: "Eligir un archivo",
		operationTooLong: "¿Esta operación toma demasiado tiempo? ",
		warningLostChange: "Atención: todos los cambios en curso se perderán.",
		reloadLink: "Recargar esta página",
		operationInProgress: "Operación en curso...",
		uploadInProgress: "Envío del archivo en progreso...",
		uploadInEnding: "Tratamiento del archivo en curso...",
		imageError: "Desgraciadamente, no se puede mostrar esta foto por el momento. Puede ser que el archivo sea temporalmente inaccesible.",
		videoError: "Desgraciadamente, no se puede leer éste video por el momento. Puede ser que el archivo sea temporalmente inaccesible o que su navegador no pueda leer el formato del video.[br][br]Intente [a href='§' download='']cargar[/a] la video.",
		ctrlSlideshowFirstLast: "inicio/fin",
		ctrlSlideshowNextPrev: "retroceder/avanzar",
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
		upload11: "§% - § kB/s - § minutos restantes",
		upload12: "§% - § kB/s - § minuto restantes",
		upload13: "§% - § kB/s - § segundos restantes",
		upload14: "§% - § kB/s",
		upload21: "§% - a § kB/s en § minutos",
		upload22: "§% - a § kB/s en § minuto",
		upload23: "§% - a § kB/s en § segundos",
		upload24: "§% - a § kB/s",
		uploadBadType: "Es imposible enviar el archivo porque el formato del archivo propuesto no es autorizado. Formato del archivo propuesto: §.",
		uploadBadSize: "Es imposible enviar el archivo porque el tamaño del archivo propuesto es demasiado elevado. Tamaño del archivo propuesto: §\u00a0MB.",
		uploadEmpty: "Es imposible enviar el archivo porque el archivo está vacío.",
		uploadError0: "Parece que un error improbable acabo de ocurrir... Por favor, inténtelo de nuevo.",
		uploadError1: "Se produjo un error durante el envío del archivo.[br][em]➩ Error §.[/em]",
		uploadError2: "Se produjo un error durante el procesamiento del archivo.[br][em]➩ §[/em]",
		uploadRestart: "Le invitamos a [a §]intenter de nuevo[/a]."
	};

	// = fr-FR (français/France) = 44/44
	// » Fabrice Creuzot (luigifab) <code~luigifab~info>
	// » Pascale Scellier <scellier.pascale~orange~fr>
	this.data.fr = {
		buttonOk: "Ok",
		buttonCancel: "Annuler",
		buttonConfirm: "Valider",
		buttonClose: "Fermer",
		buttonPrev: "Précédent",
		buttonNext: "Suivant",
		buttonBrowse: "Choisir un fichier",
		operationTooLong: "Cette opération prend trop de temps ? ",
		warningLostChange: "Attention : toutes les modifications en cours seront perdues.",
		reloadLink: "Rechargez la page",
		operationInProgress: "Opération en cours...",
		uploadInProgress: "Envoi du fichier en cours...",
		uploadInEnding: "Traitement du fichier en cours...",
		imageError: "Malheureusement, il n'est pas possible d'afficher cette photo pour le moment. Il se peut que le fichier soit temporairement inaccessible.",
		videoError: "Malheureusement, il n'est pas possible de lire cette vidéo pour le moment. Il se peut que le fichier soit temporairement inaccessible ou que votre navigateur ne puisse pas lire le format de la vidéo.[br][br]Essayez de [a href='§' download='']télécharger[/a] la vidéo.",
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
		upload11: "§% - § ko/s - § minutes restantes",
		upload12: "§% - § ko/s - § minute restante",
		upload13: "§% - § ko/s - § secondes restantes",
		upload14: "§% - § ko/s",
		upload21: "§% - à § ko/s en § minutes",
		upload22: "§% - à § ko/s en § minute",
		upload23: "§% - à § ko/s en § secondes",
		upload24: "§% - à § ko/s",
		uploadBadType: "Il est impossible d'envoyer le fichier car le format du fichier proposé n'est pas autorisé. Format du fichier proposé : §.",
		uploadBadSize: "Il est impossible d'envoyer le fichier car la taille du fichier proposé est trop importante. Taille du fichier proposé : §\u00a0Mo.",
		uploadEmpty: "Il est impossible d'envoyer le fichier car le fichier est vide.",
		uploadError0: "Il semblerait qu'une erreur improbable vienne de se produire... Veuillez réessayer.",
		uploadError1: "Une erreur est survenue lors de l'envoi du fichier.[br][em]➩ Erreur §.[/em]",
		uploadError2: "Une erreur est survenue lors du traitement du fichier.[br][em]➩ §[/em]",
		uploadRestart: "Nous vous invitons à [a §]réessayer[/a]."
	};

	// = it-IT (italiano/Italia) = 44/44
	// » Maria Grasso <mgrasso~outlook~fr>
	this.data.it = {
		buttonOk: "Ok",
		buttonCancel: "Annulla",
		buttonConfirm: "Conferma",
		buttonClose: "Chiudi",
		buttonPrev: "Precedente",
		buttonNext: "Successivo",
		buttonBrowse: "Scegli un file",
		operationTooLong: "Questa operazione prende troppo tempo? ",
		warningLostChange: "Attenzione: tutte le modifiche in corso saranno perdute.",
		reloadLink: "Ricaricare la pagina",
		operationInProgress: "Operazione in corso...",
		uploadInProgress: "Invio del file in corso...",
		uploadInEnding: "Trattamento del file in corso...",
		imageError: "Purtroppo, non é possibile visualizzare questa foto al momento. Il file potrebbe essere temporaneamente inaccessibile.",
		videoError: "Purtroppo, non é possibile leggere questo video al momento. Il file portebbe essere temporaneamente inaccessibile o che il vostro browser non possa leggere il formato.[br][br]Provate a [a href='§' download='']scaricare[/a] il video.",
		ctrlSlideshowFirstLast: "inizio/fine",
		ctrlSlideshowNextPrev: "precedente/successivo",
		ctrlVideoPause: "riproduci/pausa",
		ctrlVideoTime: "indietro/avanti",
		ctrlVideoSound: "abbassare/aumentare il volume",
		ctrlVideoMute: "muto",
		ctrlDialogFullscreen: "schermo intero",
		ctrlDialogQuit: "esci",
		ctrlKeyEnd: "Fine",
		ctrlKeyEsc: "Esc",
		uploadAllType: "Tutti i file sono accettati.[br]Dimensione massima: § MB.",
		uploadOneType: "Formato del file accettato: §.[br]Dimensione massima: § MB.",
		uploadMultiType: "Formati accettati: § et §.[br]Dimensione massima: § MB.",
		uploadDecimal: ",",
		upload11: "§% - § kB/s - § minuti rimanenti",
		upload12: "§% - § kB/s - § minuto rimanente",
		upload13: "§% - § kB/s - § secondi rimanenti",
		upload14: "§% - § kB/s",
		upload21: "§% - a § kB/s in § minuti",
		upload22: "§% - a § kB/s in § minuto",
		upload23: "§% - a § kB/s in § segundi",
		upload24: "§% - a § kB/s",
		uploadBadType: "Impossibile inviare il file, il formato proposto non é autorizzato. Formato proposto: §.",
		uploadBadSize: "Impossibile inviare, il file é troppo grande. Dimensione proposta: §\u00a0MB.",
		uploadEmpty: "Impossibile inviare, il file é vuoto.",
		uploadError0: "Sembrerebbe che un errore inaspettato si sia verificato... Riprova.",
		uploadError1: "Un errore si é verificato durante l'invio del file.[br][em]➩ Errore §.[/em]",
		uploadError2: "Un errore si é verificato durante il trattamento del file.[br][em]➩ §[/em]",
		uploadRestart: "Vi invitiamo a [a §]riprovare[/a]."
	};

	// = pt-PT (português/Portugal) = 44/44
	// » Greg Lacan <greg.lacan~label-park~com>
	// » Isabel Mendes <isabel.2012~orange~fr>
	this.data.pt = {
		buttonOk: "Ok",
		buttonCancel: "Cancelar",
		buttonConfirm: "Confirmar",
		buttonClose: "Fechar",
		buttonPrev: "Anterior",
		buttonNext: "Seguinte",
		buttonBrowse: "Escolher um ficheiro",
		userLeavePage: "Está prestes a sair...",
		operationTooLong: "Esta operação é muito demorada? ",
		warningLostChange: "Atenção: todas as alterações em curso serão perdidas.",
		reloadLink: "Recarregar esta página",
		operationInProgress: "Operação em curso...",
		uploadInProgress: "Envio do ficheiro em curso...",
		uploadInEnding: "Tratamento do ficheiro em curso...",
		imageError: "Infelizmente, não é possível visualizar esta imagem agora. Talvez o ficheiro esteja temporariamente indisponível.",
		videoError: "Infelizmente, não é possível visualizar este vídeo agora. Talvez o ficheiro esteja temporariamente indisponível ou o seu navegador não consiga ler o formato do vídeo.[br][br]Tente [a href='§' download='']descarregar[/a] o vídeo.",
		ctrlSlideshowFirstLast: "início/fim",
		ctrlSlideshowNextPrev: "anterior/seguinte",
		ctrlVideoPause: "reprodução/pausa",
		ctrlVideoTime: "recuar/avançar",
		ctrlVideoSound: "subir/baixar o volume",
		ctrlVideoMute: "silenciar",
		ctrlDialogFullscreen: "ecrã completo",
		ctrlDialogQuit: "sair",
		ctrlKeyEnd: "Fim",
		ctrlKeyEsc: "Esc",
		uploadAllType: "Todos os ficheiros foram aceites.[br]Tamanho máximo: § MB.",
		uploadOneType: "Formato do ficheiro aceite: §.[br]Tamanho máximo: § MB.",
		uploadMultiType: "Formatos de ficheiro aceites: § e §.[br]Tamanho máximo: § MB.",
		uploadDecimal: ",",
		upload11: "§% - § kB/s - § minutos restantes",
		upload12: "§% - § kB/s - § minuto restantes",
		upload13: "§% - § kB/s - § segundos restantes",
		upload14: "§% - § kB/s",
		upload21: "§% - § kB/s em § minutos",
		upload22: "§% - § kB/s em § minuto",
		upload23: "§% - § kB/s em § segundos",
		upload24: "§% - § kB/s",
		uploadBadType: "É impossível enviar o ficheiro porque o formato não é permitido. Formato do ficheiro proposto: §.",
		uploadBadSize: "É impossível enviar o ficheiro porque o tamanho do ficheiro é demasiado grande. Tamanho do ficheiro proposto: §\u00a0MB.",
		uploadEmpty: "É impossível enviar o ficheiro porque o ficheiro está vazio.",
		uploadError0: "Parece ter acontecido um erro imprevisto. Por favor, tente novamente.",
		uploadError1: "Ocorreu um erro ao enviar o ficheiro.[br][em]➩ Erro §.[/em]",
		uploadError2: "Ocorreu um erro ao processar o ficheiro.[br][em]➩ §[/em]",
		uploadRestart: "Convidamo-lo a [a §]tentar novamente[/a]."
	};

	// = ru-RU (russian/Russia) = 40/44
	// » Eugene Parfenov (igro) <admin~mytona~com>
	this.data.ru = {
		buttonOk: "Ок",
		buttonCancel: "Отмена",
		buttonConfirm: "Подтвердить",
		buttonClose: "Закрыть",
		buttonPrev: "Предыдущий",
		buttonNext: "Следующий",
		buttonBrowse: "Выберите файл",
		operationTooLong: "Операция длится слишком долго? ",
		warningLostChange: "Внимание: все изменения будут потеряны.",
		reloadLink: "Обновить страницу",
		operationInProgress: "Операция в процессе...",
		uploadInProgress: "Загрузка в процессе...",
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
		uploadDecimal: ",",
		upload11: "§% - § kB/s - осталось § минут",
		upload12: "§% - § kB/s - осталось § минут",
		upload13: "§% - § kB/s - осталось § секунд",
		upload14: "§% - § kB/s",
		upload21: "§% - § kB/s за § минут",
		upload22: "§% - § kB/s за § минут",
		upload23: "§% - § kB/s за § секунд",
		upload24: "§% - § kB/s",
		uploadBadType: "Нельзя отправить файл потому что формат файла запрещен. Рекомендуемый формат файла: §.",
		uploadBadSize: "Нельзя отправить файл потому что размер файла слишком велик. Рекомендуемый размер файла: §\u00a0MB.",
		uploadEmpty: "Нельзя отправить файл поскольку он пуст.",
		uploadError0: "Кажется произошла не предусмотренная ошибка... Попробуйте еще раз.",
		uploadError1: "Возникла ошибка при отправке файла.[br][em]➩ Ошибка §.[/em]",
		uploadError2: "Возникла ошибка при обработке файла.[br][em]➩ §[/em]"
	};


	// #### Auto-détection de la langue ############################################ private ### //
	// = révision : 18
	// » Essaye de récupérer la langue utilisée par la page web
	// » Prend soin de vérifier que la configuration de la langue est correcte
	this.init = function () {

		var autolang, lang = apijs.config.lang, html = document.querySelector('html');

		// langue automatique (auto, auto-fr...)
		if (lang.indexOf('auto') > -1) {

			// recherche du nœud html
			if (html.getAttribute('xml:lang'))
				autolang = html.getAttribute('xml:lang').slice(0, 2);
			else if (html.getAttribute('lang'))
				autolang = html.getAttribute('lang').slice(0, 2);

			// définition de la langue
			if ((typeof autolang === 'string') && this.data.hasOwnProperty(autolang))
				apijs.config.lang = autolang;
			else if (lang.indexOf('auto-') > -1)
				apijs.config.lang = lang.slice(5);
		}

		// langue par défaut
		if (!this.data.hasOwnProperty(apijs.config.lang))
			apijs.config.lang = 'en';
	};


	// #### Traduction par mot clef ################################################# public ### //
	// = révision : 30
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