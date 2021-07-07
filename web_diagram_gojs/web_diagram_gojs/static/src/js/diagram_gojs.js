/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/

openerp.web_diagram_gojs = function (openerp) {
	var _t = openerp.web._t,
	_lt = openerp.web._lt;
	var QWeb = openerp.web.qweb;
	openerp.web.views.add('diagram_gojs', 'openerp.web_diagram_gojs.DiagramViewGoJS');
	openerp.web_diagram_gojs.DiagramViewGoJS = openerp.web.View.extend({
		display_name: _lt('Diagram'),

		init: function(parent, dataset, view_id, options) {
			this._super(parent);
			this.dataset = dataset;
			this.view_id = view_id;
			this.set_default_options(options);
			this.fields_view = {};
			this.model = dataset.model;
			this.diagram_id = Math.floor((Math.random()*100)+1);
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
						view_type: 'diagram_gojs'
					});
			return $.when(this.dataset.call_and_eval('fields_get', [false, {}], null, 1), loaded)
				.then(function (fields_result, view_result) {
					self.fields = fields_result[0];
					self.fields_view = view_result[0];
					self.$element.html(QWeb.render("DiagramViewGoJS", {
						"diagram_id": self.diagram_id,
						'element_id': self.widget_parent.element_id
					}));
				});
		},
		dataview: function(result, container){
			if(this.fields_view.arch.attrs.js_handler)
			{
				var handler = openerp._openerp.gojs_handlers[this.model][this.fields_view.arch.attrs.js_handler];
				return handler(this, result, container);
			}
		},
		do_search: function(domain, context, group_by){
			var div_container = go.Diagram.fromDiv(this.widget_parent.element_id+"-diagram-"+this.diagram_id);
			if(div_container !== null)
				div_container.div = null;

			this.rpc('/web_diagram/gojs/data_get', {
				'model': this.model,
				'domain': domain,
				'group_by': group_by,
				'view_id': this.view_id,
				'context': context
			}, this.on_search);
		},
		on_search: function(result){
			container = this.widget_parent.element_id+"-diagram-"+this.diagram_id;
			var self = this;
			self.dataview(result, container);
		},
		do_show: function(){
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
};

openerp.gojs_handlers = {};
openerp.register_gojs_handler = function(model, name, handler){
	if(openerp.gojs_handlers[model])
		openerp.gojs_handlers[model][name] = handler;
	else {
		openerp.gojs_handlers[model] = {};
		openerp.gojs_handlers[model][name] = handler;
	}
};
