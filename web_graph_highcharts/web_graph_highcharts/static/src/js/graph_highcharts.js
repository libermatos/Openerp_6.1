/*
* ---------------------------------------------------------
* OpenERP web_graph Highcharts
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/

openerp.web_graph_highcharts = function (openerp) {
	var _t = openerp.web._t,
	_lt = openerp.web._lt;
	var QWeb = openerp.web.qweb;
	openerp.web.views.add('graph_highcharts', 'openerp.web_graph_highcharts.GraphViewHighcharts');
	openerp.web_graph_highcharts.GraphViewHighcharts = openerp.web.View.extend({
		display_name: _lt('Graph'),
		lang: {
			loading: _t('Loading...'),
			months: [_t('January'),_t('February'),_t('March'),_t('April'),_t('May'),_t('June'),_t('July'),_t('August'),_t('September'),_t('October'),_t('November'),_t('December')],
			shortMonths: [_t('Jan'),_t('Feb'),_t('Mar'),_t('Apr'),_t('May '),_t('Jun'),_t('Jul'),_t('Aug'),_t('Sep'),_t('Oct'),_t('Nov'),_t('Dec')],
			weekdays: [_t('Sunday'),_t('Monday'),_t('Tuesday'),_t('Wednesday'),_t('Thursday'),_t('Friday'),_t('Saturday')],
			decimalPoint: '.',
			numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels
			resetZoom: _t('Reset zoom'),
			resetZoomTitle: _t('Reset zoom level 1:1'),
			thousandsSep: ',',
			drillUpText: _t('◁ Back to {series.name}'),
			noData: _t('No data to display'),
			printChart: _t('Print chart'),
			downloadPNG: _t('Download PNG image'),
			downloadJPEG: _t('Download JPEG image'),
			downloadPDF: _t('Download PDF document'),
			downloadSVG: _t('Download SVG vector image'),
			contextButtonTitle: _t('Chart context menu')
		},
		init: function(parent, dataset, view_id, options) {
			this._super(parent);
			this.dataset = dataset;
			this.view_id = view_id;
			this.set_default_options(options);
			this.fields_view = {};
			this.model = dataset.model;
			this.chart_id = Math.floor((Math.random()*100)+1);
			Highcharts.setOptions({
				lang: this.lang
			});
			Highcharts.openerp = this;
		},
		stop: function () {
			this._super();
		},
		start: function() {
			var self = this;
			this._super();
			var loaded;
			loaded = this.rpc('/web/view/load', {
						model: this.dataset.model,
						view_id: this.view_id,
						view_type: 'graph_highcharts'
					});
			return $.when(this.dataset.call_and_eval('fields_get', [false, {}], null, 1), loaded)
				.then(function (fields_result, view_result) {
						self.fields = fields_result[0];
						self.fields_view = view_result[0];
						self.$element.html(QWeb.render("GraphViewHighcharts", {
							"chart_id": self.chart_id,
							'element_id': self.widget_parent.element_id
						}));
				});
		},
		do_search: function(domain, context, group_by) {
			context.graph_container = this.widget_parent.element_id+"-chart-"+this.chart_id;
			Highcharts.graph_container = this.widget_parent.element_id+"-chart-"+this.chart_id;
			this.rpc('/web_graph/highcharts/data_get', {
					'model': this.model,
					'domain': domain,
					'group_by': group_by,
					'view_id': this.view_id,
					'context': context
				}, this.on_search);
		},
		on_search: function(result){
			container = this.widget_parent.element_id+"-chart-"+this.chart_id;
			if(result.length>0){
				var self = this;
				var opts = Highcharts.getOptions();
				var opts_color = Highcharts.getOptions().colors;
				if(result[0]!=false){
					if(!result[0].chart)
						result[0].chart = {};
					result[0].chart.renderTo = container;
					if(!result[0].chart.height)
						result[0].chart.height = 300;
					if(!result[0].credits)
						result[0].credits = {enabled: false};
					if(!result[0].exporting)
						result[0].exporting = {enabled: false};
					if(result[0].lang)
						Highcharts.setOptions({
							lang: result[0].lang
						});
					if(result.length>1){
						for(i=0; i<result[1].length; i++)
							if(result[1][i].key != "js_code")
								eval("result[0]."+result[1][i].key+"="+result[1][i].value);
							else
								eval(result[1][i].value);
					}
					return new Highcharts.Chart(result[0], function(pchart){
								self.chart = pchart;
								Highcharts.setOptions(opts);
								Highcharts.getOptions().colors = opts_color;
							});
				}
				else{
					if(result.length>1)
						eval(result[1].value);
				}
			}
		},
		do_show: function() {
			this.do_push_state({});
			return this._super();
		}
	});

	openerp.web.SearchView.include({
		on_loaded: function(data) {
			if(this.options == undefined){
				this.options = {
					"searchable": true,
					"clearable": true,
					"filterable": true
				};
			}
			if(data.fields_view.arch.attrs.options){
				var opt = JSON.parse(data.fields_view.arch.attrs.options);
				this.options = _.extend(this.options, opt);
			}
			data.fields_view.arch.options = this.options;
			this._super.apply(this,arguments);
		}
	});
}
