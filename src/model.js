"use strict";

var _ = require('underscore');
var Backbone = require('backbone');
var helpers = require('./helpers');

/**
 * Creates a non-flat model, allowing properties to be
 * cast via an object passed to this.schema.
 * For casting to be applied correctly, remember to set
 * { parse: true } when creating the model instance.
 *
 * Eg. var myModel = new Model(attrs, { parse: true});
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
            instance.on('all', function (name, d) {
                var args = _.rest(Array.prototype.slice.call(arguments, 0), 1);

                this.trigger(helpers.modifyEvent(name, key), args);

                // If the child is destroyed, don't send a 'destroy' event from this.
                if( name === 'destroy'){
                    return;
                }
                else if( name.indexOf(':') === -1) {
                    this.trigger(name, args);
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
        var dotIndex, openBracket, closeBracket, itemIndex, instanceKey, child, context;

        dotIndex = attr.indexOf('.');
        openBracket = attr.indexOf('[');

        // If the bracket comes first
        if(openBracket !== -1 && (openBracket < dotIndex || dotIndex === -1)) {
            closeBracket = attr.indexOf(']', openBracket);
            itemIndex = attr.substring(openBracket + 1, closeBracket);
            instanceKey = attr.substring(0, openBracket);

            if (this.children.hasOwnProperty(instanceKey)) {
                child = this.children[instanceKey];
                context = child.at(itemIndex);
                attr = attr.substring(closeBracket + 1);
                if (dotIndex === -1) {
                   return context.toJSON();
                } else {
                    return context.get(attr.substring(attr.indexOf('.') + 1));
                }
            }
        }
        // if the dot comes first
        else if (dotIndex !== -1 && (dotIndex < openBracket || openBracket === -1) ) {
            context = this.children[attr.substring(0, dotIndex)];
            attr = attr.substring(dotIndex + 1);
            return context.get(attr);
        }

        return this.attributes[attr];
    },

    set: function (key, val, options) {
        var attr, attrs, unset, changes, silent, changing, prev, current;
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

        for (var prop in attrs) {

            // Allow dot access to set nested properties
            if (prop.indexOf('.') > -1 && !this.attributes.hasOwnProperty(prop)) {
                var i = prop.indexOf('.');
                var instanceKey = prop.substring(0, i);
                var instanceProp = prop.substring(i + 1);
                var child;
                if (instanceKey.indexOf('[') > -1) {
                    var openBracket = instanceKey.indexOf('[');
                    var closeBracket = instanceKey.indexOf(']', openBracket);
                    var itemIndex = instanceKey.substring(openBracket + 1, closeBracket);
                    instanceKey = instanceKey.substring(0, openBracket);
                    child = this.children[instanceKey].at(itemIndex);
                }
                else {
                    child = this.children[instanceKey];
                }

                child.set(instanceProp, _.clone(attrs[prop]), options);
                attrs[instanceKey] = this.children[instanceKey].toJSON();
                delete attrs[prop];
            }
            else {
                // If the instance does not exist for the key, create it.
                if (!this.children.hasOwnProperty(prop) && this.schema.hasOwnProperty(prop)) {
                    var InstanceFactory = this.schema[prop];
                    this.children[prop] = new InstanceFactory();
                }

                if (this.children.hasOwnProperty(prop)) {
                    this.children[prop].set( _.clone(attrs[prop]), options);
                    attrs[prop] = this.children[prop].toJSON();
                }
            }
        }

        return Backbone.Model.prototype.set.apply(this, [attrs, options]);
    },

    toJSON: function () {
        var res, key;

        // Call super.toJSON
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
