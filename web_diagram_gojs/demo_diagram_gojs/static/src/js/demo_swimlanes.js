/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_swimlanes", function(self, result, container){
	// These parameters need to be set before defining the templates.

	// this controls whether the swimlanes are horizontal stacked vertically, or the other way:
	var HORIZONTAL = true;
	// this controls the minimum length of any swimlane
	var MINLENGTH = 200;
	// this controls the minimum breadth of any swimlane
	var MINBREADTH = 100;

	// compute the minimum length needed to hold all of the subgraphs
	function computeMinPlaceholderSize(diagram) {
		var len = MINLENGTH;
		diagram.nodes.each(function(group) {
			if (!(group instanceof go.Group)) return;
			var holder = group.placeholder;
			if (holder !== null) {
				var sz = holder.actualBounds;
				len = Math.max(len, (HORIZONTAL ? sz.width : sz.height));
			}
		});
		return (HORIZONTAL ? new go.Size(len, NaN) : new go.Size(NaN, len));
	}

	// get the minimum placeholder size for a particular Group;
	// when group is null, return the minimum size
	function computePlaceholderSize(group) {
		if (group instanceof go.Group) {
			var holder = group.placeholder;
			if (holder !== null) {
				return holder.actualBounds.size;
			}
		}
		return (HORIZONTAL ? new go.Size(MINLENGTH, MINBREADTH) : new go.Size(MINBREADTH, MINLENGTH));
	}

	// define a custom ResizingTool to limit how far one can shrink a Group
	function GroupResizingTool() {
		go.ResizingTool.call(this);
	}
	go.Diagram.inherit(GroupResizingTool, go.ResizingTool);

	GroupResizingTool.prototype.isLengthening = function() {
		return (this.handle.alignment === (HORIZONTAL ? go.Spot.Right : go.Spot.Bottom));
	};

	GroupResizingTool.prototype.computeMinSize = function() {
		var msz = computePlaceholderSize(null);  // get the minimum size
		if (this.isLengthening()) {  // compute the minimum length of all lanes
			var sz = computeMinPlaceholderSize(this.diagram);
			if (HORIZONTAL) {
				msz.width = Math.max(msz.width, sz.width);
			} else {
				msz.height = Math.max(msz.height, sz.height);
			}
		} else {  // find the minimum size of this single lane
			var sz = computePlaceholderSize(this.adornedObject.part);
			msz.width = Math.max(msz.width, sz.width);
			msz.height = Math.max(msz.height, sz.height);
		}
		return msz;
	};

	GroupResizingTool.prototype.resize = function(newr) {
		if (this.isLengthening()) {  // changing the length of all of the lanes
			myDiagram.nodes.each(function(group) {
				if (!(group instanceof go.Group)) return;
				var shape = group.findObject("SHAPE");
				if (shape !== null) {  // set its desiredSize, but leave the other direction alone
					if (HORIZONTAL) {
						shape.width = newr.width;
					} else {
						shape.height = newr.height;
					}
				}
			});
		} else {  // changing the breadth and length of a single lane
			go.ResizingTool.prototype.resize.call(this, newr);
		}
	};
	// end GroupResizingTool class

	// define a custom grid layout that makes sure the length of each lane is the same
	// and that each lane is broad enough to hold its subgraph
	function StackLayout() {
		go.GridLayout.call(this);
	}
	go.Diagram.inherit(StackLayout, go.GridLayout);

	StackLayout.prototype.doLayout = function(coll) {
		var diagram = this.diagram;
		if (diagram === null) return;
		diagram.startTransaction("StackLayout");
		// make sure all of the Group Shapes are big enough
		var minsize = computeMinPlaceholderSize(diagram);
		diagram.nodes.each(function(group) {
			if (!(group instanceof go.Group)) return;
			var shape = group.findObject("SHAPE");
			if (shape !== null) {  // change the desiredSize to be big enough in both directions
				var sz = computePlaceholderSize(group);
				if (HORIZONTAL) {
					shape.width = (isNaN(shape.width) ? minsize.width : Math.max(shape.width, minsize.width));
					if (!isNaN(shape.height)) shape.height = Math.max(shape.height, sz.height);
				} else {
					if (!isNaN(shape.width)) shape.width = Math.max(shape.width, sz.width);
					shape.height = (isNaN(shape.height) ? minsize.height : Math.max(shape.height, minsize.height));
				}
				var cell = group.resizeCellSize;
				if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0) shape.width = Math.ceil(shape.width / cell.width) * cell.width;
				if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0) shape.height = Math.ceil(shape.height / cell.height) * cell.height;
			}
		});
		// now do all of the usual stuff, according to whatever properties have been set on this GridLayout
		go.GridLayout.prototype.doLayout.call(this, coll);
		diagram.commitTransaction("StackLayout");
	};
	// end StackLayout class

	var $ = go.GraphObject.make;
	myDiagram =
		$(go.Diagram, container,
		{
			// start everything in the middle of the viewport
			initialContentAlignment: go.Spot.Center,
			// use a custom ResizingTool (along with a custom ResizeAdornment on each Group)
			resizingTool: new GroupResizingTool(),
			// use a simple layout that ignores links to stack the top-level Groups on top of each other
			layout:
				$(StackLayout,
				{
					cellSize: new go.Size(1, 1),
					spacing: new go.Size(0, 0),
					wrappingColumn: (HORIZONTAL ? 1 : Infinity),
					wrappingWidth: Infinity,
					isViewportSized: false
				}),
			// don't allow dropping onto the diagram's background
			mouseDrop: function(e) { e.diagram.currentTool.doCancel(); },
			// a clipboard copied node is pasted into the original node's group (i.e. lane).
			"commandHandler.copiesGroupKey": true,
			// automatically re-layout the swim lanes after dragging the selection
			"SelectionMoved": relayoutDiagramStack,  // this DiagramEvent listener is
			"SelectionCopied": relayoutDiagramStack, // defined below
			// enable undo & redo
			"undoManager.isEnabled": true
		});

	// When a Node has been moved, make sure all of the top-level Groups get laid out again in a stack
	function relayoutDiagramStack(e) {
		myDiagram.layout.invalidateLayout();  // but don't invalidate all Layouts that are in Groups
		myDiagram.layoutDiagram();
	}

	// this is a Part.dragComputation function for limiting where a Node may be dragged
	function stayInGroup(part, pt, gridpt) {
		// don't constrain top-level nodes
		var grp = part.containingGroup;
		if (grp === null) return pt;
		// try to stay within the background Shape of the Group
		var back = grp.findObject("SHAPE");
		if (back === null) return pt;
		// allow dragging a Node out of a Group if the Shift key is down
		if (part.diagram.lastInput.shift) return pt;
		var b = part.actualBounds;
		var p1 = back.getDocumentPoint(go.Spot.TopLeft);
		var p2 = back.getDocumentPoint(go.Spot.BottomRight);
		// find the padding inside the group's placeholder that is around the member parts
		var m = grp.placeholder.padding;
		// now limit the location appropriately
		var x = Math.max(p1.x + m.left, Math.min(pt.x, p2.x - m.right - b.width - 1));
		var y = Math.max(p1.y + m.top, Math.min(pt.y, p2.y - m.bottom - b.height - 1));
		return new go.Point(x, y);
	}

	myDiagram.nodeTemplate =
		$(go.Node, "Auto",
			$(go.Shape, "Rectangle",
				{ fill: "white", portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true }),
			$(go.TextBlock, { margin: 5 },
			new go.Binding("text", "key")),
			// limit dragging of Nodes to stay within the containing Group, defined above
			{
				dragComputation: stayInGroup,
				mouseDrop: function (e, node) {  // dropping a copy of some Nodes and Links onto this Node adds them to this Node's Group
					if (!e.shift && !e.control) return;  // cannot change groups with an unmodified drag-and-drop
						var grp = node.containingGroup;
						if (grp !== null) {
							var ok = grp.addMembers(node.diagram.selection, true);
							if (!ok) grp.diagram.currentTool.doCancel();
						}
				},
				layoutConditions: go.Part.LayoutAdded | go.Part.LayoutNodeSized
			}
		);

	// each Group is a "swimlane" with a header on the left and a resizable lane on the right
	myDiagram.groupTemplate =
		$(go.Group, HORIZONTAL ? "Horizontal" : "Vertical",
		{
				movable: false, copyable: false, deletable: false,  // can't move or copy or delete lanes
				avoidable: false,
				selectionObjectName: "SHAPE",  // selecting a lane causes the body of the lane to be highlit, not the label
				resizable: true, resizeObjectName: "SHAPE",  // the custom resizeAdornmentTemplate only permits two kinds of resizing
				layout: $(go.LayeredDigraphLayout,  // automatically lay out the lane's subgraph
					{ direction: HORIZONTAL ? 0 : 90, columnSpacing: 10, layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource }),
				computesBoundsAfterDrag: true,  // needed to prevent recomputing Group.placeholder bounds too soon
				computesBoundsIncludingLinks: false,
				computesBoundsIncludingLocation: true,
				mouseDrop: function (e, grp) {  // dropping a copy of some Nodes and Links onto this Group adds them to this Group
					if (!e.shift && !e.control) return;  // cannot change groups with an unmodified drag-and-drop
					var ok = grp.addMembers(grp.diagram.selection, true);
					if (!ok) grp.diagram.currentTool.doCancel();
				}
			},
			// the lane header consisting of a Shape and a TextBlock
			$(go.Panel, "Horizontal",
				{ angle: HORIZONTAL ? 270 : 0,  // maybe rotate the header to read sideways going up
				alignment: go.Spot.Center },
				$(go.Shape, "Diamond",
					{ width: 8, height: 8 },
						new go.Binding("fill", "color")),
				$(go.TextBlock,  // the lane label
					{ font: "bold 16pt sans-serif" },
						new go.Binding("text", "key"))
			),  // end Horizontal Panel
			$(go.Panel, "Auto",  // the lane consisting of a background Shape and a Placeholder representing the subgraph
				$(go.Shape, "Rectangle",
					{ name: "SHAPE", fill: "white", minSize: computePlaceholderSize(null) },
					new go.Binding("fill", "color")),
				$(go.Placeholder,
					{ padding: 10, alignment: go.Spot.TopLeft })
			)  // end Auto Panel
		);  // end Group

		// define a custom resize adornment that only has a single resize handle
		myDiagram.groupTemplate.resizeAdornmentTemplate =
		$(go.Adornment, "Spot",
			$(go.Placeholder),
			$(go.Shape,  // for changing the length of a lane
			{
				alignment: HORIZONTAL ? go.Spot.Right: go.Spot.Bottom,
				desiredSize: HORIZONTAL ? new go.Size(7, 50) : new go.Size(50, 7),
				fill: "lightblue", stroke: "dodgerblue",
				cursor: HORIZONTAL ? "col-resize" : "row-resize"
			}),
			$(go.Shape,  // for changing the breadth of a lane
				{
					alignment: HORIZONTAL ? go.Spot.Bottom : go.Spot.Right,
					desiredSize: HORIZONTAL ? new go.Size(50, 7) : new go.Size(7, 50),
					fill: "lightblue", stroke: "dodgerblue",
					cursor: HORIZONTAL ? "row-resize" : "col-resize"
				})
		);

	myDiagram.linkTemplate =
		$(go.Link,
			{ routing: go.Link.AvoidsNodes, corner: 5 },
			{ relinkableFrom: true, relinkableTo: true },
			$(go.Shape),
			$(go.Shape, { toArrow: "Standard" }),
			{ // dropping a copy of some Nodes and Links onto this Link adds them to this Link's Group
				mouseDrop: function (e, link) {
					if (!e.shift && !e.control) return;  // cannot change groups with an unmodified drag-and-drop
					var grp = link.containingGroup;
					if (grp !== null) {
						var ok = grp.addMembers(link.diagram.selection, true);
						if (!ok) grp.diagram.currentTool.doCancel();
					}
				},
				layoutConditions: go.Part.LayoutAdded
			}
		);

	// define some sample graphs in some of the lanes
	myDiagram.model = new go.GraphLinksModel(
		[ // node data
			{ key: "Lane1", isGroup: true, color: "lightblue" },
			{ key: "Lane2", isGroup: true, color: "lightgreen" },
			{ key: "Lane3", isGroup: true, color: "lightyellow" },
			{ key: "Lane4", isGroup: true, color: "orange" },
			{ key: "oneA", group: "Lane1" },
			{ key: "oneB", group: "Lane1" },
			{ key: "oneC", group: "Lane1" },
			{ key: "oneD", group: "Lane1" },
			{ key: "twoA", group: "Lane2" },
			{ key: "twoB", group: "Lane2" },
			{ key: "twoC", group: "Lane2" },
			{ key: "twoD", group: "Lane2" },
			{ key: "twoE", group: "Lane2" },
			{ key: "twoF", group: "Lane2" },
			{ key: "twoG", group: "Lane2" },
			{ key: "fourA", group: "Lane4" },
			{ key: "fourB", group: "Lane4" },
			{ key: "fourC", group: "Lane4" },
			{ key: "fourD", group: "Lane4" },
		],
		[ // link data
			{ from: "oneA", to: "oneB" },
			{ from: "oneA", to: "oneC" },
			{ from: "oneB", to: "oneD" },
			{ from: "oneC", to: "oneD" },
			{ from: "twoA", to: "twoB" },
			{ from: "twoA", to: "twoC" },
			{ from: "twoA", to: "twoF" },
			{ from: "twoB", to: "twoD" },
			{ from: "twoC", to: "twoD" },
			{ from: "twoD", to: "twoG" },
			{ from: "twoE", to: "twoG" },
			{ from: "twoF", to: "twoG" },
			{ from: "fourA", to: "fourB" },
			{ from: "fourB", to: "fourC" },
			{ from: "fourC", to: "fourD" }
		]);
});
