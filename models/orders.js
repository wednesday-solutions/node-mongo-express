const mongoose = require('mongoose');
const { schema: productSchema } = require('@models/products');
const schema = new mongoose.Schema({
    purchasedProducts: [productSchema],
    totalPrice: {
        type: Number,
        required: true
    }
});

const Orders = mongoose.model('orders', schema);

module.exports = { Orders, schema };
