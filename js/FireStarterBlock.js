/**
 * @author Zoho
 */

function FireStarterBlock(x, y, content, fsObj) {
	var gridX = x?x:0;
	var gridY = y?y:0;
	this.gridPosition = {x: gridX, y: gridY};	
	this.x = (gridX * fsObj.gridConfig.blockSize.x);
	this.y = (gridY * fsObj.gridConfig.blockSize.y);
	this.drawDimension = { 
		width: fsObj.gridConfig.blockSize.x,
		height: fsObj.gridConfig.blockSize.y };
	this.content = content?content:"";
	this.state = BlockStates.empty;
	this.adjacencyList = [];
	this.fireLife = 0;
	this.fireDecay = 1.01;
	this.temperature = 0;
	this.fireTemperature = 100;
};

FireStarterBlock.prototype = {
	gridPosition: {x:0, y:0},
	drawPosition: {x:0, y:0},
	content: "",
	changeState: function(newState) {
		if(newState !== this.state) {
			this.state = newState;
			this.content = this.findContent(this.state);
			if(this.state == BlockStates.fire) {
				this.fireLife = 100;
				//this.fireDecay = (Math.random() + .25) * .75;
			} 
		}
	},
	findContent: function(state) {
		if(this.state === BlockStates.empty) return "";
		if(this.state === BlockStates.fire) return "^^";
		if(this.state === BlockStates.flammable) return this.temperature;
	},
	generateAdjacencyList: function(xLimit, yLimit) {
		var xLimit = xLimit - 1,
			yLimit = yLimit - 1,
			x = this.gridPosition.x;
			y = this.gridPosition.y,
			upLeft = { x: x-1, y: y-1 },
			up = { x: x, y: y-1 },
			upRight = { x: x+1, y: y-1 },
			right = { x: x+1, y: y },
			downRight = { x: x+1, y: y+1 },
			down = { x: x, y: y+1 },
			downLeft = { x: x-1, y: y+1 },
			left = { x:x-1, y: y };
	
		if(y !== 0) this.adjacencyList.push(up);
		if(x < xLimit && y !== 0) this.adjacencyList.push(upRight);
		if(x < xLimit) this.adjacencyList.push(right);
		if(x < xLimit && y < yLimit) this.adjacencyList.push(downRight);
		if(y < yLimit) this.adjacencyList.push(down);
		if(x !== 0 && y < yLimit) this.adjacencyList.push(downLeft);
		if(x !== 0) this.adjacencyList.push(left);
		if(x !== 0 && y !==0) this.adjacencyList.push(upLeft);
	},
	increaseTemperature: function(amount) {
		this.temperature += amount;
		if(this.temperature < 0) this.temperature = 0;
		if(this.temperature >= this.fireTemperature) {
			this.changeState(BlockStates.fire);
		}
	},

	//Go Go Developer Animations!
	draw: function(cc) {
		if(this.state == BlockStates.flammable) {
			var tempPercent = this.temperature / this.fireTemperature;
			var colorGradient = cc.createLinearGradient(this.x, this.y + this.drawDimension.height, this.x , this.y);
			colorGradient.addColorStop(0, "red");
			colorGradient.addColorStop((tempPercent), "green");
			cc.fillStyle = colorGradient;
		}
		
		if(this.state == BlockStates.fire) {
			var tempPercent = this.fireLife / this.fireTemperature;
			tempPercent = tempPercent < 1 ? tempPercent : 1;
			var colorGradient = cc.createLinearGradient(this.x, this.y  + this.drawDimension.height, this.x , this.y);
			colorGradient.addColorStop(0, "red");
			colorGradient.addColorStop(tempPercent, "orange");
			if(tempPercent < .75) colorGradient.addColorStop(.25 + tempPercent, "yellow");
			if(tempPercent < .5) colorGradient.addColorStop(.5 + tempPercent, "#8E6B23");
			if(tempPercent < .25) colorGradient.addColorStop(.75 + tempPercent, "#5C3317");
			cc.fillStyle = colorGradient;
		}
		
		if(this.state == BlockStates.empty) {
			cc.fillStyle = "#5C3317";
		}
		
		cc.fillRect(this.x, this.y, this.drawDimension.width, this.drawDimension.height);
	},
	update: function() {
		if(this.state === BlockStates.fire) {
			if(this.fireLife > 0) this.fireLife -= this.fireDecay;
			if(this.fireLife <= 0) {
				console.log("the fire went out");
				this.changeState(BlockStates.empty);
			}
		}
		if(this.state === BlockStates.flammable) {
			this.increaseTemperature(-0.1);
			this.content = this.temperature;
		}
	},
	
	clicked: function() {
		if(this.state === BlockStates.fire) this.changeState(BlockStates.empty);
		if(this.state === BlockStates.flammable) this.changeState(BlockStates.fire);
	}
};

BlockStates = {
	empty: 0,
	fire: 2,
	flammable: 1
};
