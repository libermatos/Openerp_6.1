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
	"name": "Demo GoJS Web Diagram",
	"category" : "Tools",
	"description":'Openerp Demo web diagram view. Use GoJS library',
	"version": "1.0",
	"depends" : ['base','web','web_diagram_gojs'],
	"author": "Liber F. Matos Martín <lfmatos@gmail.com>",
	'update_xml': [
		'view/demo_diagram_gojs.xml',
		'view/minimal.xml',
		'view/basic.xml',
		'view/dom_tree.xml',
		'view/arrowheads.xml',
		'view/svg_icons.xml',
		'view/navigation.xml',
		'view/incremental_tree.xml',
		'view/double_tree.xml',
		'view/orgchart_editor.xml',
		'view/swimlanes.xml',
		'view/conceptmap.xml',
		'view/entityrelationship.xml',
		'view/taperedlinks.xml',
		'view/fdLayout.xml',
		'view/cLayout.xml',
		'view/processflow.xml',
		'view/board_view.xml'
	],
	"js": [
		"static/src/js/demo_minimal.js",
		"static/src/js/demo_basic.js",
		"static/src/js/demo_dom_tree.js",
		"static/src/js/demo_arrowheads.js",
		"static/src/js/demo_svg_icons.js",
		"static/src/js/demo_navigation.js",
		"static/src/js/demo_incremental_tree.js",
		"static/src/js/demo_double_tree.js",
		"static/src/js/demo_orgchart_editor.js",
		"static/src/js/demo_swimlanes.js",
		"static/src/js/demo_conceptmap.js",
		"static/src/js/demo_entityrelationship.js",
		"static/src/js/demo_taperedlinks.js",
		"static/src/js/demo_fdLayout.js",
		"static/src/js/demo_cLayout.js",
		"static/src/js/demo_processflow.js"
	],
	"installable": True,
	'application': True
}
