/**
 * Created Me/18/08/2010
 * Updated L/23/08/2010
 * Version 1 (dev)
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

function BBcode() {

	this.id = null;

	// définition de l'attribut
	this.init = function (id, text) {
		this.id = id;
	};

	this.parse = function (text) {

		// Élément p
		var elem = document.createElement('p');

		// Nœud texte multi-lignes
		if (text.search(/[br]/) > 0) {

			text = text.split('[br]');
			elem.appendChild(document.createTextNode(text[0]));

			for (var i = 1; i < text.length; i++) {
				elem.appendChild(document.createElement('br'));
				elem.appendChild(document.createTextNode(text[i]));
			}
		}

		// Nœud texte mono-ligne
		else {
			elem.appendChild(document.createTextNode(text));
		}

		document.getElementById(this.id).appendChild(elem);
	};

	/*this.createTagText = function (tag, text) {
		var tag = document.createElement(tag);
		tag.appendChild(document.createTextNode(text));
		return tag;
	};

	this.result = '';
	this.regex = /\[\/?(p|a|br|strong|code|em|ins|pre)\]/ig;

	this.parse = function () {
		//var data = '[p]Azert [strong]qsdfgh[/strong] wxcvbn[/p][div]Azert [strong]qsdfgh[/strong] wxcvbn[/div]';
		//alert(this.decoupe('p', data));
	};

	this.decoupe = function (tag, data) {
		var regexA = new RegExp('\\[' + tag + '\\]');
		var regexB = new RegExp('\\[\\/' + tag + '\\]');
		var a = data.search(regexA);
		var b = data.search(regexB);
		return data.slice(a, b);
	};*/
}
