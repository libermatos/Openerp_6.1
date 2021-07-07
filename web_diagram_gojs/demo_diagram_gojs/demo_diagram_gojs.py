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

from osv import osv, fields

class demo_diagram_gojs(osv.osv):
	_name = "demo.diagram.gojs"

	def minimal(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def basic(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def dom_tree(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def arrowheads(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def svg_icons(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def navigation(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def incremental_tree(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def double_tree(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def orgchart_editor(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def swimlanes(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def conceptmap(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def entityrelationship(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def taperedlinks(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def fdLayout(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def cLayout(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}
	def processflow(self, cr, uid, fields, domain, group_by, context):
		#return some value and use it in javascript handler
		return {}

	_columns = {
		'name': fields.char('Diagram Name', size=64, required=True),
	}
demo_diagram_gojs()
