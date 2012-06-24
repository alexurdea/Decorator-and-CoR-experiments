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
	_.extend(this.newMethods, {  // override this in extensions
        'removeDecorator': _.bind(this.removeDecorator, this, decoratedObject),
        'overritenMethod': _.bind(this.overritenMethod, this)
    });

	for (decMethod in this.newMethods){
		if (this.newMethods.hasOwnProperty(decMethod) && typeof(this.newMethods[decMethod]) == "function"){  // pass in methods, or I don't care about it
			if (decoratedObject[decMethod]) this.methodsBackup[decMethod] = decoratedObject[decMethod];
			decoratedObject[decMethod] = this.newMethods[decMethod];
		}
	}
    
    return decoratedObject;
};
Decorator.prototype = {
	removeDecorator: function(decoratedObject){
		var decMethod;

		for (decMethod in this.methodsBackup){
            if (this.methodsBackup.hasOwnProperty(decMethod)){
                decoratedObject[decMethod] = this.methodsBackup[decMethod];
            }
		}
        
        return decoratedObject;
	},
    
    overritenMethod: function(methodName){
        return this.methodsBackup[methodName];
    }
};


/* Client code: */
DemoDecorator = function(decoratedObject){
    decoratedObject = Decorator.apply(this, arguments);
    return decoratedObject;
};
DemoDecorator.prototype = _.extend({}, Decorator.prototype, {
	newMethods: {
		demo: function(){
            var oldDemoFn = this.overritenMethod('demo');
			return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator)';
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

