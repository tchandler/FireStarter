/**
 * @author Zoho
 */

var ONE_PIXEL_OFFSET = 0.5;

//Constructor!
function FireStarter(gridConfig) {
	if(gridConfig === undefined) {
		this.gridConfig = {
			blockSize: {
				x: 50,
				y: 50
			},
			gridSize: {
				x: 10,
				y: 10
			}
		};
	}
	else {
		this.gridConfig = gridConfig;
	}
	
	this.canvasSize = { x: this.gridConfig.gridSize.x * this.gridConfig.blockSize.x,
						y: this.gridConfig.gridSize.y * this.gridConfig.blockSize.y }
		
	this.canvas = document.getElementById("firestarter_canvas");
	this.canvas.width = this.canvasSize.x;
	this.canvas.height = this.canvasSize.y;
	this.cc = this.canvas.getContext("2d");
	this.grid = [this.gridConfig.gridSize.x][this.gridConfig.gridSize.y];
};

//Definitions
FireStarter.prototype = {
	init: function() {
		this.initGridData();
		this.drawGrid();
	},
	
	initGridData: function() {
		this.gridWidth
	},
	
	drawGrid: function() {
		var top = ONE_PIXEL_OFFSET;
		
		this.cc.beginPath();
		
		//draw grid outline
		this.drawLine(top, top, top, this.canvas.height);
		this.drawLine(top, this.canvas.height, this.canvas.width, this.canvas.height);
		this.drawLine(this.canvas.width, this.canvas.height, this.canvas.width, top);
		this.drawLine(this.canvas.width, top, top, top);
		
		
		for(var x = 0, xCord = x * this.gridConfig.blockSize.x; 
			x <= this.canvas.width; 
			x += 1, xCord += this.gridConfig.blockSize.x) {
			this.drawLine(xCord, 0, xCord, this.canvas.height);
		}
		
		for(var y = 0, yCord = y * this.gridConfig.blockSize.y; 
			y <= this.canvas.height; 
			y += 1, yCord += this.gridConfig.blockSize.y) {
			this.drawLine(0, yCord, this.canvas.width, yCord);
		}
		
		this.cc.stroke();
	},
	
	drawLine: function(startX, startY, endX, endY, strokeStyle) {
		strokeStyle = strokeStyle ? strokeStyle : "#000";
		this.cc.strokeStyle = strokeStyle;
		this.cc.moveTo(startX, startY);
		this.cc.lineTo(endX, endY);
	},
};

var FSGame = ( function() {
	var FS = new FireStarter;
	FS.init();
	return FS;
}());