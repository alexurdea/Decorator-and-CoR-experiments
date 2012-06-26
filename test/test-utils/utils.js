/*
 * Copyright (c) Philip Hutchison (http://pipwerks.com/2010/07/23/comparing-and-cloning-objects-in-javascript/)
 */
var clone_object = function (original_obj) {
    var new_obj = {};
    for(var param in original_obj) {
        if(original_obj.hasOwnProperty(param)){
            if(typeof(original_obj[param]) === "object"){
                new_obj[param] = clone_object(original_obj[param]);
            } else {
                new_obj[param] = original_obj[param];
            }
        }
    }
    return new_obj;
};