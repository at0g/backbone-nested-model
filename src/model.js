"use strict";

var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('./helpers');

/**
 * Creates a hierarchical model, allowing properties to be cast via an object passed to this.schema.
 *
 */
module.exports = Backbone.Model.extend({

    // The structure of any nested models/collections,
    // defined as an object of key: value pairs.
    // The key refers to the model attribute and
    // value is the class that will be cast to.
    // For example:
    // schema: {
    //      items: Backbone.Collection,
    // }
    schema: {},

    // References to the nested child instances. Equivalent to model.attributes
    children: null,

    constructor: function (attributes, options) {
        options || (options = {});
        options.parse = true;
        this.children = {};
        Backbone.Model.call(this, attributes, options);
    },

    // Iterate through the models schema, casting each property to the appropriate class.
    parse: function (response) {
        // Return the parsed response with the mapped schema
        var keys = _.keys(this.schema);
        var mappedResponse = _.reduce(keys, _.bind(this.mapSchema, this), response);
        return mappedResponse;
    },

    mapSchema: function (response, key) {
        var EmbeddedClass, data, instance;
        data = response[key];
        if (!data && this.defaults && this.defaults[key]) {
            data = _.clone(this.defaults[key]);
        }

        if (data) {
            // Get a reference to the class defined in the schema
            EmbeddedClass = this.schema[key];

            // Create an instance of the class type.
            instance = new EmbeddedClass(data);

            // Listen for all events on the embedded models
            instance.on('all', function (name) {
                var args = _.rest(Array.prototype.slice.call(arguments, 0), 1);
                var newArgs = [].concat([helpers.modifyEvent(name, key)], args);
                this.trigger.apply(this, newArgs);

                // If the child is destroyed, don't send a 'destroy' event from this model.
                if( name === 'destroy'){
                    return;
                }
                // if the event is namespaced from a child, trigger the event from this model too
                else if( name.indexOf(':') === -1) {
                    this.trigger.apply(this, [].concat([name], args));
                }
            }, this);

            instance.on('change', function(d) {
                this.attributes[key] = _.clone(d.attributes);
            }, this);

            instance.on('destroy', function(d) {
                delete this.attributes[key];
                delete this.schema[key];
            }, this);

            // Add the instance to the response.
            this.children[key] = instance;
            response[key] = instance.toJSON();
        }

        return response;
    },

    get: function (attr) {
        return helpers.getChildAttribute(attr, this.children) || this.attributes[attr];
    },

    set: function (key, val, options) {
        var attrs, keys, child, context, attributes, prop;
        if (key === null) {
            return this;
        }

        if (typeof key === 'object') {
            attrs = key;
            options = val;
        }
        else {
            (attrs = {})[key] = val;
        }

        options || (options = {});

        if (!this._validate(attrs, options)) {
            return false;
        }

        for (prop in attrs) {
            keys = helpers.getChildKey(prop);
            child = helpers.getChild(keys.key, this.children);
            context = child;
            attributes = attrs[prop];

            // Check if the attribute
            if( prop.indexOf('.') !== -1 || prop.indexOf('[') !== -1){

                context = helpers.getChildContext(child, keys.relativeKey, attributes);
                context.child.set(context.values, options);

                // Delete the key to prevent attribute keys like "myColl[0]"
                delete attrs[prop];

                // update the nested attributes value
                attrs[keys.key] = child.toJSON();
            }
            else {
                // If the instance does not exist for the key, create it.
                if (!this.children.hasOwnProperty(prop) && this.schema.hasOwnProperty(prop)) {
                    var InstanceFactory = this.schema[prop];
                    this.children[prop] = new InstanceFactory();
                }

                // If the property exists in the children array, treat it as a model or collection respectively
                if (this.children.hasOwnProperty(prop)) {
                    child = this.children[prop];
                    var values = _.clone(attrs[prop]);
                    if (child instanceof Backbone.Collection) {
                        // If the attribute is a collection, reset it to the new values
                        child.reset(values);
                    }
                    else {
                        child.set(values, options);
                    }

                    attrs[prop] = child.toJSON();
                }
            }
        }

        return Backbone.Model.prototype.set.apply(this, [attrs, options]);
    },

    toJSON: function () {
        var res, key;

        res = Backbone.Model.prototype.toJSON.apply(this, arguments);

        // Iterate through the models children, calling toJSON on each cast instance.
        for (key in this.children) {
            // Call toJSON on the nested schema
            res[key] = this.children[key].toJSON();
        }

        // Return the json response.
        return res;
    },

    validate: function (attributes, options) {
        return helpers.validateInSchema.apply(this, arguments);
    }

});
