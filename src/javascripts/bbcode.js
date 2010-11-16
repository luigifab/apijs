/**
 * Created J/19/08/2010
 * Updated L/15/11/2010
 * Version 3
 *
 * Copyright 2008-2010 | Fabrice Creuzot (luigifab) <code~luigifab~info>
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

	// définition des attributs
	this.bbcode = null;
	this.object = null;
	this.fragment = null;


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALISATION (2)

	// #### Initialisation ########################################################## public ### //
	// = révision : 3
	// » Prépare l'objet de transition
	// » Ajoute un conteneur p au texte s'il en est dépourvu
	this.init = function (text) {

		this.object = { tag: 'div', content: [] };

		if (text[0] !== '[')
			this.bbcode = '[p]' + text + '[/p]';
		else
			this.bbcode = text;
	};


	// #### Interprétation ########################################################## public ### //
	// = révision : 1
	// » Lance l'analyse du bbcode
	// » Lance la création du fragment DOM
	this.exec = function () {

		this.readData(this.bbcode, 0);

		this.fragment = document.createDocumentFragment();
		this.fragment.appendChild(this.createDomFragment(this.object));
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GÉNÉRATION DE L'OBJET (3)

	// #### Création de l'objet représentant le bbcode ############################# private ### //
	// = révision : 4
	// » Parcours le bbcode récursivement
	// » Sauvegarde chaque élément et chaque bout de texte dans un tableau d'objets
	// » À bien noter qu'en JavaScript, les objets sont passés par référence, ils ne sont jamais copiés
	this.readData = function (data, level) {

		var element = null, attributes = null, content = null, text = null, other = null, cut = 0;

		// la chaine contient du texte et des éléments
		// extrait le premier bout de texte, le premier élément et son contenu ainsi que ce qu'il y a après
		// auto-rappel pour analyser chaque morceau
		if ((data[0] !== '[') && ((cut = data.search(/\[([a-z]+)(?:\ [a-z:]+=["'][^"\[\]']+["'])*\]/)) > -1)) {

			text = data.slice(0, cut);
			other = data.slice(cut);
			element = RegExp.$1;

			// balise simple
			if (/^(\[(?:area|br|col|hr|iframe|img|input|param)(?:\ [a-z:]+=["'][^"\[\]']+["'])*\])/.test(other)) {
				element = other.slice(0, RegExp.$1.length);
				other = other.slice(RegExp.$1.length);
			}
			// balise double
			else {
				cut = other.indexOf('[/' + element + ']');
				element = other.slice(0, cut + element.length + 3);
				other = other.slice(cut + element.length + 3);
			}

			// auto-rappel
			this.readData(text, level);
			this.readData(element, level);

			if (other.length > 0)
				this.readData(other, level);
		}

		// la chaine contient un élément vide en première position
		// extrait l'élément et ses attributs ainsi que ce qu'il y a après
		// demande la sauvegarde de l'élément et de ses attributs
		// auto-rappel pour analyser ce qu'il y a après
		else if (/^\[(area|br|col|hr|iframe|img|input|param)((?:\ [a-z:]+=["'][^"\[\]']+["'])*)\]/.test(data)) {

			element = RegExp.$1;
			attributes = RegExp.$2;

			other = data.slice(2 + element.length + attributes.length);
			this.addElement(element, attributes, level);

			if (other.length > 0)
				this.readData(other, level);
		}

		// la chaine contient un élément en première position
		// extrait l'élément et ses attributs, son contenu ainsi que ce qu'il y a après
		// demande la sauvegarde de l'élément, de son contenu et de ses attributs
		// auto-rappel pour analyser son contenu et ce qu'il y a après
		else if (/^\[([a-z]+)((?:\ [a-z:]+=["'][^"\[\]']+["'])*)\]/.test(data)) {

			element = RegExp.$1;
			attributes = RegExp.$2;

			cut = data.indexOf('[/' + element + ']');
			content = data.slice(2 + element.length + attributes.length, cut);
			other = data.slice(3 + element.length + cut);

			this.addElement(element, attributes, level);
			this.readData(content, level + 1);

			if (other.length > 0)
				this.readData(other, level);
		}

		// demande la sauvegarde du bout de texte
		else {
			this.addElement(data, null, level);
		}
	};


	// #### Ajoute un élément ou du texte ########################################## private ### //
	// = révision : 2
	// » Enregistre le nœud texte dans le tableau d'objets
	// » Enregistre le nœud élément et ses attributs dans le tableau d'objets
	this.addElement = function (data, attributes, level) {

		var directlink = null, attribute = null, value = null;
		directlink = this.getContentNode(this.object, 0, level);

		// *** Sauvegarde le texte ****************************** //
		if (attributes !== null) {

			if (directlink.hasOwnProperty('content'))
				directlink.content.push({ tag: data });
			else
				directlink.content = [{ tag: data }];
		}

		// *** Sauvegarde l'élément ***************************** //
		else {
			if (directlink.hasOwnProperty('content'))
				directlink.content.push({ text: data });
			else
				directlink.content = [{ text: data }];
		}

		// *** Sauvegarde les attributs de l'élément ************ //
		if ((attributes !== null) && (attributes.length > 5)) {

			attributes = attributes.slice(1, -1).split(/["']\ /);

			for (var attr in attributes) if (attributes.hasOwnProperty(attr)) {

				attribute = attributes[attr].slice(0, attributes[attr].indexOf('='));
				value = attributes[attr].slice(attributes[attr].indexOf('=') + 2);

				if (directlink.hasOwnProperty('content'))
					directlink.content[directlink.content.length - 1][attribute] = value;
				else
					directlink[attribute] = value;
			}
		}
	};


	// #### Recherche du dernier nœud content ###################################### private ### //
	// = révision : 2
	// » Recherche le dernier nœud content de l'objet
	// » Ne va pas plus loin que le niveau de profondeur demandé
	this.getContentNode = function (dom, level, maxlevel) {

		if ((dom.content.length < 1) || (maxlevel < 1))
			return dom;

		for (var i = dom.content.length - 1; i >= 0; i--) {

			if (dom.content[i].hasOwnProperty('content') && (++level < maxlevel))
				return this.getContentNode(dom.content[i], level, maxlevel);
			else
				return dom.content[i];
		}
	};




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// GESTION DE L'ARBRE DOM (2)

	// #### Résultat ################################################################ public ### //
	// = révision : 1
	// » Renvoie le fragment DOM correspondant au bbcode
	this.getDomFragment = function () {

		return this.fragment;
	};


	// #### Création de l'arbre DOM ################################################ private ### //
	// = révision : 6
	// » Crée récursivement les différents nœuds à partir du tableau d'objets
	// » Prend en charge les nœuds éléments et leurs attributs ainsi que les nœuds textes
	// » À bien noter qu'en JavaScript, les objets sont passés par référence, ils ne sont jamais copiés
	// » Source http://jsperf.com/create-nested-dom-structure
	this.createDomFragment = function (dom) {

		var tag = null, attr = null;

		// prépare un nœud élément ou renvoie un nœud texte
		if (dom.hasOwnProperty('tag'))
			tag = document.createElement(dom.tag);
		else
			return document.createTextNode(dom.text);

		// extraction des données de l'élément
		// ajoute ses attributs et son nœud texte
		// prend en charge les liens à ouvrir dans un nouvel onglet
		for (attr in dom) if (dom.hasOwnProperty(attr)) {

			if (attr === 'text')
				tag.appendChild(document.createTextNode(dom[attr]));

			if ((attr !== 'tag') && (attr !== 'text') && (attr !== 'content'))
				tag.setAttribute(attr, dom[attr]);

			if ((dom.tag === 'a') && (attr === 'class') && (/popup/.test(dom[attr]))) {

				if (apijs.config.navigator)
					tag.addEventListener('click', openTab, false);
				else
					tag.setAttribute('onclick', 'window.open(this.href); return false;');
			}
		}

		// l'élément contient un ou plusieurs sous éléments
		// auto-rappel pour analyser chaque élément
		if (dom.hasOwnProperty('content')) {

			for (var elem = 0, size = dom.content.length; elem < size; elem++)
				tag.appendChild(this.createDomFragment(dom.content[elem]));
		}

		return tag;
	};
}
