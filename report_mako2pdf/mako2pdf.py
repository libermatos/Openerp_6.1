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

import os
import tempfile
import time
import pooler
from mako.template import Template
from mako.lookup import TemplateLookup
from mako import exceptions
from report_helper import WebXHtmlHelper
from report.report_sxw import *
import addons
import tools
from tools.translate import _
from osv.osv import except_osv
import StringIO
from lib.xhtml2pdf import pisa as pisa

'''
Extend the OpenERP reports. Convert Mako -> HTML -> PDF reports

@author: Liber F. Matos Martin <lfmatos@gmail.com>
'''
def mako_template(text):
	""" Build a Mako template. This template uses UTF-8 encoding """
	tmp_lookup  = TemplateLookup()
	return Template(text, input_encoding='utf-8', output_encoding='utf-8', lookup=tmp_lookup)

class MakoToPdfParser(report_sxw):
	"""Custom class that use xhtml2pdf to render HTML reports"""
	def __init__(self, name, table, rml=False, parser=False, header=True, store=False):
		self.parser_instance = False
		self.localcontext = {}
		report_sxw.__init__(self, name, table, rml, parser,	header, store)
		self.generators['mako2pdf'] = self.create_mako2pdf

	def generate_pdf(self, comm_path, report_xml, header, footer, html_list, webkit_header=False):
		"""Call xhtml2pdf in order to generate pdf"""
		tmp_dir = tempfile.gettempdir()
		out_filename = tempfile.mktemp(suffix=".pdf", prefix="xhtml2pdf.tmp.")
		files = []
		file_to_del = []

		count = 0
		for html in html_list :
			html_file = file(os.path.join(tmp_dir, str(time.time()) + str(count) +'.body.html'), 'w')
			count += 1
			html_file.write(html)
			html_file.close()
			file_to_del.append(html_file.name)

		pdf = file(out_filename, 'rb').read()
		for f_to_del in file_to_del :
			os.unlink(f_to_del)

		os.unlink(out_filename)
		return pdf

	def translate_call(self, src):
		"""Translate String."""
		ir_translation = self.pool.get('ir.translation')
		res = ir_translation._get_source(self.parser_instance.cr, self.parser_instance.uid,
										 None, 'report', self.parser_instance.localcontext.get('lang', 'en_US'), src)
		if not res :
			return src
		return res

	# override needed to keep the attachments storing procedure
	def create_single_pdf(self, cr, uid, ids, data, report_xml, context=None):
		"""generate the PDF"""
		if context is None:
			context={}
		htmls = []
		self.parser_instance = self.parser(cr, uid, self.name2, context=context)

		self.pool = pooler.get_pool(cr.dbname)
		objs = self.getObjects(cr, uid, ids, context)
		self.parser_instance.set_context(objs, data, ids, report_xml.report_type)

		template =  False
		if report_xml.report_file :
			path = addons.get_module_resource(report_xml.report_file)
			if os.path.exists(path) :
				template = file(path).read()
		if not template and report_xml.m2pdf_data:
			template =  report_xml.m2pdf_data
		if not template :
			raise except_osv(_('Error!'), _('Report template not found!'))

		body_mako_tpl = mako_template(template)
		helper = WebXHtmlHelper(cr, uid, report_xml.id, context)

		css = ''
		try :
			html = body_mako_tpl.render(helper=helper, css=css, _=self.translate_call, **self.parser_instance.localcontext)
			htmls.append(html)
		except Exception, e:
			msg = exceptions.text_error_template().render()
			raise except_osv(_('XHtml2Pdf render'), msg)

		try :
			html_data = body_mako_tpl.render(helper=helper, css=css, _debug=tools.ustr("\n".join(htmls)), _=self.translate_call, **self.parser_instance.localcontext)
			#Convert HTML to PDF
			pdf = self.generators[report_xml.report_type](html_data, report_xml, context=self.parser_instance.localcontext)
			return (pdf, 'pdf')
		except Exception, e:
			msg = exceptions.text_error_template().render()
			raise except_osv(_('XHtml2Pdf render'), msg)

		return None

	def _config(self, report_xml, context=None):
		"""
		path: The original file path or URL. This is needed to calculate relative paths of images and style sheets. (XXX calculate automatically from src?)
		link_callback: Handler for special file paths (see below).
		show_error_as_pdf: Boolean that indicates that the errors will be dumped into a PDF. This is usefull if that is the only way to show the errors like in simple web applications.
		default_css: Here you can pass a default CSS definition in as a String. If set to None the predefined CSS of pisa is used.
		xhtml: Boolean to force parsing the source as XHTML. By default the HTML5 parser tries to guess this.
		encoding: The encoding name of the source. By default this is guessed by the HTML5 parser. But HTML with no meta information this may not work an then this argument is helpfull.
		"""
		config = {
					'path': report_xml.m2pdf_path if report_xml.m2pdf_path!='' else None,
					'link_callback': None,
					'show_error_as_pdf': report_xml.m2pdf_show_error_as_pdf,
					'xhtml': report_xml.m2pdf_xhtml,
					'encoding': report_xml.m2pdf_encoding if report_xml.m2pdf_encoding!='' else 'utf-8'
				}
		if report_xml.m2pdf_default_css and report_xml.m2pdf_default_css!='':
			config['default_css'] = report_xml.m2pdf_default_css

		if context.get('mako2pdf', False):
			if context['mako2pdf'].get('path', False) and context['mako2pdf'].get('path', False)!='':
				config['path'] = context['mako2pdf']['path']
			if context['mako2pdf'].get('link_callback', False) and context['mako2pdf'].get('link_callback', False)!='':
				config['link_callback'] = context['mako2pdf']['link_callback']
			if context['mako2pdf'].get('show_error_as_pdf', False):
				config['show_error_as_pdf'] = context['mako2pdf']['show_error_as_pdf']
			if context['mako2pdf'].get('xhtml', False):
				config['xhtml'] = context['mako2pdf']['xhtml']
			if context['mako2pdf'].get('encoding', False) and context['mako2pdf'].get('encoding', False)!='':
				config['encoding'] = context['mako2pdf']['encoding']
			if context['mako2pdf'].get('default_css', False) and context['mako2pdf'].get('default_css', False)!='':
				config['default_css'] = context['mako2pdf']['default_css']
		return config

	def create_mako2pdf(self, html_data, report_xml, context=None):
		output = StringIO.StringIO()
		config = self._config(report_xml, context=context)
		pisa.CreatePDF(html_data, output, **config)
		pdf = output.getvalue()
		output.close()
		return pdf

	def create(self, cr, uid, ids, data, context=None):
		"""Override the create function in order to handle generator"""
		pool = pooler.get_pool(cr.dbname)
		ir_obj = pool.get('ir.actions.report.xml')
		report_xml_ids = ir_obj.search(cr, uid, [('report_name', '=', self.name[7:])], context=context)
		if report_xml_ids:
			report_xml = ir_obj.browse(cr, uid, report_xml_ids[0], context=context)
			report_xml.report_rml = None
			report_xml.report_rml_content = None
			report_xml.report_sxw_content_data = None
			report_rml.report_sxw_content = None
			report_rml.report_sxw = None
		else:
			return super(MakoToPdfParser, self).create(cr, uid, ids, data, context)
		if report_xml.report_type != 'mako2pdf' :
			return super(MakoToPdfParser, self).create(cr, uid, ids, data, context)
		result = self.create_source_pdf(cr, uid, ids, data, report_xml, context)
		if not result:
			return (False, False)
		return result
