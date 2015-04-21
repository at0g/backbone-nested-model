"use strict";

var _ = require('underscore');
var Backbone = require('backbone');

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

exports.getChildAttribute = function (attr, children) {

    var dotIndex, openBracket, dotFirst, bracketFirst, closeBracket, itemIndex, instanceKey, child;
    dotIndex = attr.indexOf('.');
    openBracket = attr.indexOf('[');

    // Check which comes first - dot or bracket?
    dotFirst = dotIndex !== -1 && (dotIndex < openBracket || openBracket === -1);
    bracketFirst = openBracket !== -1 && (openBracket < dotIndex || dotIndex === -1);

    if (dotFirst) {
        instanceKey = attr.substring(0, dotIndex);
        child = children[instanceKey].get(attr.substring(dotIndex + 1));
        return child;
    }
    else if (bracketFirst) {
        closeBracket = attr.indexOf(']', openBracket);
        itemIndex = attr.substring(openBracket + 1, closeBracket);
        instanceKey = attr.substring(0, openBracket);

        if (children.hasOwnProperty(instanceKey)) {
            child = children[instanceKey];
            var context = child.at(itemIndex);
            if (!context) {
                return;
            }
            attr = attr.substring(closeBracket + 1);
            if (dotIndex === -1) {
                return context.toJSON();
            } else {
                return context.get(attr.substring(attr.indexOf('.') + 1));
            }
        }
        else {
            return;
        }
    }
};


exports.getChildContext = function (child, key, values) {

    var context, closeBracket, itemIndex, propAfterDot, wrapped;

    if (child instanceof Backbone.Collection) {
        closeBracket = key.indexOf(']');
        itemIndex = parseInt(key.substring(1, closeBracket), 10);
        context = child.at(itemIndex);
    }

    if(key.indexOf('.') !== -1) {
        // Get the property after the dot
        propAfterDot = key.substring(key.indexOf('.') + 1);

        // wrap attributes
        wrapped = {};
        wrapped[propAfterDot] = values;
        // Reassign wrapped attributes to values
        values = wrapped;
    }

    return {
        child: context || child,
        values: values
    };
};



exports.getChildKey = function (key) {
    var dotIndex, openBracket, dotFirst, bracketFirst, instanceKey;

    dotIndex = key.indexOf('.');
    openBracket = key.indexOf('[');

    // Check which comes first - dot or bracket?
    dotFirst = dotIndex !== -1 && (dotIndex < openBracket || openBracket === -1);
    bracketFirst = openBracket !== -1 && (openBracket < dotIndex || dotIndex === -1);

    if (dotFirst) {
        instanceKey = key.substring(0, dotIndex);
    }
    else if (bracketFirst) {
        instanceKey = key.substring(0, openBracket);
    }
    else {
        instanceKey = key
    }

    return {
        key: instanceKey,
        relativeKey: instanceKey !== key ? key.replace(instanceKey, '') : key
    };
};

exports.getChild = function (key, children) {
    return children[key];
};
