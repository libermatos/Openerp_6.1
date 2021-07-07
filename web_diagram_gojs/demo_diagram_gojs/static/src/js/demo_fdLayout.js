/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_fdLayout", function(self, result, container){
	// define a custom ForceDirectedLayout for this sample
	function DemoForceDirectedLayout() {
		go.ForceDirectedLayout.call(this);
	}
	go.Diagram.inherit(DemoForceDirectedLayout, go.ForceDirectedLayout);

	// Override the makeNetwork method to also initialize
	// ForceDirectedVertex.isFixed from the corresponding Node.isSelected.
	DemoForceDirectedLayout.prototype.makeNetwork = function(coll) {
		// call base method for standard behavior
		var net = go.ForceDirectedLayout.prototype.makeNetwork.call(this, coll);
		net.vertexes.each(function(vertex) {
			var node = vertex.node;
			if (node !== null) vertex.isFixed = node.isSelected;
		});
		return net;
	}; // end DemoForceDirectedLayout class

	var $ = go.GraphObject.make;  // for conciseness in defining templates

	myDiagram =
		$(go.Diagram, container,  // must be the ID or reference to div
		{
			// start everything in the middle of the viewport
			initialContentAlignment: go.Spot.Center,
			autoScale: go.Diagram.Uniform,  // zoom to make everything fit in the viewport
			layout: new DemoForceDirectedLayout()  // use custom layout
			// other Layout properties are set by the layout function, defined below
		});

	// define the Node template
	myDiagram.nodeTemplate =
		$(go.Node, "Spot",
			// make sure the Node.location is different from the Node.position
			{ locationSpot: go.Spot.Center },
			new go.Binding("text", "text"),  // for sorting
			$(go.Shape, "Ellipse",
				{ fill: "lightgray",
					stroke: "black",
					desiredSize: new go.Size(30, 30) },
				new go.Binding("fill", "fill")),
			$(go.TextBlock,
				new go.Binding("text", "text"))
		);

	// define the Link template
	myDiagram.linkTemplate =
		$(go.Link,
			{ selectable: false },
		$(go.Shape));

	// generate a tree using the default values
	rebuildGraph();

	function rebuildGraph() {
		var minNodes = 20;
		minNodes = parseInt(minNodes, 10);

		var maxNodes = 100;
		maxNodes = parseInt(maxNodes, 10);

		var minChil = 1;
		minChil = parseInt(minChil, 10);

		var maxChil = 10;
		maxChil = parseInt(maxChil, 10);

		generateTree(minNodes, maxNodes, minChil, maxChil);
	}

	function generateTree(minNodes, maxNodes, minChil, maxChil) {
		myDiagram.startTransaction("generateTree");
		// replace the diagram's model's nodeDataArray
		generateNodes(minNodes, maxNodes);
		// replace the diagram's model's linkDataArray
		generateLinks(minChil, maxChil);
		// perform a diagram layout with the latest parameters
		layout();
		myDiagram.commitTransaction("generateTree");
	}

	// Creates a random number of randomly colored nodes.
	function generateNodes(min, max) {
		var nodeArray = [];
		if (isNaN(min) || min < 0) min = 0;
		if (isNaN(max) || max < min) max = min;
		var numNodes = Math.floor(Math.random() * (max - min + 1)) + min;
		for (var i = 0; i < numNodes; i++) {
		  nodeArray.push({
			key: i,
			text: i.toString(),
			fill: go.Brush.randomColor()
		  });
		}

		// randomize the node data
		for (i = 0; i < nodeArray.length; i++) {
		  var swap = Math.floor(Math.random() * nodeArray.length);
		  var temp = nodeArray[swap];
		  nodeArray[swap] = nodeArray[i];
		  nodeArray[i] = temp;
		}

		// set the nodeDataArray to this array of objects
		myDiagram.model.nodeDataArray = nodeArray;
	}

	// Takes the random collection of nodes and creates a random tree with them.
	// Respects the minimum and maximum number of links from each node.
	// (The minimum can be disregarded if we run out of nodes to link to)
	function generateLinks(min, max) {
		if (myDiagram.nodes.count < 2) return;
		if (isNaN(min) || min < 1) min = 1;
		if (isNaN(max) || max < min) max = min;
		var linkArray = [];
		// make two Lists of nodes to keep track of where links already exist
		var nit = myDiagram.nodes;
		var nodes = new go.List(go.Node);
		nodes.addAll(nit);
		var available = new go.List(go.Node);
		available.addAll(nodes);
		for (var i = 0; i < nodes.length; i++) {
			var next = nodes.elt(i);
			available.remove(next)
			var children = Math.floor(Math.random() * (max - min + 1)) + min;
			for (var j = 1; j <= children; j++) {
				if (available.length === 0) break;
				var to = available.elt(0);
				available.remove(to);
				// get keys from the Node.text strings
				var nextKey = parseInt(next.text, 10);
				var toKey = parseInt(to.text, 10);
				linkArray.push({ from: nextKey, to: toKey });
			}
		}
		myDiagram.model.linkDataArray = linkArray;
	}

	// Update the layout from the controls.
	// Changing the properties will invalidate the layout.
	function layout() {
		myDiagram.startTransaction("changed Layout");
		var lay = myDiagram.layout;

		var maxIter = 100;
		lay.maxIterations = maxIter;

		var epsilon = 1;
		epsilon = parseFloat(epsilon, 10);
		lay.epsilon = epsilon;

		var infinity = 1000;
		infinity = parseFloat(infinity, 10);
		lay.infinity = infinity;

		var arrangement = "100 100";
		var arrangementSpacing = new go.Size();
		arrangement = arrangement.split(" ", 2);
		arrangementSpacing.width = parseFloat(arrangement[0], 10);
		arrangementSpacing.height = parseFloat(arrangement[1], 10);
		lay.arrangementSpacing = arrangementSpacing;

		var charge = 150;
		charge = parseFloat(charge, 10);
		lay.defaultElectricalCharge = charge;

		var mass = 0;
		mass = parseFloat(mass, 10);
		lay.defaultGravitationalMass = mass;

		var stiffness = 0.05;
		stiffness = parseFloat(stiffness, 10);
		lay.defaultSpringStiffness = stiffness;

		var length = 50;
		length = parseFloat(length, 10);
		lay.defaultSpringLength = length;

		myDiagram.commitTransaction("changed Layout");
	}
});
