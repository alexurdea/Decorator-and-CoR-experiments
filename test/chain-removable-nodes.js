var demoChain,
    DemoChainNode1, DemoChainNode2, DemoChainNode3;  // will extend the ChainNode constructor

module("Chain-removable-nodes", {
    setup: function(){
        var processFn;
        
        /**
         * A `process` method to be curried for all the extensions, to output strings like "DemoChain #<extension number>".
         * @param {number} n
         * @param {string} demoString
         */
        processFn = function(n, demoString){
            var s = (demoString ? demoString : "")  + "DemoChain #" + n + " ";

            if (this.next && typeof this.next && typeof this.next.process == "function"){
                return this.next.process(s);
            } else {
                return s;
            }
        };
        
        /* Client code: */
        DemoChainNode1 = function(){
            ChainNode.apply(this, arguments);
            this.process = _.bind(processFn, this, 1);
        };
        DemoChainNode1.prototype = _.extend({}, ChainNode.prototype);

        DemoChainNode2 = function(){
            ChainNode.apply(this, arguments);
            this.process = _.bind(processFn, this, 2);
        };
        DemoChainNode2.prototype = _.extend({}, ChainNode.prototype);

        DemoChainNode3 = function(){
            ChainNode.apply(this, arguments);
            this.process = _.bind(processFn, this, 3);
        };
        DemoChainNode3.prototype = _.extend({}, ChainNode.prototype);
         
        demoChain = _.extend({}, ChainWithRemovableNodes, {
            process: function(){
                return this.first && this.first.process();
            }
        });
    }
});

test("The nodes are added to the chain.", function(){
    demoChain.setFirst(new DemoChainNode1(new DemoChainNode2(new DemoChainNode3)));
    equal(demoChain.process(), "DemoChain #1 DemoChain #2 DemoChain #3 ", "Nodes of types DemoChainNode1, DemoChainNode2 and DemoChainNode3 have been added to chain.");
});

test("Errors thrown when removing an incorrect constructor", function(){
    demoChain.setFirst(new DemoChainNode1(new DemoChainNode2(new DemoChainNode3)));
    
    throws(function(){
        demoChain.remove();
    }, Error, "Throw Error on removal with no params.");
    
    throws(function(){
        demoChain.remove("DemoChainNode1");
    }, Error, "Throw Error on removal with incorrect constructor passed in as parameter.");
});

test("Removing a node from the front.", function(){
    demoChain.setFirst(new DemoChainNode1(new DemoChainNode2(new DemoChainNode3)));

    demoChain.remove(DemoChainNode1);
    equal(demoChain.process(), "DemoChain #2 DemoChain #3 ", "Removed the first node.");
    
    demoChain.remove(DemoChainNode1);
    equal(demoChain.process(), "DemoChain #2 DemoChain #3 ", "Try to remove the first node again.");
});

test("Removing a node from the middle.", function(){
    demoChain.setFirst(new DemoChainNode1(new DemoChainNode2(new DemoChainNode3)));

    demoChain.remove(DemoChainNode2);
    equal(demoChain.process(), "DemoChain #1 DemoChain #3 ", "Removed the middle node.");
    
    demoChain.remove(DemoChainNode2);
    equal(demoChain.process(), "DemoChain #1 DemoChain #3 ", "Try to remove the middle node again.");
});