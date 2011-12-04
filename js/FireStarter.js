/**
 * @author Zoho
 */

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
        y: this.gridConfig.gridSize.y * this.gridConfig.blockSize.y };
		
	this.canvas = document.getElementById("firestarter_canvas");
	this.canvas.width = this.canvasSize.x;
	this.canvas.height = this.canvasSize.y;
	this.cc = this.canvas.getContext("2d");
	this.grid = [];
    this.blocks = [];
	this._intervalId;
	this.inputHandler;
}


//Definitions
FireStarter.prototype = {
	init: function() {
		this.initGridData();	
        this.initCanvas();
		this.inputHandler = new FireStarterInput(this);
	},
	
    initCanvas: function() {
		this.cc.font = "12px sans-serif";
    },

	initGridData: function() {
        var maxX = this.gridConfig.gridSize.x,
            maxY = this.gridConfig.gridSize.y,
            content = "*";

        for(var x = 0; x < maxX; x++, y = 0) {
			this.grid[x] = new Array(maxY);

            for(var y = 0; y < maxY; y++) {
                this.createBlock(x, y);
			}
		}
        this.buildSubscriberLists();
	},

    createBlock: function(x, y) {
        var block = new FireStarterBlock(x, y, this),
            blockSize = {x:this.gridConfig.blockSize.x, y:this.gridConfig.blockSize.y};
        BSM.changeState.call(block, Math.round(Math.random() * 0.75));
        block.drawPosition = {
            x: (x * blockSize.x) + (blockSize.x / 2),
            y: (y * blockSize.y) + (blockSize.y / 2) 
        };
        this.grid[x][y] = block;
        this.blocks.push(block);
        block.generateAdjacencyPositionList(this.gridConfig.gridSize.x, this.gridConfig.gridSize.y);
        BSM.update.call(block);
    },
    buildSubscriberLists: function() {
        for(var b in this.blocks) {
            var al = this.blocks[b].adjacencyList;
            for(var a in al) {
                var ab = al[a];
                this.blocks[b].addSubscriber(this.grid[ab.x][ab.y]);
            }
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
                    this.grid[x][y].triggerFireEvent();
					//this.spreadFire(this.grid[x][y]);
				}
				if(this.grid[x][y].state === BlockStates.flammable) {
					this.spreadGrowth(this.grid[x][y]);
				}
			}
		}
	},
	
	spreadFire: function(block) {
	},
	spreadGrowth: function(block) {
		//*
		var tempBoost, adjacentBlock;
		for (var i=0; i < block.adjacencyList.length; i++) {
			adjacentBlock = this.grid[block.adjacencyList[i].x][block.adjacencyList[i].y];
			tempBoost = Math.random() * (block.temperature / 100);
			if((adjacentBlock.state === BlockStates.empty)) {
				var heatToggle = block.temperature === 0 ? 1 : -1;
				BSM.changeGrowth.call(adjacentBlock, 0.01 * heatToggle);
			}
		}
		//*/
	},
	
	begin: function(fps) {
		var self = this;
		if(fps === undefined) {
			fps = 60;
		}
		if(this._intervalId !== undefined) this.stop();
		this.inputHandler.inputQueue = [];
        this._intervalId = setInterval(function() {self.run.call(self);}, (1000/fps));
	},
	
	run: function() {
		this.update();
		this.draw();
	},
	
	stop: function() {
		clearInterval(this._intervalId);
	}
};
