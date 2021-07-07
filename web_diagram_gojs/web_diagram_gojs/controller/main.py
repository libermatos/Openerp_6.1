# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2010 Tiny SPRL (http://tiny.be). All Rights Reserved
#
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see http://www.gnu.org/licenses/.
#
##############################################################################
from web.controllers.main import View
import web.common.http as openerpweb
from lxml import etree

'''
Extend the OpenERP diagram with GoJS javascript library

@author: Liber F. Matos Martin <lfmatos@gmail.com>
'''
class DiagramViewGoJS(View):
	_cp_path = '/web_diagram/gojs'

	def from_data(self, model, method, fields, domain, group_by, context=None):
		if not method:
			return False
		return getattr(model, method)(fields, domain, group_by, context)

	@openerpweb.jsonrequest
	def data_get(self, req, model=None, domain=[], group_by=[], view_id=False):
		context = req.session.eval_context(req.context)
		obj = req.session.model(model)
		xml = obj.fields_view_get(view_id, 'diagram_gojs')
		graph_xml = etree.fromstring(xml['arch'])
		method = graph_xml.attrib.get('method', False)
		if not method:
			method = False
		fields = [ element.attrib.get('name') for element in graph_xml.iter() ]
		return self.from_data(obj, method, fields, domain, group_by, context)
