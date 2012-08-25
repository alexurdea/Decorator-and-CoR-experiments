var target, targetClone, 
    checkMethodsAfterAllDecoratorsOnFn,  // utility method
    DemoDecorator, DemoDecorator2, DemoDecorator3;  // will extend the Decorator constructor

module("Decorator-add-remove-methods", {
    setup: function(){
        target = {
            demo: function(){
                return "not decorated";
            }
        };
        
        targetClone = clone_object(target);

        /* A utility function, just to keep things DRY. Checks the methods after
         * the target object has been decorated with all 5 decorators. 
         */
        checkMethodsAfterAllDecoratorsOnFn = function(){
            equal(target.demo(), "not decorated : decorated (DemoDecorator) : decorated (DemoDecorator II) : decorated (DemoDecorator III) : decorated (DemoDecorator IV) : decorated (DemoDecorator V)",
                "The `demo` method is correct after wrapping with all decorators");
            ok(target.demoDecoratorSpecific() == "DemoDecorator specific"
                && target.demoDecorator2Specific() == "DemoDecorator2 specific"
                && target.demoDecorator3Specific() == "DemoDecorator3 specific"
                && target.demoDecorator4Specific() == "DemoDecorator4 specific"
                && target.demoDecorator5Specific() == "DemoDecorator5 specific",
                "The decorator-specific methods are on the object, for all decorators.");
        };
        
        /* Client code: setting up a bunch of decorators. Each defines a 
         * method called `demo` that they all overrite,
         * plus a method of it's own. These are named `demoDecoratorSpecific`,
         * `demoDecorator2Specific` etc. 
         */
        DemoDecorator = Decorator.extend({
            constructor: function(decoratedObject){
                decoratedObject = Decorator.apply(this, arguments);
                "DemoDecorator";
                return decoratedObject;
            },
            newMethods: {
                demo: function(){
                    var oldDemoFn = this.overriddenMethod('demo');
                    return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator)';
                },
                demoDecoratorSpecific: function(){
                    return "DemoDecorator specific";
                }
            }
        });

        DemoDecorator2 = Decorator.extend({
            constructor: function(decoratedObject){
                decoratedObject = Decorator.apply(this, arguments);
                "DemoDecorator2";
                return decoratedObject;
            },
            newMethods: {
                demo: function(){
                    var oldDemoFn = this.overriddenMethod('demo');
                    return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator II)';
                },
                demoDecorator2Specific: function(){
                    return "DemoDecorator2 specific";
                }
            }
        });

        DemoDecorator3 = Decorator.extend({
            constructor: function(decoratedObject){
                decoratedObject = Decorator.apply(this, arguments);
                "DemoDecorator3";
                return decoratedObject;
            },
            newMethods: {
                demo: function(){
                    var oldDemoFn = this.overriddenMethod('demo');
                    return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator III)';
                },
                demoDecorator3Specific: function(){
                    return "DemoDecorator3 specific";
                }
            }
        });

        DemoDecorator4 = Decorator.extend({
            constructor: function(decoratedObject){
                decoratedObject = Decorator.apply(this, arguments);
                return decoratedObject;
            },
            newMethods: {
                demo: function(){
                    var oldDemoFn = this.overriddenMethod('demo');
                    return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator IV)';
                },
                demoDecorator4Specific: function(){
                    return "DemoDecorator4 specific";
                }
            }
        });

        DemoDecorator5 = Decorator.extend({
            constructor: function(decoratedObject){
                decoratedObject = Decorator.apply(this, arguments);
                return decoratedObject;
            },
            newMethods: {
                demo: function(){
                    var oldDemoFn = this.overriddenMethod('demo');
                    return (oldDemoFn ? oldDemoFn() : '') + ' : decorated (DemoDecorator V)';
                },
                demoDecorator5Specific: function(){
                    return "DemoDecorator5 specific";
                }
            }
        });
        
    }
});

test("Test setup: target and targetClone are the same", function(){
    deepEqual(target, targetClone, "target and targetClone are the same");
});

test("The inheritance was set up correctly", function(){
    target = new DemoDecorator2(target);
    ok(target.decoratorScope() instanceof DemoDecorator2, "The decoratorScope() method returns an instance of it's decorator constructor");
    ok(target.decoratorScope() instanceof Decorator, "The decorator constructor returned by decoratorScope() inherits from Decorator");
});

test("The target object has the decorator utility methods on it, after extension", function(){
    target = new DemoDecorator(target);
    
    equal(typeof target.removeDecorator, "function", "Checking the `removeDecorator` method exists on target.");
    equal(typeof target.overriddenMethod, "function", "Checking the `overriddenMethod` method exists on target.");
    equal(typeof target.decoratorScope, "function", "Checking the `decoratorScope` method exists on target.");
});

test("Removing the outermost decorator", function(){
    equal(target.demo(), "not decorated", "initial `demo` return value before decoration");

    target = new DemoDecorator5(new DemoDecorator4(new DemoDecorator3(new DemoDecorator2(new DemoDecorator(target)))));
    checkMethodsAfterAllDecoratorsOnFn();

    target.removeDecorator();
    equal(target.demo(), "not decorated : decorated (DemoDecorator) : decorated (DemoDecorator II) : decorated (DemoDecorator III) : decorated (DemoDecorator IV)",
        "The `demo` method is correct after removing the outermost decorator");
    ok(target.demoDecoratorSpecific() == "DemoDecorator specific"
        && target.demoDecorator2Specific() == "DemoDecorator2 specific"
        && target.demoDecorator3Specific() == "DemoDecorator3 specific"
        && target.demoDecorator4Specific() == "DemoDecorator4 specific"
        && target.demoDecorator5Specific == undefined,
        "The decorator-specific methods are on the object, except for the one belonging to the outermost.");
});

test("Removing the innermost decorator", function(){
    equal(target.demo(), "not decorated", "initial `demo` return value before decoration");

    target = new DemoDecorator5(new DemoDecorator4(new DemoDecorator3(new DemoDecorator2(new DemoDecorator(target)))));
    checkMethodsAfterAllDecoratorsOnFn();

    target.removeDecorator(DemoDecorator);
    equal(target.demo(), "not decorated : decorated (DemoDecorator II) : decorated (DemoDecorator III) : decorated (DemoDecorator IV) : decorated (DemoDecorator V)",
        "The `demo` method is correct after removing the outermost decorator");
    ok(target.demoDecoratorSpecific == undefined
        && target.demoDecorator2Specific() == "DemoDecorator2 specific"
        && target.demoDecorator3Specific() == "DemoDecorator3 specific"
        && target.demoDecorator4Specific() == "DemoDecorator4 specific"
        && target.demoDecorator5Specific() == "DemoDecorator5 specific",
        "The decorator-specific methods are on the object, except for the one belonging to the innermost.");
});

test("Removing the decorator in the middle", function(){
    equal(target.demo(), "not decorated", "initial `demo` return value before decoration");

    target = new DemoDecorator5(new DemoDecorator4(new DemoDecorator3(new DemoDecorator2(new DemoDecorator(target)))));
    checkMethodsAfterAllDecoratorsOnFn();

    target.removeDecorator(DemoDecorator3);
    equal(target.demo(), "not decorated : decorated (DemoDecorator) : decorated (DemoDecorator II) : decorated (DemoDecorator IV) : decorated (DemoDecorator V)",
        "The `demo` method is correct after removing the decorator in the middle");
    ok(target.demoDecoratorSpecific() == "DemoDecorator specific"
        && target.demoDecorator2Specific() == "DemoDecorator2 specific"
        && target.demoDecorator3Specific == undefined
        && target.demoDecorator4Specific() == "DemoDecorator4 specific"
        && target.demoDecorator5Specific() == "DemoDecorator5 specific",
        "The decorator-specific methods are on the object, except for the one that used to be in the middle.");
});

test("The initial `demo` method is fine after decorating/undecorating, but the utility methods should not be there anymore after complete undecoration", function(){
    target = new DemoDecorator5(new DemoDecorator4(new DemoDecorator3(new DemoDecorator2(new DemoDecorator(target)))));
    target.removeDecorator().removeDecorator().removeDecorator().removeDecorator().removeDecorator();

    equal(target.demo(), "not decorated", "After all decorators are moved `demo` method returns the same as before adding any decorators.");
    ok(target.demoDecoratorSpecific == undefined
        && target.demoDecoratorSpecific2 == undefined
        && target.demoDecoratorSpecific3 == undefined
        && target.demoDecoratorSpecific4 == undefined
        && target.demoDecoratorSpecific5 == undefined, "No decorator specific methods present after completely un-decorating the target.");

    ok(target.removeDecorator == undefined
        && target.overriddenMethod == undefined
        && target.decoratorScope == undefined, "No utility methods left over.");
});