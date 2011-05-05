/**
 * @author Zoho
 */

function FireStarterBlock(x, y, content) {
	this.x = x?x:0;
	this.y = y?y:0;
	this.position = {x:this.x, y:this.y};
	this.drawPosition = {x:this.x, y:this.y};
	this.content = content?content:"",
	this.state = BlockStates.empty;
};

FireStarterBlock.prototype = {
	position: {x:0, y:0},
	drawPosition: {x:0, y:0},
	content: "",
	changeState: function(newState) {
		if(newState !== this.state) {
			this.state = newState;
			this.content = (newState === 1) ? "*" : "";
		}
	},
};

BlockStates = {
	empty: 0,
	fire: 1	
};
