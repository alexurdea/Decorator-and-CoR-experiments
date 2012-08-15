var Decorator;

/**
 * @class
 * Using a constructor, because I need a scope created per decorated instance.
 * 
 * @property {Object} newMethods Override this in extensions (on the prototype).
 *
 * @example
 * // Uses the Backbone JS extend mechanism
 * DemoDecorator = Decorator.extend({
 *     constructor: function(decoratedObject){
 *         decoratedObject = Decorator.apply(this, arguments);
 *         return decoratedObject;
 *     },
 *     newMethods: {
 *         demo: function(){
 *             // you could get the version of the method you're overriding, and use it
 *             var oldDemoFn = this.overriddenMethod('demo');
 *             return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator)';
 *         }
 *     }
 * });
 *
 * @param {Object} decoratedObject
 * @returns {Object} The same object that was passed in, with the added methods.
 */
Decorator = function(decoratedObject){
	this.methodsBackup = {};  // override the `this.newMethods` property in extensions
	_.extend(this.newMethods, {
        'removeDecorator': _.bind(this.removeDecorator, this, decoratedObject),
        'overriddenMethod': _.bind(this.overriddenMethod, this),
        'decoratorScope': _.bind(this.decoratorScope, this)
    });

	for (decMethod in this.newMethods){
		if (this.newMethods.hasOwnProperty(decMethod) && typeof(this.newMethods[decMethod]) == "function"){
			if (decoratedObject[decMethod]) {
                // If the object has already been decorated before (<= has `decoratorScope` utility method on it), then bind the backed up
                // methods to the top-most decorator context. Else, bind it to the decorated object.
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
Decorator.extend = Extend.extendMethod;
Decorator.prototype = {
	removeDecorator: function(decoratedObject){
		var decMethod, method;
// console.log(".............................");
        for (method in decoratedObject){
// console.log(method);
            if (decoratedObject.hasOwnProperty(method) && typeof decoratedObject[method] == "function"){
// console.log(method);            
                if (this.methodsBackup.hasOwnProperty(method)){
                    decoratedObject[method] = this.methodsBackup[method];
                } else {
                    delete decoratedObject.method;
                    console.log(method);
                }
            }
        }
        
        return decoratedObject;
	},
    
    overriddenMethod: function(methodName){
        return this.methodsBackup[methodName];
    },
    
    decoratorScope: function(){
        return this;
    }
};