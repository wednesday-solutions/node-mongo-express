const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    purchasedProducts: {
        type: []
    },
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
