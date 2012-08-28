var Decorator;

/**
 * @class
 * Instance will be used to store overridden methods. They will be bound before being
 * archived.
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
 *             return (oldDemoFn ? oldDemoFn() : '') + ' is now decorated (DemoDecorator)';
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
            decoratedObject[decMethod].decoratedBy = this;  // useful when removing decorators
		}
	}
    
    return decoratedObject;
};
Decorator.extend = Extend.extendMethod;
Decorator.prototype = {
    /**
     * @param {Object} decoratedObject
     * @param {Decorator} decoratorConstructor If this is not provided, it defaults to the outermost decorator
     * @returns decoratedObject {Object} Return it, for chaining.
     */
	removeDecorator: function(decoratedObject, decoratorConstructor){
		var thisDecoratorInstance, thisDecorator,
            nextDecorator, nextDecoratorInstance;

        thisDecoratorInstance = this.decoratorScope();
        thisDecorator = thisDecoratorInstance.constructor;

        // default to the outmost decorator, if none provided
        if (!(decoratorConstructor instanceof Function)){
            decoratorConstructor = thisDecorator;
        };

        if (decoratorConstructor == thisDecorator){
            // if this is the decorator, than take it off
            this._removeDecoratorMethods(this, decoratedObject);
            this._restoreBackedUpMethods(decoratedObject);
        } else {
            // check to see if there's a next decorator, and if it's an instance of `decoratorConstructor`
            nextDecoratorInstance = this.overriddenMethod('decoratorScope')();
            nextDecorator = nextDecoratorInstance.constructor;
            
            if (nextDecorator == decoratorConstructor){
                // take out the methods that were added by this decorator. A method was added if it's not backed up, but in newMethods.
                this._removeDecoratorMethods(nextDecoratorInstance, decoratedObject);
                thisDecoratorInstance.setBackedUpMethods(nextDecoratorInstance.getBackedUpMethods());
            } else {
                // move deeper
                nextDecoratorInstance.removeDecorator(decoratedObject, decoratorConstructor);
            }
        }

        return decoratedObject;
	},

    /**
     * @param decoratorInstance {Decorator}
     * @param decoratedObject {Object}
     */
    _removeDecoratorMethods: function(decoratorInstance, decoratedObject){
        var decoratorMethodName, decorator;

        decorator = decoratorInstance.constructor;

        for (decoratorMethodName in decorator.prototype.newMethods){            
            if (!(decoratorInstance.overriddenMethod(decoratorMethodName)) 
                && decoratedObject[decoratorMethodName].decoratedBy == decoratorInstance
                && decorator.prototype.newMethods.hasOwnProperty(decoratorMethodName)
                && typeof decorator.prototype.newMethods[decoratorMethodName] == "function"){
                delete decoratedObject[decoratorMethodName];
            }
        }

        // if it's the innermost decorator, ditch the utility methods
        if (!decoratedObject.overriddenMethod('decoratorScope')){
            delete decoratedObject['overriddenMethod'];
            delete decoratedObject['decoratorScope'];
            delete decoratedObject['removeDecorator'];
        }
    },

    /**
     * @param decoratedObject {Object}
     */
    _restoreBackedUpMethods: function(decoratedObject){
        var methodName;

        for (methodName in this.methodsBackup){
            decoratedObject[methodName] = this.methodsBackup[methodName];
        }
    },
    
    /**
     * @param {String} methodName
     * @returns {Function}
     */
    overriddenMethod: function(methodName){
        return this.methodsBackup[methodName];
    },
    
    /*
     * @returns {Object}
     */
    decoratorScope: function(){
        return this;
    },

    /**
     * @param backedUpMethods {Object}
     */
    setBackedUpMethods: function(backedUpMethods){
        this.methodsBackup = backedUpMethods;
    },

    /**
     * @returns {Object} The methods that were backed up by this decorator instance.
     */
    getBackedUpMethods: function(){
        return this.methodsBackup;
    }
};      