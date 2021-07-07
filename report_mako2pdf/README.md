report_mako2pdf
===============

OpenERP 6.1 module that converts Mako -> HTML -> PDF reports. It is based on report_webkit module.

Author
------
	Liber F. Matos Martín <lfmatos@gmail.com>

Requirements
--------------
	- OpenERP 6.1-1

Install
-------
	- Copy it in a valid addons_path. Follow the installation process of modules in OpenERP.

Features
--------
	- The needed dependencies are within modules.

	- After installing the module you can use a new type of report called mako2pdf. Ex:

		<report
			auto="False"
			id="report_mako2pdf_id"
			model="model.report"
			name="report.mako2pdf.name"
			file="module/path/mako_file.mako"
			string="Title"
			report_type="mako2pdf"
		/>

	- In custom parsers you can specify extra options that change the behavior. Ex:

		class mako_parser_ex(report_sxw.rml_parse):
			def __init__(self, cr, uid, name, context=None):
				super(mako_parser_ex, self).__init__(cr, uid, name, context=context)
				self.localcontext.update({
					'mako2pdf': {
						'encoding': "ISO-8859-1", # UTF-8 by default
						'default_css': "a{}",
						....
						[OPTIONS]
					}
				})
		report_sxw.report_sxw('report.mako.parser.ex', 'model.report', 'module/path/mako_file.mako',parser=mako_parser_ex)

		[OPTIONS]
			* path: The original file path or URL. This is needed to calculate relative paths of images and style sheets. (XXX calculate automatically from src?)
			* link_callback: Handler for special file paths (see below).
			* show_error_as_pdf: Boolean that indicates that the errors will be dumped into a PDF. This is usefull if that is the only way to show the errors like in simple web applications.
			* default_css: Here you can pass a default CSS definition in as a String. If set to None the predefined CSS of pisa is used.
			* xhtml: Boolean to force parsing the source as XHTML. By default the HTML5 parser tries to guess this.
			* encoding: The encoding name of the source. By default this is guessed by the HTML5 parser. But HTML with no meta information this may not work an then this argument is helpfull.
