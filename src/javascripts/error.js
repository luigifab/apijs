"use strict";
/**
 * Created D/16/06/2013
 * Updated D/13/10/2013
 * Version 5
 *
 * Copyright 2008-2014 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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

apijs.core.error = function (method, title, data) {

	var key, text = [];

	if (typeof data === 'string') {
		text.push(data);
	}
	else {
		for (key in data) if (data.hasOwnProperty(key))
			text.push(key + ' : ' + data[key]);
	}

	if (apijs.config.debug)
		apijs.dialog.dialogInformation(apijs.i18n.translate(title), '[pre]' + method + '[br]➩ ' + text.join('[br]➩ '), 'debug');

	throw new Error(method + ', ' + text.join(' / '));
};