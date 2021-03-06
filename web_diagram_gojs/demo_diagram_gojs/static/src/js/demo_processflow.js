/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_processflow", function(self, result, container){
	var $ = go.GraphObject.make;  // for more concise visual tree definitions

	myDiagram =
		$(go.Diagram, container,
		{
			// position the graph in the middle of the diagram
			initialContentAlignment: go.Spot.Center,
			"grid.visible": true,
			"grid.gridCellSize": new go.Size(30, 20),
			"draggingTool.isGridSnapEnabled": true,
			"resizingTool.isGridSnapEnabled": true,
			"rotatingTool.snapAngleMultiple": 90,
			"rotatingTool.snapAngleEpsilon": 45,
			"undoManager.isEnabled": true
		});

	myDiagram.nodeTemplateMap.add("Process",
		$(go.Node, "Auto",
		{
			locationSpot: new go.Spot(0.5, 0.5, -2/3, -2/3), locationObjectName: "SHAPE",
			resizable: true, resizeObjectName: "SHAPE" },
			new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
		$(go.Shape, "Cylinder1",
		{ name: "SHAPE",
			strokeWidth: 2,
			fill: $(go.Brush, go.Brush.Linear,
					{ start: go.Spot.Left, end: go.Spot.Right, 0: "gray", 0.5: "white", 1: "gray" }),
			minSize: new go.Size(50, 50),
			portId: "", fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides
		},
		new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
		$(go.TextBlock,
		{ alignment: go.Spot.Center, textAlign: "center", margin: 5, editable: true },
		new go.Binding("text").makeTwoWay())
	));

	myDiagram.nodeTemplateMap.add("Valve",
		$(go.Node, "Vertical",
			{
				locationSpot: new go.Spot(0.5, 0, 0, 32/3), locationObjectName: "SHAPE",
				selectionObjectName: "SHAPE",
				rotatable: true },
			new go.Binding("angle").makeTwoWay(),
			new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
			$(go.TextBlock,
			{
				alignment: go.Spot.Center, textAlign: "center", margin: 5,
				editable: true },
				new go.Binding("text").makeTwoWay()),
			$(go.Shape,
			{ name: "SHAPE",
				geometryString: "F1 M0 0 L40 20 40 0 0 20z M20 10 L20 30 M12 30 L28 30",
				strokeWidth: 2,
				fill: $(go.Brush, go.Brush.Linear, { 0: "gray", 0.35: "white", 0.7: "gray" }),
				portId: "", fromSpot: new go.Spot(1, 0.35), toSpot: new go.Spot(0, 0.35) })
		));

	myDiagram.linkTemplate =
	$(go.Link,
		{ routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10,
			reshapable: true, toShortLength: 7 },
		new go.Binding("points").makeTwoWay(),
		$(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 5 }),
		$(go.Shape, { isPanelMain: true, stroke: "gray", strokeWidth: 3 }),
		$(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 1, name: "PIPE", strokeDashArray: [10, 10] }),
		$(go.Shape, { toArrow: "Triangle", fill: "black", stroke: null })
	);

	load();

	loop();  // animate some flow through the pipes

	function loop() {
		var diagram = myDiagram;
		setTimeout(function() {
			if(diagram.div && container == diagram.div.id){
				var oldskips = diagram.skipsUndoManager;
				diagram.skipsUndoManager = true;
				diagram.links.each(function(link) {
					var shape = link.findObject("PIPE");
					var off = shape.strokeDashOffset;
					off -= 2;
					shape.strokeDashOffset = (off <= 0) ? 20 : off;
				});
				diagram.skipsUndoManager = oldskips;
				loop();
			}
			else
				clearTimeout();
				return;
		}, 100);
	}
	function load() {
		myDiagram.model = go.Model.fromJson({
			"class": "go.GraphLinksModel",
			"nodeDataArray": [
				{"key":"P1", "category":"Process", "pos":"150 120", "text":"Process"},
				{"key":"P2", "category":"Process", "pos":"330 320", "text":"Tank"},
				{"key":"V1", "category":"Valve", "pos":"270 120", "text":"V1"},
				{"key":"P3", "category":"Process", "pos":"150 420", "text":"Pump"},
				{"key":"V2", "category":"Valve", "pos":"150 280", "text":"VM", "angle":270},
				{"key":"V3", "category":"Valve", "pos":"270 420", "text":"V2", "angle":180},
				{"key":"P4", "category":"Process", "pos":"450 140", "text":"Reserve Tank"},
				{"key":"V4", "category":"Valve", "pos":"390 60", "text":"VA"},
				{"key":"V5", "category":"Valve", "pos":"450 260", "text":"VB", "angle":90}
			],
			"linkDataArray": [
				{"from":"P1", "to":"V1", "points":[180.5,120.5,190.5,120.5,215.25,120.5,215.25,120.7,240,120.7,250,120.7]},
				{"from":"P3", "to":"V2", "points":[151,395.5,151,385.5,151,347.75,150.7,347.75,150.7,310,150.7,300]},
				{"from":"V2", "to":"P1", "points":[150.7,258,150.7,248,150.7,201.75,151,201.75,151,155.5,151,145.5]},
				{"from":"P2", "to":"V3", "points":[331,345.5,331,355.5,331,419.3,315.5,419.3,300,419.3,290,419.3]},
				{"from":"V3", "to":"P3", "points":[248,420,238,420,212,420,212,420,186,420,176,420]},
				{"from":"V1", "to":"V4", "points":[292,120.7,302,120.7,331,120.7,331,60.7,360,60.7,370,60.7]},
				{"from":"V4", "to":"P4", "points":[412,60.7,422,60.7,451,60.7,451,83.1,451,105.5,451,115.5]},
				{"from":"V1", "to":"P2", "points":[292,120.7,302,120.7,331,120.7,331,203.1,331,285.5,331,295.5]},
				{"from":"P4", "to":"V5", "points":[451,166,451,176,451,203,451,203,451,230,451,240]},
				{"from":"V5", "to":"P2", "points":[450.3,282,450.3,292,450.3,321,408.15,321,366,321,356,321]}
			]
		});
	}
});
