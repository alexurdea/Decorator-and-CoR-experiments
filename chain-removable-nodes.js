var ChainNode, ChainWithRemovableNodes;

/**
 * @constructor
 * @public {ChainNode} next
 *
 * @example
 * DemoChainNode1 = function(){
 *     ChainNode.apply(this, arguments);
 * };
 * DemoChainNode1.prototype = _.extend({}, ChainNode.prototype, {
 *     process: function(demoString){
 *         var s = (demoString ? demoString : "")  + "DemoChain #1 ";
 *         if (this.next && typeof this.next && typeof this.next.process == "function"){
 *             return this.next.process(s);
 *         } else {
 *             return s;
 *         }
 *     }
 * });
 */
ChainNode = function(next){
    this.next = next || null;
};
ChainNode.extend = Extend.extendMethod;
ChainNode.prototype = {
    /**
     * @param {ChainNode} next
     */
    setNext: function(next){
        if (!(next instanceof ChainNode)){console.log(next);
            throw new Error("must provide ChainNode as next");
        }
        
        this.next = next;
    },
    
    /**
     * Override in extensions.
     */
    process: function(){
        if (this.next && typeof this.next && typeof this.next.process == "function"){
            this.next.process();
        }
    },
    
    /**
     * @param {Function} constructor
     */
    removeDownChain: function(constructor){
        if (this.next instanceof constructor){
            this.setNext(this.next.next);
        } else {
            this.next && this.next.removeDownChain(constructor);
        }
    }
};

ChainWithRemovableNodes = {
    /**
     * @param {Array nodes}
     */
    setFirst: function(node){
        this.first = node;
    },
    
    /**
     * Override in extensions.
     */
    process: function(){},
    
    remove: function(constructor){
        if (!this.first) return;
    
        if (typeof constructor == "function"){
            // handle the first node
            if (this.first instanceof constructor){
                this.first = this.first.next;
                return;
            }
            
            this.first.removeDownChain(constructor);       
        } else {
            throw new Error("You need to provide a constructor for the removal.");
        }
    }
};
