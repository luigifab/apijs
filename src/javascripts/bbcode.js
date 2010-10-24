/**
 * Created J/19/08/2010
 * Updated D/24/08/2010
 * Version 0
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
	this.init = function (id) {
		this.id = id;
	};
	this.parse = function (text) {
		var elem = document.createElement('p');
		if (text.search(/[br]/) > 0) {
			text = text.split('[br]');
			elem.appendChild(document.createTextNode(text[0]));
			for (var i = 1; i < text.length; i++) {
				elem.appendChild(document.createElement('br'));
				elem.appendChild(document.createTextNode(text[i]));
			}
		}
		else {
			elem.appendChild(document.createTextNode(text));
		}
		document.getElementById(this.id).appendChild(elem);
	};
}
