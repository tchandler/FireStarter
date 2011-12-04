/**
 * @author Zoho
 */

BlockStates = {
	empty: 0,
	fire: 2,
	flammable: 1
};

EmptyBlockConfiguration = {
	temperature: 0,
	fullGrowth: 100,
	growth: 0
};

FlammableBlockConfiguration = {
	temperature: 0,
	fireTemperature: 100
};

FireBlockConfiguration = {
	temperature: 100,
	fireLife: 100,
	fireDecay: 1.01,
	fireTemperature: 100
};

var BSM = {}; //Manage state(update)!
var BDM = {}; //Manage drawing!

//BSM.prototype = {
BSM = {
	init: function() {
		
	},
	update: function() {
		switch(this.state) {
			case BlockStates.empty:
				if(this.entryState) BSM.initEmptyBlock.call(this);
				BSM.updateEmptyBlock.call(this);
				if(this.exitState) BSM.exitEmptyBlock.call(this);
				break;
			case BlockStates.flammable:
				if(this.entryState) BSM.initFlammableBlock.call(this);
				BSM.updateFlammableBlock.call(this);
				if(this.exitState) BSM.exitFlammableBlock.call(this);
				break;
			case BlockStates.fire:
				if(this.entryState) BSM.initFireBlock.call(this);
				BSM.updateFireBlock.call(this);
				if(this.exitState) BSM.exitFireBlock.call(this);
                break;
			default:
				break;
		}
	},
	initEmptyBlock: function() {
		BSM.copyConfig.call(this, EmptyBlockConfiguration);
		this.entryState = false;
	},
	updateEmptyBlock: function() {
		if(this.growth > 0) {
			this.growth += Math.random() * 0.10;
		}
		if(this.growth > this.fullGrowth) {
			this.state = BlockStates.flammable;
			this.exitState = true;
		}
	},
	exitEmptyBlock: function() {
		this.exitState = false;
		this.entryState = true;
	},
	initFireBlock: function() {
		BSM.copyConfig.call(this, FireBlockConfiguration);
		this.entryState = false;
		//Note To Self: this would also probably be a good place to do sound queues
	},
	updateFireBlock: function() {
		//slowly kill fire
		if(this.fireLife > 0) {
			this.fireLife -= this.fireDecay;
		}	
		if(this.fireLife <= 0) {
			this.state = BlockStates.empty;
			this.exitState = true;
		}
		//spread fire!
        this.triggerFireEvent();
		//?
	},
	//How do I shot init/exit better
	exitFireBlock: function() {
		this.exitState = false;
		this.entryState = true;
	},
	initFlammableBlock: function() {
		BSM.copyConfig.call(this, FlammableBlockConfiguration);
		this.entryState = false;
		this.heating = false;
	},
	updateFlammableBlock: function() {
		//change temperature
		if(this.heating) {
			BSM.changeTemperature.call(this, 0.7);
		} else {
			BSM.changeTemperature.call(this, -0.1);
		}
	
		if(this.temperature > this.fireTemperature) {
			this.state = BlockStates.fire;
			this.exitState = true;
		}
	},
	exitFlammableBlock: function() {
		this.exitState = false;
		this.entryState = true;
	},
	changeTemperature: function(amount) {
		this.temperature += amount;
		if(this.temperature < 0) {
			this.temperature = 0;
		}
	},
	changeGrowth: function(amount) {
		this.growth += amount;
		if(this.growth < 0) this.growth = 0;
	},
	changeState: function(newState) {
		if(newState !== this.state) {
			this.state = newState;
			this.entryState = true; 
		}
	},
	//won't handle arrays properly, might become a problem if arrays become a configuration option
	//If the do, I'll refactor this out to be a proper own object only deep copy. 
	copyConfig: function(config) {
		for(var a in config) {
			if(config.hasOwnProperty(a)) {
				this[a] = config[a];
			}
		}
	}
	
};

BDM = {
	init: function(canvasContext) {
		
	},
	draw: function(canvasContext) {
		switch(this.state) {
			case BlockStates.empty:
				if(this.entryState) BSM.initEmptyBlock.call(this);
				BDM.drawEmptyBlock.call(this, canvasContext);
				break;
			case BlockStates.fire:
				if(this.entryState) BSM.initFireBlock.call(this);
				BDM.drawFireBlock.call(this, canvasContext);
				//if(this.exitState) BSM.exitFireBlock.call(this);
				break;
			case BlockStates.flammable:
				if(this.entryState) BSM.initFlammableBlock.call(this);
				BDM.drawFlammableBlock.call(this, canvasContext);
				break;
			default:
				break;
		}
		canvasContext.fillRect(this.x, this.y, this.drawDimension.width, this.drawDimension.height);
	},
	drawEmptyBlock: function(canvasContext) {
		var growthPercent = this.growth / this.fullGrowth;
		growthPercent = growthPercent.clamp(0, 1);
		var colorGradient = canvasContext.createLinearGradient(this.x, this.y + this.drawDimension.height, this.x , this.y);
		colorGradient.addColorStop(0, "green");
		colorGradient.addColorStop(growthPercent * 0.9, "#00FF00");		
		colorGradient.addColorStop(growthPercent, "#5C3317");
		canvasContext.fillStyle = colorGradient;
	},
	drawFireBlock: function(canvasContext) {
		var tempPercent = this.fireLife / this.fireTemperature;
		tempPercent = tempPercent.clamp(0, 1);
		var colorGradient = canvasContext.createLinearGradient(this.x, this.y  + this.drawDimension.height, this.x , this.y);
		colorGradient.addColorStop(0, "red");
		colorGradient.addColorStop(tempPercent, "orange");
		if(tempPercent < 0.75) colorGradient.addColorStop(0.25 + tempPercent, "yellow");
		if(tempPercent < 0.5) colorGradient.addColorStop(0.5 + tempPercent, "#8E6B23");
		if(tempPercent < 0.25) colorGradient.addColorStop(0.75 + tempPercent, "#5C3317");
		canvasContext.fillStyle = colorGradient;
	},
	drawFlammableBlock: function(canvasContext) {
		var tempPercent = this.temperature / this.fireTemperature;
		tempPercent = tempPercent.clamp(0, 1);
		var colorGradient = canvasContext.createLinearGradient(this.x, this.y + this.drawDimension.height, this.x , this.y);
		colorGradient.addColorStop(0, "red");
		colorGradient.addColorStop((tempPercent), "green");
		canvasContext.fillStyle = colorGradient;
	}
};
