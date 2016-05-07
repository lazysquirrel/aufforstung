var runBefore = false;
var numberOfTrees = 0;
var canvas = document.getElementById("waldflaeche");
var drawingContext = canvas.getContext('2d');
var startPunkt = {x:canvas.width/2, y:canvas.height/2};
var treeList = [];
var treeLimit = 1200;
var treesPlanted = 0;
var iterations = 1;
var numberOfTreeTypes = 3;
var plantAngle = 3;

var treeObject = {x:0, y:0, radius:0, type:"Undefined", color:"#000000"};

var treeDefinition = function(radius, type, color) {
	this.radius = radius;
	this.type = type;
	this.color = color;
}

var treeTypeList = [];

treeTypeList[0] = new treeDefinition(15, "Eiche", "#00aaaa");
treeTypeList[1] = new treeDefinition(30, "Buche", "#bbccbb");
treeTypeList[2] = new treeDefinition(40, "Birke", "crimson");
// treeTypeList[3] = new treeDefinition(40, "Birke", "yellow");
// treeTypeList[4] = new treeDefinition(60, "Birke", "pink");
// treeTypeList[5] = new treeDefinition(20, "Birke", "crimson");

function suggestNextTree() {
	var areas = [];
	for (var i = 0; i < treeTypeList.length; i++) {
		areas[i] = Math.PI*Math.pow(treeTypeList[i].radius, 2);
	}
	var totalArea = 0;
	for(var i = 0; i < areas.length; i++) {
		totalArea+=areas[i];
	}
	var randomNumber = Math.floor(Math.random() * totalArea);
	var currentNumber = 0;
	for (var i = 0; i < areas.length; i++) {
		currentNumber+=areas[i];
		if (randomNumber <= currentNumber) {
			return i;
		}
	}

}

function drawCircle(x, y, r, color) {
	drawingContext.beginPath();
	drawingContext.fillStyle = color;
	drawingContext.lineWidth = 2;
	drawingContext.strokeStyle ="#000000";
	drawingContext.arc(x, y, r, 0, Math.PI*2, true);
	drawingContext.fill();
	drawingContext.stroke();
	drawingContext.closePath();
}

function plantTree(tree) {
	treeList.push(tree);
	treesPlanted++;
	drawCircle(tree.x, tree.y, tree.radius, tree.color);
}

function calculateNewPoint(originX, originY, distance, angle) {
	var newPoint = {x: 0, y: 0};
	var angleInRad = angle * Math.PI / 180;
	newPoint.x = originX + (Math.sin(angleInRad) * distance);
	newPoint.y = originY + (Math.cos(angleInRad) * distance);
	return newPoint;
}

function isColliding(newTree) {
	for (i = 0; i < treeList.length; i++) {
		if (checkCollision(newTree, treeList[i]) === true) {
			return true;
		}
		if((newTree.x + newTree.radius) > canvas.width || (newTree.y + newTree.radius) > canvas.height)
		{
			return true;
		}
		if((newTree.x - newTree.radius) < 0 || (newTree.y - newTree.radius) < 0)
		{
			return true;
		}
	}
		return false;
}

function checkCollision(tree1, tree2) {
	var result = false;
	if (distanceBetweenTwoPoints(tree1.x, tree1.y, tree2.x, tree2.y) < (tree1.radius + tree2.radius)) {
		result = true;
	}
	return result;
}

function distanceBetweenTwoPoints(point1x, point1y, point2x, point2y) {
	var result = Math.sqrt(Math.pow((point2x - point1x), 2) + Math.pow((point2y - point1y), 2));
	return result;
}

function surroundTree(tree) {
	if (treesPlanted > treeLimit) {
		console.log("Tree Limit exceeded");
		return;
	}
	var newPoint;
	var newTree;
	var newTreeRadius = Math.floor((Math.random() * 60) + 10);
	var newTreeColor = '#'+Math.floor(Math.random()*16777215).toString(16); 
	var randomType;
	var currentTreeType;

	for (var angle = 0; angle <= 360; angle+=plantAngle) {
//		randomType = Math.floor((Math.random() * (treeTypeList.length - 1)));
		if(randomType < 0) randomType = 0;
//		currentTreeType = treeTypeList[randomType];
		currentTreeType = treeTypeList[suggestNextTree()];
		newPoint = calculateNewPoint(tree.x, tree.y, (tree.radius + currentTreeType.radius), angle);
		newTree = {x:newPoint.x, y:newPoint.y, radius:currentTreeType.radius, type:currentTreeType.type, color:currentTreeType.color};
		if(!isColliding(newTree, treeList)) {
			plantTree(newTree);
		}
	}
}

function start() {
	if(runBefore) {
		console.log("clearning canvas and tree list");
		treesPlanted = 0;
		treeList = [];
		drawingContext.clearRect(0, 0, canvas.width, canvas.height);
	}

	treeTypeList[0] = new treeDefinition(+document.getElementById("tree1radius").value, "Eiche", document.getElementById("tree1color").value);
	treeTypeList[1] = new treeDefinition(+document.getElementById("tree2radius").value, "Buche", document.getElementById("tree2color").value);
	treeTypeList[2] = new treeDefinition(+document.getElementById("tree3radius").value, "Birke", document.getElementById("tree3color").value);
	document.getElementById("startButton").innerText = "Run again";
	iterations = +document.getElementById("iterationsField").value;
	runBefore = true;
	var treeType = treeTypeList[suggestNextTree()];
	var startTree = {x:startPunkt.x, y:startPunkt.y, radius:treeType.radius, type:treeType.type, color:treeType.color};
	plantTree(startTree);
	surroundTree(startTree);
	for(var iter = 0; iter < iterations; iter++) {
		for(var i = 0; i < treeList.length; i++) {
			surroundTree(treeList[i]);
		}
	}
	var eiche = 0; buche = 0, birke = 0;
	for (var i = 0; i < treeList.length; i++) {
		if (treeList[i].type == "Eiche") eiche++;
		if (treeList[i].type == "Buche") buche++;
		if (treeList[i].type == "Birke") birke++;
	}
	var totalArea = canvas.width*canvas.height;
	var eicheArea = Math.PI*treeTypeList[0].radius*treeTypeList[0].radius*eiche;
	var eichePercentage = eicheArea/totalArea*100;
	var bucheArea = Math.PI*treeTypeList[1].radius*treeTypeList[1].radius*buche;
	var buchePercentage = bucheArea/totalArea*100;
	var birkeArea = Math.PI*treeTypeList[2].radius*treeTypeList[2].radius*birke;
	var birkePercentage = birkeArea/totalArea*100;

	resultsHTML = document.getElementById("results");
	results.innerHTML = treesPlanted + " trees planted<br /> " + eiche + " x Type 1 (" + Math.floor(eichePercentage) + " % of total area)<br />" + buche + " x Type 2 (" + Math.floor(buchePercentage) + " % of total area)<br />" +  + birke + " x Type 3 (" + Math.floor(birkePercentage) + " % of total area)<br />" + Math.floor(100-eichePercentage-buchePercentage-birkePercentage) + " % unused area";
}


