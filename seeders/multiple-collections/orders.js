const mongoose = require('mongoose');
const { schema: Product } = require('./products');
const schema = new mongoose.Schema({
    purchasedProducts: { type: [Product], default: [] },
    totalPrice: {
        type: Number,
        required: true
    },
    schema: {
        type: Number,
        required: true
    }
});

const Order = mongoose.model('orders', schema);

module.exports = { model: Order, schema };
