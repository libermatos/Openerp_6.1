/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_cLayout", function(self, result, container){
	function rebuildGraph() {
		var numNodes = 16;
		var width = 25;
		var height = 25
		var randSizes = true;
		var circ = false;
		var cyclic = false;
		var minLinks = 1;
		var maxLinks = 2
		generateCircle(numNodes, width, height, minLinks, maxLinks, randSizes, circ, cyclic);
	}

	function generateCircle(numNodes, width, height, minLinks, maxLinks, randSizes, circ, cyclic) {
		myDiagram.startTransaction("generateCircle");
		// replace the diagram's model's nodeDataArray
		generateNodes(numNodes, width, height, randSizes, circ);
		// replace the diagram's model's linkDataArray
		generateLinks(minLinks, maxLinks, cyclic);
		// force a diagram layout
		layout();
		myDiagram.commitTransaction("generateCircle");
	}

	function generateNodes(numNodes, width, height, randSizes, circ) {
		var nodeArray = [];
		for (var i = 0; i < numNodes; i++) {
			var size;
			if (randSizes) {
				size = new go.Size(Math.floor(Math.random() * (65 - width + 1)) + width, Math.floor(Math.random() * (65 - height + 1)) + height);
			} else {
				size = new go.Size(width, height);
			}

			if (circ) size.height = size.width;

			var figure = "Rectangle";
			if (circ) figure = "Ellipse";

			nodeArray.push({
				key: i,
				text: i.toString(),
				figure: figure,
				fill: go.Brush.randomColor(),
				size: size
			});
		}

		// randomize the data, to help demonstrate sorting
		for (i = 0; i < nodeArray.length; i++) {
			var swap = Math.floor(Math.random() * nodeArray.length);
			var temp = nodeArray[swap];
			nodeArray[swap] = nodeArray[i];
			nodeArray[i] = temp;
		}

		// set the nodeDataArray to this array of objects
		myDiagram.model.nodeDataArray = nodeArray;
	}

	function generateLinks(min, max, cyclic) {
		if (myDiagram.nodes.count < 2) return;
		var linkArray = [];
		var nit = myDiagram.nodes;
		var nodes = new go.List(go.Node);
		nodes.addAll(nit);
		var num = nodes.length;
		if (cyclic) {
		  for (var i = 0; i < num; i++) {
			if (i >= num - 1) {
			  linkArray.push({ from: i, to: 0 });
			} else {
			  linkArray.push({ from: i, to: i + 1 });
			}
		  }
		} else {
		  if (isNaN(min) || min < 0) min = 0;
		  if (isNaN(max) || max < min) max = min;
		  for (var i = 0; i < num; i++) {
			var next = nodes.elt(i);
			var children = Math.floor(Math.random() * (max - min + 1)) + min;
			for (var j = 1; j <= children; j++) {
			  var to = nodes.elt(Math.floor(Math.random() * num));
			  // get keys from the Node.text strings
			  var nextKey = parseInt(next.text, 10);
			  var toKey = parseInt(to.text, 10);
			  if (nextKey !== toKey) {
				linkArray.push({ from: nextKey, to: toKey });
			  }
			}
		  }
		}
		myDiagram.model.linkDataArray = linkArray;
	}

	// Update the layout from the controls, and then perform the layout again
	function layout() {
		myDiagram.startTransaction("change Layout");
		var lay = myDiagram.layout;

		var radius = NaN;
		lay.radius = radius;

		var aspectRatio = 1
		lay.aspectRatio = aspectRatio;

		var startAngle = 0;
		lay.startAngle = startAngle;

		var sweepAngle = 360;
		lay.sweepAngle = sweepAngle;

		var spacing = 6;
		lay.spacing = spacing;

		var arrangement = "ConstantSpacing";
		lay.arrangement = go.CircularLayout.ConstantSpacing;

		var diamFormula = "Pythagorean";
		lay.nodeDiameterFormula = go.CircularLayout.Pythagorean;

		var direction = "Clockwise";
		lay.direction = go.CircularLayout.Clockwise;

		var sorting = "Forwards";
		lay.sorting = go.CircularLayout.Forwards;

		myDiagram.commitTransaction("change Layout");
	}

	var $ = go.GraphObject.make;  // for conciseness in defining templates

	myDiagram =
		$(go.Diagram, container,  // must be the ID or reference to div
		{
			// start everything in the middle of the viewport
			initialContentAlignment: go.Spot.Center,
			initialAutoScale: go.Diagram.UniformToFill,
			layout: $(go.CircularLayout)
			// other properties are set by the layout function, defined below
		});

	// define the Node template
	myDiagram.nodeTemplate =
		$(go.Node, "Spot",
		// make sure the Node.location is different from the Node.position
			{ locationSpot: go.Spot.Center },
			new go.Binding("text", "text"),  // for sorting
			$(go.Shape, "Ellipse",  // the default value for the Shape.figure property
				{ fill: "lightgray",
				stroke: "black",
				desiredSize: new go.Size(30, 30) },
				new go.Binding("figure", "figure"),
				new go.Binding("fill", "fill"),
				new go.Binding("desiredSize", "size")),
			$(go.TextBlock,
				new go.Binding("text", "text"))
		);

	// define the Link template
	myDiagram.linkTemplate =
		$(go.Link,
			{ selectable: false },
		$(go.Shape));

	// generate a circle using the default values
	rebuildGraph();
});
