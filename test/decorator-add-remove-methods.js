var target, targetClone,
    DemoDecorator, DemoDecorator2, DemoDecorator3;  // will extend the Decorator constructor

module("Decorator-add-remove-methods", {
    setup: function(){
        target = {
            demo: function(){
                return "not decorated";
            }
        };
        
        targetClone = clone_object(target);
        
        /* Client code: */
        DemoDecorator = Decorator.extend({
            constructor: function(decoratedObject){
                decoratedObject = Decorator.apply(this, arguments);
                return decoratedObject;
            },
            newMethods: {
                demo: function(){
                    var oldDemoFn = this.overriddenMethod('demo');
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
                    var oldDemoFn = this.overriddenMethod('demo');
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
                    var oldDemoFn = this.overriddenMethod('demo');
                    return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator III)';
                }
            }
        });
        
    }
});

test("Test setup: target and targetClone are the same", function(){
    deepEqual(target, targetClone, "target and targetClone are the same");
});

test("The target object has the decorator utility methods on it, after extension", function(){
    target = new DemoDecorator(target);
    
    equal(typeof target.removeDecorator, "function", "Checking the `removeDecorator` method exists on target.");
    equal(typeof target.overriddenMethod, "function", "Checking the `overriddenMethod` method exists on target.");
    equal(typeof target.decoratorScope, "function", "Checking the `decoratorScope` method exists on target.");
});

test("Check the `demo` overritten method while decorating and undecorating target", function(){
    equal(target.demo(), "not decorated", "initial `demo` return value before decoration");
    
    target = new DemoDecorator(target);
    equal(target.demo(), "not decorated : decorated (DemoDecorator)", "`demo` return value after DemoDecorator");
    
    target = new DemoDecorator3(new DemoDecorator2(target));
    equal(target.demo(), "not decorated : decorated (DemoDecorator) : decorated (DemoDecorator II) : decorated (DemoDecorator III)", "`demo` return value after DemoDecorator2 + DemoDecorator3");
    
    target.removeDecorator().removeDecorator();
    equal(target.demo(), "not decorated : decorated (DemoDecorator)", "`demo` return value after REMOVING DemoDecorator3, DemoDecorator3");
    
    target.removeDecorator();
    equal(target.demo(), "not decorated", "`demo` return value after REMOVING DemoDecorator");
    
    equal(typeof target.removeDecorator, "undefined", "Checking the `removeDecorator` method exists on target.");
    equal(typeof target.overriddenMethod, "undefined", "Checking the `overriddenMethod` method exists on target.");
    equal(typeof target.decoratorScope, "undefined", "Checking the `decoratorScope` method exists on target.");
});

