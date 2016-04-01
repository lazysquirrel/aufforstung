var numberOfTrees = 20;
var canvas = document.getElementById("waldflaeche");
var drawingContext = canvas.getContext('2d');
var startPunkt = {x:canvas.width/2, y:canvas.height/2};
var treeList = [];
var treeLimit = 322;
var treesPlanted = 0;
var iterations = 5;
var numberOfTreeTypes = 3;

var treeObject = {x:0, y:0, radius:0, type:"Undefined", color:"#000000"};

var treeDefinition = function(radius, type, color) {
	this.radius = radius;
	this.type = type;
	this.color = color;
}

var treeTypeList = [];

treeTypeList[0] = new treeDefinition(30, "Eiche", "#00aaaa");
treeTypeList[1] = new treeDefinition(25, "Buche", "#bbccbb");
treeTypeList[2] = new treeDefinition(45, "Birke", "crimson");
treeTypeList[3] = new treeDefinition(40, "Birke", "yellow");
treeTypeList[4] = new treeDefinition(60, "Birke", "pink");
treeTypeList[5] = new treeDefinition(20, "Birke", "crimson");


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
	if(treesPlanted > treeLimit) {
		return;
	}
	var newPoint;
	var newTree;
	var newTreeRadius = Math.floor((Math.random() * 60) + 10);
	var newTreeColor = '#'+Math.floor(Math.random()*16777215).toString(16); 
	var randomType;
	var currentTreeType;

	for (var angle = 0; angle <= 360; angle+=1) {
		randomType = Math.floor((Math.random() * numberOfTreeTypes));
		currentTreeType = treeTypeList[randomType];
		console.log(randomType);
		newPoint = calculateNewPoint(tree.x, tree.y, (tree.radius + currentTreeType.radius), angle);
		newTree = {x:newPoint.x, y:newPoint.y, radius:currentTreeType.radius, type:currentTreeType.type, color:currentTreeType.color};
		if(!isColliding(newTree, treeList)) {
			plantTree(newTree);
		}
	}
}

function start() {
	var startTree = {x:startPunkt.x, y:startPunkt.y, radius:40, type:"Eiche", color:"#00bb00"};
	plantTree(startTree);
	surroundTree(startTree);
	for(var iter = 0; iter < iterations; iter++) {
		for(var i = 0; i < treeList.length; i++) {
			surroundTree(treeList[i]);
		}
	}
}


