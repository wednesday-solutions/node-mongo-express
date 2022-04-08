const mongoose = require('mongoose');
const { schema: productSchema } = require('models/products');
const schema = new mongoose.Schema({
    purchasedProducts: [productSchema],
    totalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Orders = mongoose.model('orders', schema);

module.exports = { model: Orders, Orders, schema };
