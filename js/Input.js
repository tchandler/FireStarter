/**
 * @author Zoho
 */

function FireStarterInput(fsObj) {
	this.inputQueue = [];
	this.fsObj = fsObj;
	var self = this;
	//this.fsObj.canvas.addEventListener("click", self.onMouseClick.call(self), false);
	this.fsObj.canvas.addEventListener("click", function(e) { self.onMouseClick.call(self, e); }, false);	
	this.fsObj.canvas.addEventListener("mousedown", function(e) { self.onMouseDown.call(self, e); }, false);
	this.fsObj.canvas.addEventListener("mouseup", function(e) { self.onMouseUp.call(self, e); }, false);	
};

FireStarterInput.prototype = {
	update: function() {
		for(var q in this.inputQueue) {
			this.inputQueue[q].callback.call(this.inputQueue[q].scope, this.inputQueue[q].arg);
		}
		this.inputQueue = [];
	},
	onMouseClick: function(e) {
		if(e !== undefined) {
			var block = this.getClickedBlock(e);	
			this.inputQueue.push( {
				callback: block.clicked,
				arg: null,
				scope: block }	);
		}
	},
	onMouseDown: function(e) {
		if(e !== undefined) {
			var block = this.getClickedBlock(e);	
			this.inputQueue.push( {
				callback: block.mousedown,
				arg: null,
				scope: block }	);
		}
	},
	onMouseUp: function(e) {
		if(e !== undefined) {
			var block = this.getClickedBlock(e);	
			this.inputQueue.push( {
				callback: block.mouseup,
				arg: null,
				scope: block }	);
		}
	},
	getClickedBlock: function(e) {
		var x, y, gridX, gridY;
	    if (e.pageX || e.pageY) {
	    	x = e.pageX;
	    	y = e.pageY;
	    }
	    else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	    }
	    x -= this.fsObj.canvas.offsetLeft;
		y -= this.fsObj.canvas.offsetTop;
		gridX = Math.floor(x/this.fsObj.gridConfig.blockSize.x);
		gridY = Math.floor(y/this.fsObj.gridConfig.blockSize.y);
	    return this.fsObj.grid[gridX][gridY];
	}
	
};