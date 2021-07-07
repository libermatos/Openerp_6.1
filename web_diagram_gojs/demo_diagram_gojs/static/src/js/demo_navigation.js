/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_navigation", function(self, result, container){
	var $ = go.GraphObject.make;  // for conciseness in defining templates

	myDiagram =
		$(go.Diagram, container,  // Diagram refers to its DIV HTML element by id
		{
			initialContentAlignment: go.Spot.Center,
			maxSelectionCount: 1 // no more than 1 element can be selected at a time
		});

	// define the node template
	myDiagram.nodeTemplate =
		$(go.Node, "Auto",
			new go.Binding("location", "loc"),
			{ locationSpot: go.Spot.Center },
			$(go.Shape, "Rectangle",
			{
				name: "OBJSHAPE",
				fill: "white",
				desiredSize: new go.Size(30, 30)
				}),
			$(go.TextBlock,
				{ margin: 4 },
			new go.Binding("text", "key")),
			{
				toolTip:  //  define a tooltip for each node that displays its information
				$(go.Adornment, "Auto",
					$(go.Shape, { fill: "#EFEFCC" }),
					$(go.TextBlock, { margin: 4 },
					new go.Binding("text",  ""))
				)
			}
		);

	 // define the link template
	myDiagram.linkTemplate =
		$(go.Link,
		{
			selectionAdornmentTemplate:
				$(go.Adornment,
					$(go.Shape,
						{ isPanelMain: true, stroke: "dodgerblue", strokeWidth: 3 }),
					$(go.Shape,
						{ toArrow: "Standard", fill: "dodgerblue", stroke: null, scale: 1 })
				),
			routing: go.Link.Normal,
			curve: go.Link.Bezier,
			toShortLength: 2
		},
		$(go.Shape,  //  the link shape
		{
			name: "OBJSHAPE", isPanelMain: true }),
			$(go.Shape,  //  the arrowhead
				{ name: "ARWSHAPE", toArrow: "Standard" }),
			{
				toolTip:  //  define a tooltip for each link that displays its information
					$(go.Adornment, "Auto",
						$(go.Shape, { fill: "#EFEFCC" }),
						$(go.TextBlock, { margin: 4 },
						new go.Binding("text",  ""))
					)
			}
		);

	// define the group template
	myDiagram.groupTemplate =
		$(go.Group, "Spot",
			{
				selectionAdornmentTemplate: // adornment when a group is selected
					$(go.Adornment, "Auto",
						$(go.Shape, "Rectangle",
							{ fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
						$(go.Placeholder)
					),
					toSpot: go.Spot.TopSide // links coming into groups come from top
			},
			$(go.Panel, "Auto",
				$(go.Shape, "Rectangle",
				{
					name: "OBJSHAPE",
					parameter1: 14,
					fill: "rgba(255,0,0,0.10)"
				},
				new go.Binding("desiredSize", "ds")),
				$(go.Placeholder,
					{ padding: 16 })
			),
			$(go.TextBlock,
			{
				name: "GROUPTEXT",
				alignment: go.Spot.TopLeft,
				alignmentFocus: new go.Spot(0,0,4,4),
				font: "Bold 10pt Sans-Serif"
			},
			new go.Binding("text", "key")),
			{
				toolTip:  //  define a tooltip for each group that displays its information
					$(go.Adornment, "Auto",
						$(go.Shape, { fill: "#EFEFCC" }),
						$(go.TextBlock, { margin: 4 },
						new go.Binding("text",  ""))
					)
			}
		);

	// add nodes, including groups, and links to the model
	myDiagram.model = new go.GraphLinksModel(
		[ // node data
			{ key: "A", loc: new go.Point(320, 100) },
			{ key: "B", loc: new go.Point(420, 200) },
			{ key: "C", group: "Psi", loc: new go.Point(250, 225) },
			{ key: "D", group: "Omega", loc: new go.Point(270, 325) },
			{ key: "E", group: "Phi", loc: new go.Point(120, 225) },
			{ key: "F", group: "Omega", loc: new go.Point(200, 350) },
			{ key: "G", loc: new go.Point(180, 450) },
			{ key: "Chi", isGroup: true },
			{ key: "Psi", isGroup: true, group: "Chi" },
			{ key: "Phi", isGroup: true, group: "Psi" },
			{ key: "Omega", isGroup: true, group: "Psi" }
		],
		[  // link data
			{ from: "A", to: "B" },
			{ from: "A", to: "C" },
			{ from: "A", to: "C" },
			{ from: "B", to: "B" },
			{ from: "B", to: "C" },
			{ from: "B", to: "Omega" },
			{ from: "C", to: "A" },
			{ from: "C", to: "Psi" },
			{ from: "C", to: "D" },
			{ from: "D", to: "F" },
			{ from: "E", to: "F" },
			{ from: "F", to: "G" }
		]);
});
