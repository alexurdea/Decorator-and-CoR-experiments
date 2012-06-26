var Decorator;

/**
 * @class
 * Using a constructor, of course, because I need a scope created per decorated instance.
 * 
 * @param {Object} decoratedObject
 * @returns {Object} The same object that was passed in, with the added methods.
 */
Decorator = function(decoratedObject){
	this.methodsBackup = {};
	_.extend(this.newMethods, {  // extend this object in extensions
        'removeDecorator': _.bind(this.removeDecorator, this, decoratedObject),
        'overriddenMethod': _.bind(this.overriddenMethod, this),
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
    
    overriddenMethod: function(methodName){
        return this.methodsBackup[methodName];
    },
    
    decoratorScope: function(){
        return this;
    }
};