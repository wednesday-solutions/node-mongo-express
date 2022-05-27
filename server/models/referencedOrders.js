const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    purchasedProducts: [{ ref: 'products', type: 'ObjectId' }],
    totalPrice: {
        type: Number,
        required: true
    }
});

const ReferencedOrders = mongoose.model('referenced_orders', schema);

module.exports = { model: ReferencedOrders, ReferencedOrders, schema };
