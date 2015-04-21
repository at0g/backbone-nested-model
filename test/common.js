"use strict";

var Backbone = require('backbone');
var chai = require('chai');
var path = require('path');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.Backbone = Backbone;
global.should = chai.should();
global.sinon = sinon;

global.pathToSrc = function (file) {
    var resolvedPath = path.join(__dirname, '../src', file);
    return resolvedPath;
};