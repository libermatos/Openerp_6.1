/*
* ---------------------------------------------------------
* OpenERP web_diagram GoJS Demo
* ---------------------------------------------------------
*
* @author: Liber F. Matos Martin <lfmatos@gmail.com>
**/
openerp.register_gojs_handler("demo.diagram.gojs", "demo_entityrelationship", function(self, result, container){
	var $ = go.GraphObject.make;
	myDiagram =
		$(go.Diagram, container,  // must name or refer to the DIV HTML element
		{
			initialContentAlignment: go.Spot.Center,
			allowDelete: false,
			allowCopy: false,
			layout: $(go.ForceDirectedLayout),
			"undoManager.isEnabled": true
		});

	// define several shared Brushes
	var bluegrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
	var greengrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
	var redgrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
	var yellowgrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
	var lightgrad = $(go.Brush, go.Brush.Linear, { 1: "#E6E6FA", 0: "#FFFAF0" });

	// the template for each attribute in a node's array of item data
	var itemTempl =
		$(go.Panel, "Horizontal",
			$(go.Shape,
				{ desiredSize: new go.Size(10, 10) },
				new go.Binding("figure", "figure"),
				new go.Binding("fill", "color")),
			$(go.TextBlock,
				{ stroke: "#333333", font: "bold 14px sans-serif" },
				new go.Binding("text", "", go.Binding.toString))
		);

	// define the Node template, representing an entity
	myDiagram.nodeTemplate =
		$(go.Node, "Auto",  // the whole node panel
		{
			selectionAdorned: true,
			resizable: true,
			layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
			fromSpot: go.Spot.AllSides,
			toSpot: go.Spot.AllSides,
			isShadowed: true,
			shadowColor: "#C5C1AA"
		},
		new go.Binding("location", "location").makeTwoWay(),
		// define the node's outer shape, which will surround the Table
		$(go.Shape, "Rectangle",
			{ fill: lightgrad, stroke: "#756875", strokeWidth: 3 }),
		$(go.Panel, "Table",
			{ margin: 8, stretch: go.GraphObject.Fill },
			$(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
			// the table header
			$(go.TextBlock,
				{ row: 0, alignment: go.Spot.Center,
					font: "bold 16px sans-serif" },
				new go.Binding("text", "key")),
				// the list of Panels, each showing an attribute
			$(go.Panel, "Vertical",
				{ row: 1,
					padding: 3,
					alignment: go.Spot.TopLeft,
					defaultAlignment: go.Spot.Left,
					stretch: go.GraphObject.Horizontal,
					itemTemplate: itemTempl },
				new go.Binding("itemArray", "items"))
		)  // end Table Panel
	);  // end Node

	// define the Link template, representing a relationship
	myDiagram.linkTemplate =
		$(go.Link,  // the whole link panel
		{
			selectionAdorned: true,
			layerName: "Foreground",
			reshapable: true,
			routing: go.Link.AvoidsNodes,
			corner: 5,
			curve: go.Link.JumpOver },
		$(go.Shape,  // the link shape
		{
			isPanelMain: true,
			stroke: "#303B45",
			strokeWidth: 2.5 }),
		$(go.TextBlock,  // the "from" label
		{
			textAlign: "center",
			font: "bold 14px sans-serif",
			stroke: "#1967B3",
			segmentIndex: 0,
			segmentOffset: new go.Point(NaN, NaN),
			segmentOrientation: go.Link.OrientUpright },
		new go.Binding("text", "text")),
		$(go.TextBlock,  // the "to" label
		{
			textAlign: "center",
			font: "bold 14px sans-serif",
			stroke: "#1967B3",
			segmentIndex: -1,
			segmentOffset: new go.Point(NaN, NaN),
			segmentOrientation: go.Link.OrientUpright },
		new go.Binding("text", "toText"))
	);

	// create the model for the E-R diagram
	var nodeDataArray = [
		{
			key: "Products",
			items: [
				{ name: "ProductID", iskey: true, figure: "Decision", color: yellowgrad },
				{ name: "ProductName", iskey: false, figure: "Cube1", color: bluegrad },
				{ name: "SupplierID", iskey: false, figure: "Decision", color: "purple" },
				{ name: "CategoryID", iskey: false, figure: "Decision", color: "purple" } ] },
		{
			key: "Suppliers",
			items: [ { name: "SupplierID", iskey: true, figure: "Decision", color: yellowgrad },
				{ name: "CompanyName", iskey: false, figure: "Cube1", color: bluegrad },
				{ name: "ContactName", iskey: false, figure: "Cube1", color: bluegrad },
				{ name: "Address", iskey: false, figure: "Cube1", color: bluegrad } ] },
		{
			key: "Categories",
			items: [ { name: "CategoryID", iskey: true, figure: "Decision", color: yellowgrad },
				{ name: "CategoryName", iskey: false, figure: "Cube1", color: bluegrad },
				{ name: "Description", iskey: false, figure: "Cube1", color: bluegrad },
				{ name: "Picture", iskey: false, figure: "TriangleUp", color: redgrad } ] },
		{
			key: "Order Details",
			items: [ { name: "OrderID", iskey: true, figure: "Decision", color: yellowgrad },
				{ name: "ProductID", iskey: true, figure: "Decision", color: yellowgrad },
				{ name: "UnitPrice", iskey: false, figure: "MagneticData", color: greengrad },
				{ name: "Quantity", iskey: false, figure: "MagneticData", color: greengrad },
				{ name: "Discount", iskey: false, figure: "MagneticData", color: greengrad } ] },
	];
	var linkDataArray = [
		{ from: "Products", to: "Suppliers", text: "0..N", toText: "1" },
		{ from: "Products", to: "Categories", text: "0..N", toText: "1" },
		{ from: "Order Details", to: "Products", text: "0..N", toText: "1" }
	];
	myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
});
