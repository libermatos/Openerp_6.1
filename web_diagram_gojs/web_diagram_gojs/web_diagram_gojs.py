# -*- coding: utf-8 -*-
##############################################################################
#
#	OpenERP, Open Source Management Solution
#	Copyright (C) 2004-2010 Tiny SPRL (http://tiny.be). All Rights Reserved
#
#
#	This program is free software: you can redistribute it and/or modify
#	it under the terms of the GNU General Public License as published by
#	the Free Software Foundation, either version 3 of the License, or
#	(at your option) any later version.
#
#	This program is distributed in the hope that it will be useful,
#	but WITHOUT ANY WARRANTY; without even the implied warranty of
#	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#	GNU General Public License for more details.
#
#	You should have received a copy of the GNU General Public License
#	along with this program.  If not, see http://www.gnu.org/licenses/.
#
##############################################################################
from lxml import etree
from osv import osv, fields
import os
import tools
import logging

'''
Extend the OpenERP diagram with GoJS javascript library

@author: Liber F. Matos Martin <lfmatos@gmail.com>
'''
_logger = logging.getLogger(__name__)
class ir_ui_view(osv.osv):
	_name = 'ir.ui.view'
	_inherit = 'ir.ui.view'

	_columns = {
		'type': fields.selection((
			('tree','Tree'),
			('form','Form'),
			('mdx','mdx'),
			('graph', 'Graph'),
			('diagram_gojs', 'Diagram'),
			('calendar', 'Calendar'),
			('diagram','Diagram'),
			('gantt', 'Gantt'),
			('kanban', 'Kanban'),
			('search','Search')), 'View Type', required=True, select=True)
	}

	def _check_xml(self, cr, uid, ids, context=None):
		for view in self.browse(cr, uid, ids, context):
			eview = etree.fromstring(view.arch.encode('utf8'))
			frng = tools.file_open(os.path.join('web_diagram_gojs', 'static', 'src', 'xml', 'view.rng'))
			try:
				relaxng_doc = etree.parse(frng)
				relaxng = etree.RelaxNG(relaxng_doc)
				if not relaxng.validate(eview):
					for error in relaxng.error_log:
						_logger.error(tools.ustr(error))
					return False
			finally:
				frng.close()
		return True

	_constraints = [
		(_check_xml, 'Invalid XML for View Architecture!', ['arch'])
	]
ir_ui_view()
