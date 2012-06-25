/*
 * How about some decorators that you can stack up on an object, and them remove them? 
 * I need to back up the method it might override, but only if it's on the instance itself,
 * not on the prototype, because it doesn't matter if it's up the chain.
 *
 */
var Decorator, DemoDecorator, DemoDecorator2, target;

/**
 * @class
 * Using a constructor, of course, because I need a scope created per decorated instance.
 * 
 * @param {Object} 
 */
Decorator = function(decoratedObject){
	this.methodsBackup = {};
	_.extend(this.newMethods, {  // extend this in extensions
        'removeDecorator': _.bind(this.removeDecorator, this, decoratedObject),
        'overritenMethod': _.bind(this.overritenMethod, this),
        'decoratorScope': _.bind(this.decoratorScope, this)
    });

	for (decMethod in this.newMethods){
		if (this.newMethods.hasOwnProperty(decMethod) && typeof(this.newMethods[decMethod]) == "function"){  // pass in methods, or I don't care about it
			if (decoratedObject[decMethod]) {
                if (typeof decoratedObject.decoratorScope == "function"){
                    this.methodsBackup[decMethod] = _.bind(decoratedObject[decMethod], decoratedObject.decoratorScope());
                } else {
                    this.methodsBackup[decMethod] = _.bind(decoratedObject[decMethod], decoratedObject);
                }
            }
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
    },
    
    decoratorScope: function(){
        return this;
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

DemoDecorator2 = function(decoratedObject){
    decoratedObject = Decorator.apply(this, arguments);
    return decoratedObject;
}
DemoDecorator2.prototype = _.extend({}, Decorator.prototype, {
	newMethods: {
		demo: function(){
            var oldDemoFn = this.overritenMethod('demo');
			return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator II)';
		}
	}
});

DemoDecorator3 = function(decoratedObject){
    decoratedObject = Decorator.apply(this, arguments);
    return decoratedObject;
}
DemoDecorator3.prototype = _.extend({}, Decorator.prototype, {
	newMethods: {
		demo: function(){
            var oldDemoFn = this.overritenMethod('demo');
			return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator III)';
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

target = new DemoDecorator2(new DemoDecorator(target));
console.log(target.demo());

target = new DemoDecorator3(target);
console.log(target.demo());
console.log('scope: ', target.decoratorScope());

target.removeDecorator().removeDecorator();
console.log(target);
console.log(target.demo());
console.log('scope: ', target.decoratorScope());

target.removeDecorator()
console.log(target);
console.log(target.demo());
console.log('scope: ', target.decoratorScope());
/*

- the result is an over-complicated implementation, that lacks the elegance of the other solutions that I've seen so far. In
fact, it's so complexe that it entirely defeats the purpose of a design pattern. A design pattern implementation must be easy 
enough to be remembered. I believe that a solution that's simpler and easier to memorize is possible.



*/