var Model = require(pathToSrc('model.js'));
var Collection = Backbone.Collection;

var CustomerModel = Model.extend({
    schema: {
        address: Model
    }
});

var OrderModel = Model.extend({
    schema: {
        items: Collection
    }
});

var Orders = Collection.extend({
    model: OrderModel
});

var CustomerOrdersModel = Model.extend({
    schema: {
        customer: CustomerModel,
        orders: Orders
    }
});

module.exports = CustomerOrdersModel;