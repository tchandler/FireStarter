/**
 * @author Zoho
 */

function FireStarterBlock(x, y, content) {
	this.x = x?x:0;
	this.y = y?y:0;
	this.position = {x:this.x, y:this.y};
	this.drawPosition = {x:this.x, y:this.y};
	this.content = content?content:"";
	this.state = BlockStates.empty;
	this.adjacencyList = [];
	this.fireLife = 0;
	this.fireDecay = 0.5;
};

FireStarterBlock.prototype = {
	position: {x:0, y:0},
	drawPosition: {x:0, y:0},
	content: "",
	changeState: function(newState) {
		if(newState !== this.state) {
			this.state = newState;
			this.content = this.findContent(this.state);
			if(this.state == BlockStates.fire) this.fireLife = 100;
		}
	},
	findContent: function(state) {
		if(this.state === BlockStates.empty) return "";
		if(this.state === BlockStates.fire) return "^^";
		if(this.state === BlockStates.flammable) return "()";
	},
	generateAdjacencyList: function(xLimit, yLimit) {
		//var xLimit = xLimit - 1,
			//yLimit = yLimit - 1,
		var	x = this.x,
			y = this.y,
			upLeft = { x: x-1, y: y-1 },
			up = { x: x, y: y-1 },
			upRight = { x: x+1, y: y-1 },
			right = { x: x+1, y: y },
			downRight = { x: x+1, y: y+1 },
			down = { x: x, y: y+1 },
			downLeft = { x: x-1, y: y+1 },
			left = { x:x-1, y: y };
	
		xLimit--;
		yLimit--;
		if(y !== 0) this.adjacencyList.push(up);
		if(x < xLimit && y !== 0) this.adjacencyList.push(upRight);
		if(x < xLimit) this.adjacencyList.push(right);
		if(x < xLimit && y < yLimit) this.adjacencyList.push(downRight);
		if(y < yLimit) this.adjacencyList.push(down);
		if(x !== 0 && y < yLimit) this.adjacencyList.push(downLeft);
		if(x !== 0) this.adjacencyList.push(left);
		if(x !== 0 && y !==0) this.adjacencyList.push(upLeft);
	},
	update: function() {
		if(this.state == BlockStates.fire) {
			if(this.fireLife > 0) this.fireLife -= this.fireDecay;
			if(this.fireLife <= 0) {
				console.log("the fire went out");
				this.changeState(BlockStates.empty);
			}
		}
	}
};

BlockStates = {
	empty: 0,
	fire: 2,
	flammable: 1
};
