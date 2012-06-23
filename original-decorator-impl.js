/*
 * How about some decorators that you can stack up on an object, and them remove them? 
 * I need to back up the method it might override, but only if it's on the instance itself,
 * not on the prototype, because it doesn't matter if it's up the chain.
 *
 */
var Decorator, DemoDecorator, target;

/**
 * @class
 * Using a constructor, of course, because I need a scope created per decorated instance.
 * 
 * @param {Object} 
 */
Decorator = function(decoratedObject){
	this.methodsBackup = {};
	this.newMethods = {  // override this in extensions
        'removeDecorator': this.removeDecorator
    };

	for (decMethod in this.newMethods){
		if (this.newMethods.hasOwnProperty(decMethod) && typeof(decMethod) == "function"){  // pass in methods, or I don't care about it
			if (this[decMethod]) this.methodsBackup[decMethod] = this[decMethod];
			this[decMethod] = this.newMethods[decMethod];
		}
	}
};
Decorator.prototype = {
	remove: function(){
		var decMethod;

		for (decMethod in this.methodsBackup && this.methodsBackup.hasOwnProperty(decMethod)){
			this[decMethod] = this.methodsBackup[decMethod];
		}
	}
};


/* Client code: */
DemoDecorator = function(){
    Decorator.apply(this, arguments);
};
DemoDecorator.prototype = _.extend({}, Decorator.prototype, {
	newMethods: {
		demo: function(){
			return this.price() + " : decorated (DemoDecorator)";
		}
	}
});

target = {
	demo: function(){
		return "undecorated";
	}
};

/* Unit Tests: */
console.log(target.demo());

target = new DemoDecorator(target);
console.log(target.demo());

target.removeDecorator && target.removeDecorator();
console.log(target.demo());

