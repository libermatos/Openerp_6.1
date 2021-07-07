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
	"name": "Demo Highcharts Web Graph",
	"category" : "Tools",
	"description":'Openerp Demo web graph view. Use Highcharts library',
	"version": "1.0",
	"depends" : ['base','web','web_graph_highcharts'],
	"author": "Liber F. Matos Martín <lfmatos@gmail.com>",
	"website": "https://github.com/libermatos/web_graph_highcharts",
	'update_xml': [
		'view/demo_graph_hc.xml',
		'view/basic_line.xml',
		'view/time_series_zoomable.xml',
		'view/spline_plot_bands.xml',
		'view/area_basic.xml',
		'view/area_inverted.xml',
		'view/area_stacked.xml',
		'view/column_drilldown.xml',
		'view/bar_basic.xml',
		'view/column_rotated_labels.xml',
		'view/pie_basic.xml',
		'view/pie_semi_circle.xml',
		'view/pie_drilldown.xml',
		'view/scatter.xml',
		'view/bubble.xml',
		'view/bubble_3d.xml',
		'view/dynamic_update.xml',
		'view/dynamic_click_to_add.xml',
		'view/dynamic_master_detail.xml',
		'view/combo.xml',
		'view/combo_multi_axes.xml',
		'view/combo_dual_axes.xml',
		'view/3d_pie.xml',
		'view/3d_column_stacking_grouping.xml',
		'view/3d_column_null_values.xml',
		'view/3d_scatter_chart.xml',
		'view/polar_chart.xml',
		'view/pyramid_chart.xml',
		'view/waterfall.xml',
		'view/angular_gauge.xml',
		'view/gauge_vu_meter.xml',
		'view/heat_map.xml',
		'view/board_view.xml',
	],
	"installable": True,
	'application': True
}
