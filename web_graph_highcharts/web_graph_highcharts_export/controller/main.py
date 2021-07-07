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
import web.common.http as openerpweb
import operator
import simplejson
import tempfile
import os
from ..common import cairosvg

'''
Export Highcharts graph to pdf or png format.

@author: Liber F. Matos Martin <lfmatos@gmail.com>
'''
class ExportSVG(openerpweb.Controller):
	_cp_path = "/web/export/svg"

	def content_type(self, file_type):
		""" Provides the format's content type """
		if file_type=='png':
			return 'image/png'
		return 'application/pdf'

	def pdf(self, svg):
		out_path = tempfile.mktemp(suffix=".pdf", prefix="svg.")
		cairosvg.svg2pdf(bytestring=svg,write_to=out_path)
		file_pdf = open(out_path, "rb").read()
		os.unlink(out_path)
		return file_pdf

	def png(self, svg):
		out_path = tempfile.mktemp(suffix=".png", prefix="svg.")
		cairosvg.svg2png(bytestring=svg,write_to=out_path)
		file_png = open(out_path, "rb").read()
		os.unlink(out_path)
		return file_png

	def from_data(self, svg, file_type):
		return getattr(self, file_type)(svg)

	@openerpweb.httprequest
	def index(self, req, data, token):
		svg, file_type, filename = operator.itemgetter('svg', 'file_type', 'filename')(simplejson.loads(data))
		fullname = filename+'.'+file_type
		return req.make_response(self.from_data(svg, file_type),
			headers=[('Content-Disposition', 'attachment; filename="%s"' % fullname),
					 ('Content-Type', self.content_type(file_type))],
			cookies={'fileToken': token})
