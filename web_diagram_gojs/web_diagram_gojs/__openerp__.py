# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2010 Tiny SPRL (<http://tiny.be>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

{
	"name": "GoJS Diagram",
	"category" : "Tools",
	"description":'Openerp web diagram view. Use GoJS library',
	"version": "1.0",
	"depends": ['base','web'],
	"author": "Liber F. Matos Martin <lfmatos@gmail.com>",
	"js": [
		#INCLUDES
		"static/lib/gojs/js/go-debug.js",
		#"static/lib/gojs/js/go.js",

		#GOJS
		"static/src/js/diagram_gojs.js",
		"static/src/js/diagram.js"
	],
	"css": [
		"static/src/css/styles.css",
		"static/src/css/styles_red.css",
		#"static/src/css/styles_blue.css"
	],
	'qweb' : [
		"static/src/xml/base.xml"
	]
}
