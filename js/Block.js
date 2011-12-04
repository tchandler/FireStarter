/**
 * @author Zoho
 */

function FireStarterBlock(x, y, fsObj) {
	var gridX = x?x:0;
	var gridY = y?y:0;
	this.gridPosition = {x: gridX, y: gridY};	
	this.x = (gridX * fsObj.gridConfig.blockSize.x);
	this.y = (gridY * fsObj.gridConfig.blockSize.y);
	this.drawDimension = { 
		width: fsObj.gridConfig.blockSize.x,
		height: fsObj.gridConfig.blockSize.y };
	this.state = -1;
	this.adjacencyList = [];
	this.subscriberList = [];
}

FireStarterBlock.prototype = {
	gridPosition: {x:0, y:0},
	drawPosition: {x:0, y:0},
	content: "",
	changeState: function(newState) {
		BSM.changeState.call(this, newState);
	},
	findContent: function(state) {
		if(this.state === BlockStates.empty) return "";
		if(this.state === BlockStates.fire) return "^^";
		if(this.state === BlockStates.flammable) return this.temperature;
	},
	generateAdjacencyPositionList: function(_xLimit, _yLimit) {
		var xLimit = _xLimit - 1,
			yLimit = _yLimit - 1,
			x = this.gridPosition.x,
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
    addSubscriber: function(block) {
        for(var b in this.subscriberList) {
            if(this.subscriberList[b] === block) {
                return false;
            }
        }
        this.subscriberList.push(block);
        return true;
    },
    triggerFireEvent: function() {
        for(var b in this.subscriberList) {
            this.subscriberList[b].receiveFireEvent(this);
        }
    },
    receiveFireEvent: function(block) {
        var adjacentBlock = block,
            rand = Math.random() * 0.501,
            isFireGoingToSpread = Boolean(Math.round(rand));
        if(this.state === BlockStates.flammable) {
            this.increaseTemperature(0.7 + rand);
            if(isFireGoingToSpread) {
                BSM.changeState.call(this, BlockStates.fire);
            }
        }
        if(this.state === BlockStates.empty) {
            BSM.changeGrowth.call(this, -0.05);
        }
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
		BDM.draw.call(this, cc);
	},
	update: function() {
		BSM.update.call(this);
	},
	
	clicked: function() {
		//if(this.state === BlockStates.fire) BSM.changeState.call(this, BlockStates.empty);
		//if(this.state === BlockStates.flammable) BSM.changeState.call(this, BlockStates.fire);
	},
	mousedown: function() {
		if(this.state === BlockStates.flammable) {
			this.heating = true;
		}
	},
	mouseup: function() {
		if(this.state === BlockStates.flammable) {
			this.heating = false;
		}
	}
};
