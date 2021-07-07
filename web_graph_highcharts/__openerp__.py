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
	"name": "Highcharts Web Graph",
	"category" : "Tools",
	"description":'Openerp web graph view. Use Highcharts library',
	"version": "1.0",
	"depends": ['base','web'],
	"author": "Liber F. Matos Martin <lfmatos@gmail.com>",
	"website": "https://github.com/libermatos/web_graph_highcharts",
	"js": [
		#INCLUDES
		"static/lib/highcharts/js/highcharts.js",
		"static/lib/highcharts/js/highcharts-3d.js",
		"static/lib/highcharts/js/modules/data.js",
		"static/lib/highcharts/js/modules/drilldown.js",
		"static/lib/highcharts/js/modules/funnel.js",
		"static/lib/highcharts/js/modules/heatmap.js",
		#"static/lib/highcharts/js/modules/canvas-tools.js",
		#"static/lib/highcharts/js/modules/exporting.js",
		#"static/lib/highcharts/js/modules/no-data-to-display.js",
		#"static/lib/highcharts/js/modules/solid-gauge.js",
		"static/lib/highcharts/js/highcharts-more.js",

		#THEMES
		#"static/lib/highcharts/js/themes/dark-blue.js",
		#"static/lib/highcharts/js/themes/dark-green.js",
		#"static/lib/highcharts/js/themes/dark-unica.js",
		#"static/lib/highcharts/js/themes/gray.js",
		#"static/lib/highcharts/js/themes/grid.js",
		#"static/lib/highcharts/js/themes/grid-light.js",
		#"static/lib/highcharts/js/themes/sand-signika.js",
		#"static/lib/highcharts/js/themes/skies.js",

		#GRAPH
		"static/src/js/graph_highcharts.js"

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
