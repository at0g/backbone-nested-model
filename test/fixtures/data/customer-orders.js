"use strict";

module.exports = {
    customer: {
        id: '12345',
        name: 'Will E. Coyote',
        address: {
            street: 'nowhere',
            state: 'Arizona',
            country: 'United States of America'
        },
        emails: [
            { address: 'will.e.coyote@acme.com', primary: true }
        ]
    },
    orders: [
        {
            id: '123456789',
            items: [
                { label: 'Dynamite', quantity: 2, price: 100 },
                { label: 'Rocket Skates', quantity: 1, price: 50 }
            ]
        },
        {
            id: '123456788',
            items: [
                { label: 'Large Anvil', quantity: 1, price: 30 }
            ]
        }
    ]
};
