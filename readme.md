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
 `model.set({ path:{to:{property:value}}})`. The string notation can also be used to set individual items within a 
 collection: `model.set('myCollection[0]', value)` 


``` javascript

// Set a nested property using dot syntax.
model.set('address.street', '321 shady lane');
model.attributes.address.street === '321 shady lane'; // true

// Reset a collection
model.set('things', [
	{ label: 'the first thing'},
	{ label: 'another thing'}
]);

// Set an individual model in a collection
model.set('things[1]', { label: 'the second thing'} );
model.attributes.things.length === 2; // true
model.attributes.things[1].label === 'the second thing'; // true
```

