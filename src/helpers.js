"use strict";

var _ = require('underscore');

exports.modifyEvent = function (name, key) {
	var names = name.split(':');
    // inject "key" into the event name after the event type.
    // eg. "change:foo" becomes `change:${key}:foo`
    return [].concat([names[0], key], _.rest(names, 1)).join(':');
};



exports.validateInSchema = function (attr, options) {
    var results = [], child, result, key, validate;
    for (key in this.schema) {
        // Save a reference to the nested property
        child = this.children[key];

        // If validate is implemented
        if (child && typeof child.validate === 'function') {
            validate = child.validate;
            // Call validate on the nested child
            result = validate.call(child, attr[key], options);
            // If a result is returned, add it to the return results
            if (result) {
                results.push(result);
            }
        }
    }
    // If there are results, return them.
    if (results.length) {
        return results;
    }
};

