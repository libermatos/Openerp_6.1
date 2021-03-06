/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_taperedlinks", function(self, result, container){
	function TaperedLink() {
		go.Link.call(this);
	}
	go.Diagram.inherit(TaperedLink, go.Link);

	// produce a Geometry from the Link's route
	TaperedLink.prototype.makeGeometry = function() {
		// maybe use the standard geometry for this route, instead?
		var numpts = this.pointsCount;
		if (numpts < 4 || this.computeCurve() !== go.Link.Bezier) {
		  return go.Link.prototype.makeGeometry.call(this);
		}

		var p0 = this.getPoint(0);
		var p1 = this.getPoint((numpts > 4) ? 2 : 1);
		var p2 = this.getPoint((numpts > 4) ? numpts - 3 : 2);
		var p3 = this.getPoint(numpts - 1);
		var fromHoriz = Math.abs(p0.y - p1.y) < Math.abs(p0.x - p1.x);
		var toHoriz = Math.abs(p2.y - p3.y) < Math.abs(p2.x - p3.x);

		var p0x = p0.x + (fromHoriz ? 0 : -4);
		var p0y = p0.y + (fromHoriz ? -4 : 0);
		var p1x = p1.x + (fromHoriz ? 0 : -3);
		var p1y = p1.y + (fromHoriz ? -3 : 0);
		var p2x = p2.x + (toHoriz ? 0 : -2);
		var p2y = p2.y + (toHoriz ? -2 : 0);
		var p3x = p3.x + (toHoriz ? 0 : -1);
		var p3y = p3.y + (toHoriz ? -1 : 0);

		var fig = new go.PathFigure(p0x, p0y, true);  // filled
		var seg1 = new go.PathSegment(go.PathSegment.Bezier, p3x, p3y, p1x, p1y, p2x, p2y);
		fig.segments.add(seg1);

		p0x = p0.x + (fromHoriz ? 0 : 4);
		p0y = p0.y + (fromHoriz ? 4 : 0);
		p1x = p1.x + (fromHoriz ? 0 : 3);
		p1y = p1.y + (fromHoriz ? 3 : 0);
		p2x = p2.x + (toHoriz ? 0 : 2);
		p2y = p2.y + (toHoriz ? 2 : 0);
		p3x = p3.x + (toHoriz ? 0 : 1);
		p3y = p3.y + (toHoriz ? 1: 0);

		fig.segments.add(new go.PathSegment(go.PathSegment.Line, p3x, p3y));

		var seg2 = new go.PathSegment(go.PathSegment.Bezier, p0x, p0y, p2x, p2y, p1x, p1y).close();
		fig.segments.add(seg2);

		var geo = new go.Geometry();
		geo.figures.add(fig);
		var offset = geo.normalize();
		return geo;
	};

	var $ = go.GraphObject.make;

	myDiagram =
		$(go.Diagram, container, // the ID of the DIV HTML element
		{
			initialContentAlignment: go.Spot.Center,
			layout: $(go.ForceDirectedLayout),
			"undoManager.isEnabled": true
		});

	// This controls whether links overlap each other at each side of the node,
	// or if the links are spread out on each side of the node.
	var SPREADLINKS = true;  // must be set before defining templates!

	myDiagram.nodeTemplate =
		$(go.Node, go.Panel.Auto,
			{ locationSpot: go.Spot.Center },
			$(go.Shape,
			{
				figure: "RoundedRectangle",
				parameter1: 10,
				fill: "orange",  // default fill color
				portId: "",
				fromLinkable: true,
				fromSpot: (SPREADLINKS ? go.Spot.AllSides : go.Spot.None),
				toLinkable: true,
				toSpot: (SPREADLINKS ? go.Spot.AllSides : go.Spot.None),
				cursor: "pointer"
			},
				new go.Binding("fill", "color")),
			$(go.TextBlock,
				{ margin: 10, font: "bold 12pt sans-serif" },
				new go.Binding("text"))
		);

	myDiagram.linkTemplate =
		$(TaperedLink,  // subclass of Link, defined below
			go.Link.Bezier,
			(SPREADLINKS ? go.Link.None : go.Link.Orthogonal),
			{
				fromEndSegmentLength: (SPREADLINKS ? 50 : 1),
				toEndSegmentLength: (SPREADLINKS ? 50 : 1),
				relinkableFrom: true,
				relinkableTo: true
			},
			$(go.Shape,
			{ isPanelMain: true, stroke: null, strokeWidth: 0 },
			new go.Binding("fill", "color"))
		);

	// create a few nodes and links
	myDiagram.model = new go.GraphLinksModel([
		{ key: 1, text: "one", color: "lightyellow" },
		{ key: 2, text: "two", color: "brown" },
		{ key: 3, text: "three", color: "green" },
		{ key: 4, text: "four", color: "slateblue" },
		{ key: 5, text: "five", color: "aquamarine" },
		{ key: 6, text: "six", color: "lightgreen" },
		{ key: 7, text: "seven" }
	], [
		{ from: 5, to: 6, color: "orange" },
		{ from: 1, to: 2, color: "red" },
		{ from: 1, to: 3, color: "blue" },
		{ from: 1, to: 4, color: "goldenrod" },
		{ from: 2, to: 5, color: "fuchsia" },
		{ from: 3, to: 5, color: "green" },
		{ from: 4, to: 5, color: "black" },
		{ from: 6, to: 7 }
	]);
});
