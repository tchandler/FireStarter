/**
 * @author Zoho
 */

//Constructor!
function FireStarter(gridConfig) {
	if(gridConfig === undefined) {
		this.gridConfig = {
			blockSize: {
				x: 40,
				y: 40
			},
			gridSize: {
				x: 20,
				y: 20
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
	this.grid = [];
	this._intervalId;
	this.inputHandler;
};


//Definitions
FireStarter.prototype = {
	init: function() {
		this.initGridData();	
		this.inputHandler = new FireStarterInput(this);
	},
	
	initGridData: function() {
		var x = 0, y = 0, content = "*";
		var blockSize = {x:this.gridConfig.blockSize.x, y:this.gridConfig.blockSize.y};
		this.cc.font = "12px sans-serif";
		for(; x < this.gridConfig.gridSize.x; x += 1) {
			this.grid[x] = new Array(this.gridConfig.gridSize.y);
			for(; y < this.gridConfig.gridSize.y; y += 1) {
				var block = new FireStarterBlock(x, y, null, this);
				block.changeState(Math.round(Math.random()));
				block.drawPosition = {
					x: (x * blockSize.x) + (blockSize.x / 2),
					y: (y * blockSize.y) + (blockSize.y / 2) 
				}
				this.grid[x][y] = block;
				block.generateAdjacencyList(this.gridConfig.gridSize.x, this.gridConfig.gridSize.y);
			}
			y = 0;
		}
	},
	
	drawBlock: function(block) {
		block.draw(this.cc);
	},
	
	drawGrid: function() {
		var top = ONE_PIXEL_OFFSET;
		var blockSize = this.gridConfig.blockSize;
		
		this.cc.beginPath();
		
		//draw grid outline
		this.drawLine(top, top, top, this.canvas.height);
		this.drawLine(top, this.canvas.height, this.canvas.width, this.canvas.height);
		this.drawLine(this.canvas.width, this.canvas.height, this.canvas.width, top);
		this.drawLine(this.canvas.width, top, top, top);
				
		for(var x = 0; x <= this.canvas.width; x += 1) {
			xCord = x * blockSize.x;
			this.drawLine(xCord, 0, xCord, this.canvas.height);
		}
		
		for(var y = 0; y <= this.canvas.height; y += 1) {
			yCord = y * blockSize.y;
			this.drawLine(0, yCord, this.canvas.width, yCord);
		}
		this.cc.stroke();
	},
	
	drawBlocks: function() {
		for(var x in this.grid) {
			for(var y in this.grid[x]) {
				this.drawBlock(this.grid[x][y]);
			}
		}
	},
	
	drawLine: function(startX, startY, endX, endY, strokeStyle) {
		strokeStyle = strokeStyle ? strokeStyle : "#000";
		this.cc.strokeStyle = strokeStyle;
		this.cc.moveTo(startX, startY);
		this.cc.lineTo(endX, endY);
	},
	
	draw: function() {
		this.canvas.width = this.canvas.width;
		this.drawBlocks();
	},
	
	update: function() {
		//read input
		this.inputHandler.update();
		this.updateGrid();
	},
	
	updateGrid: function() {
		for(var x in this.grid) {
			for(var y in this.grid[x]) {
					this.grid[x][y].update();
				if(this.grid[x][y].state === BlockStates.fire) {
					this.spreadFire(this.grid[x][y]);
				}
			}
		}
	},
	
	spreadFire: function(block) {
		var rand, isFireGoingToSpread, adjacentBlock;
		for (var i=0; i < block.adjacencyList.length; i++) {
			adjacentBlock = this.grid[block.adjacencyList[i].x][block.adjacencyList[i].y];
			rand = Math.random() * 0.501;
			isFireGoingToSpread = Boolean(Math.round(rand));
			if((adjacentBlock.state === BlockStates.flammable)) {
				adjacentBlock.increaseTemperature(0.7 + rand);
				if(isFireGoingToSpread) {
					adjacentBlock.changeState(BlockStates.fire);
				}
				
			}
		}
	},
	
	begin: function(fps) {
		var self = this;
		if(fps === undefined) {
			fps = 60;
		}
		if(this._intervalId !== undefined) this.stop();
		this._intervalId = setInterval(function() {self.run.call(self)}, (1000/fps));
	},
	
	run: function() {
		this.update();
		this.draw();
	},
	
	stop: function() {
		clearInterval(this._intervalId);
	}
};