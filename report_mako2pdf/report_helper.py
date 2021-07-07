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

import pooler

'''
Extend the OpenERP reports. Convert Mako -> HTML -> PDF reports

@author: Liber F. Matos Martin <lfmatos@gmail.com>
'''
class WebXHtmlHelper(object):
    """Set of usefull report helper"""
    def __init__(self, cursor, uid, report_id, context):
        "constructor"
        self.cursor = cursor
        self.uid = uid
        self.pool = pooler.get_pool(self.cursor.dbname)
        self.report_id = report_id

    def embed_image(self, type, img, width=0, height=0) :
        "Transform a DB image into an embedded HTML image"

        if width :
            width = 'width="%spx"'%(width)
        else :
            width = ' '
        if height :
            height = 'height="%spx"'%(height)
        else :
            height = ' '
        toreturn = '<img %s %s src="data:image/%s;base64,%s" />'%(
            width,
            height,
            type,
            str(img))
        return toreturn
