/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_dom_tree", function(self, result, container){
	var $ = go.GraphObject.make;  // for conciseness in defining templates

	myDiagram =
		$(go.Diagram, container,
		{
			// position the graph in the middle of the diagram
			initialContentAlignment: go.Spot.Center,
			initialAutoScale: go.Diagram.UniformToFill,
			// define the layout for the diagram
			layout: $(go.TreeLayout, { nodeSpacing: 5, layerSpacing: 30 })
		});

	// Define a simple node template consisting of text followed by an expand/collapse button
	myDiagram.nodeTemplate =
		$(go.Node, "Horizontal",
			{
				selectionChanged: function(){ // Event handler
				}
			},
			$(go.Panel, "Auto",
				$(go.Shape, { fill: "darkslategray", stroke: null }),
				$(go.TextBlock,
				{ font: "bold 13px Helvetica, bold Arial, sans-serif", stroke: "white", margin: 3 },
				new go.Binding("text", "key"))
			),
			$("TreeExpanderButton")
		);

	// Define a trivial link template with no arrowhead.
	myDiagram.linkTemplate =
		$(go.Link,
			{ selectable: false },
			$(go.Shape));  // the link shape

	//var nodeDataArray = [];

	var nodeDataArray = [
		{ key: "html", name: "html" },
		{ key: "head", name: "head", parent: "html" },
		{ key: "title", name: "title", parent: "head" },
		{ key: "link", name: "link", parent: "head" },
		{ key: "script", name: "script", parent: "head" },
		{ key: "body", name: "body", parent: "html" },
		{ key: "h1", name: "h1", parent: "body" },
		{ key: "h2", name: "h2", parent: "body" },
		{ key: "div", name: "div", parent: "body" },
		{ key: "p", name: "p", parent: "body" },
		{ key: "strong", name: "strong", parent: "p" },
		{ key: "font", name: "font", parent: "p" },
		{ key: "table", name: "table", parent: "body" },
		{ key: "th", name: "th", parent: "table" },
		{ key: "tr", name: "tr", parent: "table" },
		{ key: "td", name: "td", parent: "tr" },
	];

	// create the model for the DOM tree
	myDiagram.model = new go.TreeModel(nodeDataArray)
});
