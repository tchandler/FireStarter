/**
 * @author Zoho
 */

BlockStates = {
	empty: 0,
	fire: 2,
	flammable: 1
};

FlammableBlockConfiguration = {
	temperature: 0
};

FireBlockConfiguration = {
	temperature: 100,
	fireLife: 100,
	fireDecay: 1.01,
	fireTemperature: 100
}

var BSM = {};

//BSM.prototype = {
BSM = {
	init: function() {
		
	},
	update: function() {
		switch(this.state) {
			case BlockStates.empty:
				BSM.updateEmptyBlock.call(this);
				break;
			case BlockStates.fire:
				if(this.entryState) BSM.initFireBlock.call(this);;
				BSM.updateFireBlock.call(this);
				if(this.exitState) BSM.exitFireBlock.call(this);
				break;
			case BlockStates.flammable:
				if(this.entryState) BSM.initFlammableBlock.call(this);
				BSM.updateFlammableBlock.call(this);
				break;
			default:
				break;
		}
	},
	updateEmptyBlock: function() {
		//do nothing!
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
		//?
	},
	//How do I shot init/exit better
	exitFireBlock: function() {
		
	},
	initFlammableBlock: function() {
		BSM.copyConfig.call(this, FlammableBlockConfiguration);
	},
	updateFlammableBlock: function() {
		//change temperature
		BSM.changeTemperature.call(this, -0.1);
		if(this.temperature > this.fireTemperature) {
			this.state = BlockStates.fire;
			this.exitState = true;
		}
	},
	changeTemperature: function(amount) {
		this.temperature += amount;
		if(this.temperature < 0) {
			this.temperature = 0;
		}
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
