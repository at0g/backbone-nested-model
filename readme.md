# Backbone nested model

Hierarchial data for Backbone models and collections with native javascript syntax.

Features:

- Maintain attributes as hashes rather than model instances
- Access nested instances directly via model.children
- Get nested models using native syntax
- Get children of nested collection using native syntax
- Set nested models using native syntax
- Set collection children using native syntax
- Namespaced change events are emitted from children
- Nested validation
- Nested defaults

The main benefit of this library is that deeply nested models/collection can be addressed as a simple object.
 
For example:

``` javascript
// This:
model.get('child').get('property')
// Becomes this:
model.get('child.property');
// or this:
model.get('child').property;

// This:
model.get('myCollection').at(0).get('property');
// becomes this:
model.get('myCollection[0].property');
// or this:
model.get('myCollection')[0].property;
// or this:
model.get('myCollection[0]').property;
```


## Install

`npm install backbone-nested-model`

## Usage

Usage is straightforward - simply define a `schema` on your Backbone Model.
The schema is a simple object hash used to cast attributes to the defined types.
A special `children` property is created on the model that contains the model/collection instances of the nested children.


``` javascript
var DeepModel = require('backbone-nested-model').extend({
	// map attributes to models/collections 
	schema: {
		address: Backbone.Model,
		things: Backbone.Collection
	}
});

var model = new DeepModel({
	address: {
		street: '123 shady lane',
		suburb: '',
		city: 'Smallville',
		country: 'USA',
		postcode: '1234'
	},
	things: [
		{ label: 'thing 1' },
		{ label: 'thing 2' }
	]
});

model.attributes.address.street === '123 shady lane'; // true
model.attributes.address instanceof Backbone.Model // false
model.children.address instanceof Backbone.Model // true
model.get('things')[1].label === 'thing 2' // true
model.get('things[1]').label === 'thing 2' // true
```

### Model.get()

The default implementation of `Backbone.Model.get()` is overridden to allow access to nested properties using native 
 javascript syntax. A complete path can be passed as a string: `model.get('path.to.property')` - or a partial string
 path can be used with the remainder being standard javascript syntax: `model.get('path').to.property`.  


``` javascript

// ==
// Get the attributes of the first item in a nested collection
// ==
var firstOrder = myModel.get('orders[0]');
// alternatively...
var firstOrder = myModel.get('orders')[0];

// ==
// Access a property of the first item in a nested collection
// ==
var firstOrderDate = myModel.get('orders[0].date');
// alternatively...
var firstOrderDate = myModel.get('orders[0]').date;
// another way...
var firstOrderDate = myModel.get('orders')[0].date;
```

### Model.set

The default implementation of `Backbone.Model.set()` is overridden to allow nested properties to be set directly.
 The complete path can be passed as a string: `model.set('path.to.property', value)` - or as an object 
 `model.set({ path:{to:{property:value}}})`, or some combination of the two `model.set('path.to', { property: value})`. 

When dealing with nested collections, individual items can be targeted with the string notation with square brackets: 
 `model.set('myCollection[0]', value)`. 

``` javascript
// Set a nested property using dot syntax.
model.set('address.street', '321 shady lane');
model.attributes.address.street === '321 shady lane'; // true
model.changed.address.street === '321 shady lane'; // true
typeof model.changed.address.postcode === 'undefined' // true

// Set an individual model in a collection
model.set('things[1]', { label: 'the second thing'} );
model.attributes.things.length === 2; // true
model.attributes.things[1].label === 'the second thing'; // true
model.changed.things.length === 1; // true

// Reset a collection
model.set('things', [
	{ label: 'the first thing'},
	{ label: 'another thing'}
]);
model.changed.things.length === 2; // 2
```

### Events

Events are emitted when child models are changed or destroyed, with the nested path in the event name like so:
 
``` javascript
// model will emit 'change:address:street', 'change:address' and 'change' events.
model.set('address.street', 'a new value');
```

### Default values

If a models schema defines models with defaults, these child models will not created initially unless either:

- There is an attribute matching the schema key or
- The parent model defines its own defaults hash, with a key matching the schema key.

### Validation

If child model implements a validate method, calling validate on the parent will also call the child validate method,
 returning any errors. This behaviour is also triggered when calling model.save, or model.set({}, {validate: true}).
 

## Tests

There is a full suite of tests in the test directory.
To run the tests, ensure mocha is installed globally: `npm install -g mocha` and then `npm test`.
To run a code coverage report, ensure mocha and instanbul are installed globally: `npm install -g instanbul mocha` and
 then run `npm run coverage`. The code coverage report can also be viewed in a browser from the coverage directory.
