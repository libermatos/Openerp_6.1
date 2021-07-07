/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_incremental_tree", function(self, result, container){
	var $ = go.GraphObject.make;  // for conciseness in defining templates

	myDiagram =
		$(go.Diagram, container,  // must name or refer to the DIV HTML element
		{
			autoScale: go.Diagram.UniformToFill,
			contentAlignment: go.Spot.Center,
			layout: $(go.ForceDirectedLayout),
			// moving and copying nodes also moves and copies their subtrees
			"commandHandler.copiesTree": true,  // for the copy command
			"commandHandler.deletesTree": true, // for the delete command
			"draggingTool.dragsTree": true,  // dragging for both move and copy
			"undoManager.isEnabled": true
		});

	// Define the Node template.
	// This uses a Spot Panel to position a button relative
	// to the ellipse surrounding the text.
	myDiagram.nodeTemplate =
		$(go.Node, "Spot",
		{
		  selectionObjectName: "PANEL",
		  isTreeExpanded: false,
		  isTreeLeaf: false
		},
		// the node's outer shape, which will surround the text
		$(go.Panel, "Auto",
			{ name: "PANEL" },
			$(go.Shape, "Ellipse",
			{ fill: "whitesmoke", stroke: "black" },
			new go.Binding("fill", "color")),
			$(go.TextBlock,
			{ font: "12pt sans-serif", margin: 5 },
			new go.Binding("text", "key"))
		),
		// the expand/collapse button, at the top-right corner
		$("TreeExpanderButton",
			{
				alignment: go.Spot.TopRight,
				alignmentFocus: go.Spot.Center,
				// customize the expander behavior to
				// create children if the node has never been expanded
				click: function (e, obj) {  // OBJ is the Button
					var node = obj.part;  // get the Node containing this Button
					if (node === null) return;
					e.handled = true;
					var diagram = node.diagram;
					diagram.startTransaction("CollapseExpandTree");
					// this behavior is specific to this incrementalTree sample:
					var data = node.data;
					if (!data.everExpanded) {
					  // only create children once per node
					  diagram.model.setDataProperty(data, "everExpanded", true);
					  var numchildren = createSubTree(data);
					  if (numchildren === 0) {  // now known no children: don't need Button!
						obj.visible = false;
					  }
					}
					// this behavior is generic for most expand/collapse tree buttons:
					node.isTreeExpanded = !node.isTreeExpanded;  // expand or collapse
					diagram.commitTransaction("CollapseExpandTree");
				  }
			}
		)	// end TreeExpanderButton
	);	// end Node

	// create the model with a root node data
	myDiagram.model = new go.TreeModel([
		{ key: 0, color: "lightgreen", everExpanded: false }
	]);

	// This dynamically creates the immediate children for a node.
	// The sample assumes that we have no idea of whether there are any children
	// for a node until we look for them the first time, which happens
	// upon the first tree-expand of a node.
	function createSubTree(parentdata) {
		var numchildren = Math.floor(Math.random() * 10);
		if (myDiagram.nodes.count <= 1) {
			numchildren += 1;  // make sure the root node has at least one child
		}
		// create several node data objects and add them to the model
		var model = myDiagram.model;
		var parent = myDiagram.findNodeForData(parentdata);
		for (var i = 0; i < numchildren; i++) {
			var childdata = {
				key: model.nodeDataArray.length,
				parent: parentdata.key,
				color: go.Brush.randomColor()
			};
			// add to model.nodeDataArray and create a Node
			model.addNodeData(childdata);
			// position the new child node close to the parent
			var child = myDiagram.findNodeForData(childdata);
			child.location = parent.location;
		}
		return numchildren;
	}
});
