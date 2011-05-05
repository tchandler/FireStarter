/**
 * @author Zoho
 */

function FireStarterInput(fsObj) {
	this.inputQueue = [];
	this.fsObj = fsObj;
	var self = this;
	//this.fsObj.canvas.addEventListener("click", self.onMouseClick.call(self), false);
	this.fsObj.canvas.addEventListener("click", function(e) { self.onMouseClick.call(self, e); }, false);	
};

FireStarterInput.prototype = {
	createFire: function(block) {
		block.changeState(BlockStates.fire);
	},
	removeFire: function(block) {
		block.changeState(BlockStates.empty);
	},
	processInputQueue: function() {
		for(var q in this.inputQueue) {
			q.callback(q.arg);
		}
		this.inputQueue = [];
	},
	onMouseClick: function(e) {
		if(e !== undefined) {
			var block = this.getClickedBlock(e);	
			if(block.state === BlockStates.flammable) {
				this.createFire(block);
			} else {
				this.removeFire(block);
			}
		}
	},
	getClickedBlock: function(e) {
		var x, y, gridX, gridY;
	    if (e.pageX || e.pageY) {
	      x = e.pageX;
	      y = e.pageY;
	    }
	    else {
	      x = e.clientX + document.body.scrollLeft +
	           document.documentElement.scrollLeft;
	      y = e.clientY + document.body.scrollTop +
	           document.documentElement.scrollTop;
	    }
	    x -= this.fsObj.canvas.offsetLeft;
		y -= this.fsObj.canvas.offsetTop;
		gridX = Math.floor(x/this.fsObj.gridConfig.blockSize.x);
		gridY = Math.floor(y/this.fsObj.gridConfig.blockSize.y);
	    return this.fsObj.grid[gridX][gridY];
	}
	
};