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
import netsvc
from mako2pdf import MakoToPdfParser
from report.report_sxw import rml_parse

'''
Extend the OpenERP reports. Convert Mako -> HTML -> PDF reports

@author: Liber F. Matos Martin <lfmatos@gmail.com>
'''
def register_report(name, model, tmpl_path, parser=rml_parse):
	"Register the report into the services"
	name = 'report.%s' % name
	if netsvc.Service._services.get(name, False):
		service = netsvc.Service._services[name]
		if isinstance(service, MakoToPdfParser):
			return
		if hasattr(service, 'parser'):
			parser = service.parser
		del netsvc.Service._services[name]
	MakoToPdfParser(name, model, tmpl_path, parser=parser)

class ReportXML(osv.osv):
	def __init__(self, pool, cr):
		super(ReportXML, self).__init__(pool, cr)

	def register_all(self,cursor):
		value = super(ReportXML, self).register_all(cursor)
		cursor.execute("SELECT * FROM ir_act_report_xml WHERE report_type = 'mako2pdf'")
		records = cursor.dictfetchall()
		for record in records:
			register_report(record['report_name'], record['model'], record['report_rml'])
		return value

	def unlink(self, cursor, user, ids, context=None):
		"""Delete report and unregister it"""
		trans_obj = self.pool.get('ir.translation')
		trans_ids = trans_obj.search(cursor, user, [('type', '=', 'report'), ('res_id', 'in', ids)])
		trans_obj.unlink(cursor, user, trans_ids)
		return super(ReportXML, self).unlink(cursor, user, ids, context)

	def create(self, cursor, user, vals, context=None):
		"Create report and register it"
		res = super(ReportXML, self).create(cursor, user, vals, context)
		if vals.get('report_type','') == 'mako2pdf':
			register_report(
						vals['report_name'],
						vals['model'],
						vals.get('report_rml', False)
						)
		return res

	def write(self, cr, uid, ids, vals, context=None):
		"Edit report and manage it registration"
		if isinstance(ids, (int, long)):
			ids = [ids,]
		for rep in self.browse(cr, uid, ids, context=context):
			if rep.report_type != 'mako2pdf':
				continue
			if vals.get('report_name', False) and \
				vals['report_name'] != rep.report_name:
				report_name = vals['report_name']
			else:
				report_name = rep.report_name

			register_report(
						report_name,
						vals.get('model', rep.model),
						vals.get('report_rml', rep.report_rml)
						)
		return super(ReportXML, self).write(cr, uid, ids, vals, context)

	_name = 'ir.actions.report.xml'
	_inherit = 'ir.actions.report.xml'
	_columns = {
		'm2pdf_data': fields.text('Mako2PDF Template'),
		'm2pdf_path': fields.char('Files path', size=712, help='The original file path or URL. This is needed to calculate relative paths of images and style sheets.'),
		'm2pdf_show_error_as_pdf': fields.boolean('Show error', help='Boolean that indicates that the errors will be dumped into a PDF.'),
		'm2pdf_default_css': fields.text('Default CSS', help='Here you can pass a default CSS definition in as a String.'),
		'm2pdf_xhtml': fields.boolean('XHtml', help='Boolean to force parsing the source as XHTML.'),
		'm2pdf_encoding': fields.char('Encoding', size=128, help='The encoding name of the source.')
	}
	_defaults = {
		'm2pdf_show_error_as_pdf': lambda *a: False,
		'm2pdf_xhtml': lambda *a: False,
		'm2pdf_encoding': lambda *a: 'utf-8'
	}
ReportXML()
