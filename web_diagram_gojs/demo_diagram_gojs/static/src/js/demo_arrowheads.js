/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_arrowheads", function(self, result, container){
	 var $ = go.GraphObject.make;  // for conciseness in defining templates

	var myDiagram =
	  $(go.Diagram, container,  // create a Diagram for the DIV HTML element
		{
			isReadOnly: true,  // don't allow move or delete
			initialContentAlignment: go.Spot.Center,
			layout: $(go.CircularLayout,
					{
						radius: 100,  // minimum radius
						spacing: 0,   // circular nodes will touch each other
						nodeDiameterFormula: go.CircularLayout.Circular,  // assume nodes are circular
						startAngle: 270  // first node will be at top
					}),
		  // define a DiagramEvent listener
		  "LayoutCompleted": function(e) {
				// now that the CircularLayout has finished, we know where its center is
				var cntr = myDiagram.findNodeForKey("Center");
				cntr.location = myDiagram.layout.actualCenter;
			}
		});

	// construct a shared radial gradient brush
	var radBrush = $(go.Brush, go.Brush.Radial, { 0: "#969696", 1: "#666666" });

	// these are the nodes that are in a circle
	myDiagram.nodeTemplate =
		$(go.Node,
			$(go.Shape, "Circle",
			{
				desiredSize: new go.Size(28, 28),
				fill: radBrush, strokeWidth: 0, stroke: null
			}), // no outline
			{
				locationSpot: go.Spot.Center,
				click: function(e, obj){
						// Event handler
				},
				toolTip:  // define a tooltip for each link that displays its information
					$(go.Adornment, "Auto",
						$(go.Shape, { fill: "#EFEFCC" }),
						$(go.TextBlock, { margin: 4 },
						new go.Binding("text", "").ofObject())
					)
			}
		);

	// use a special template for the center node
	myDiagram.nodeTemplateMap.add("Center",
		$(go.Node, "Spot",
		{
			selectable: false,
			isLayoutPositioned: false,  // the Diagram.layout will not position this node
			desiredSize: new go.Size(200, 200),
			locationSpot: go.Spot.Center
		},
		$(go.Shape, "Circle",
			{ fill: radBrush, strokeWidth: 0, stroke: null }), // no outline
		$(go.TextBlock, "Arrowheads",
			{ margin: 1, stroke: "white", font: "bold 14px sans-serif" })
	  ));

	// all Links have both "toArrow" and "fromArrow" Shapes,
	// where both arrow properties are data bound
	myDiagram.linkTemplate =
		$(go.Link,  // the whole link panel
			{ routing: go.Link.Normal },
			$(go.Shape,  // the link shape
				{ isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
			$(go.Shape,  // the "from" arrowhead
				new go.Binding("fromArrow", "fromArrow"),
				{ scale: 2, fill: "red" }),
			$(go.Shape,  // the "to" arrowhead
				new go.Binding("toArrow", "toArrow"),
				{ scale: 2, fill: "red" }),
				{
					click: function(e, obj){
						//Event handler
					},
					toolTip:  // define a tooltip for each link that displays its information
						$(go.Adornment, "Auto",
						$(go.Shape, { fill: "#EFEFCC" }),
						$(go.TextBlock, { margin: 4 },
							new go.Binding("text", "").ofObject())
						)
			}
		);

	// collect all of the predefined arrowhead names
	var arrowheads = [];
	for (var a in go.Shape.ArrowheadGeometries) {
		// ignore all-lower-case arrowhead names
		if (a.toLowerCase() === a) continue;
		arrowheads.push(a);
	}
	if (arrowheads.length % 2 === 1) arrowheads.push("");  // make sure there's an even number

	// create all of the link data, two arrowheads per link
	var linkdata = [];
	var i = 0;
	for (var j = 0; j < arrowheads.length; j = j + 2) {
		linkdata.push({ from: "Center", to: i++, toArrow: arrowheads[j], fromArrow: arrowheads[j + 1] });
	}

	myDiagram.model =
		$(go.GraphLinksModel,
		{ 	// this gets copied automatically when there's a link data reference to a new node key
			// and is then added to the nodeDataArray
			archetypeNodeData: {},
			// the node array starts with just the special Center node
			nodeDataArray: [{ category: "Center", key: "Center"}],
			// the link array was created above
			linkDataArray: linkdata
		});
});
