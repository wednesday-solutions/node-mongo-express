const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    purchasedProducts: [{ ref: 'products', type: 'ObjectId' }],
    totalPrice: {
        type: Number,
        required: true
    }
});

const ReferencedOrders = mongoose.model('referencedOrders', schema);

module.exports = { model: ReferencedOrders, ReferencedOrders, schema };
