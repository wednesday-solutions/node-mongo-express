const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    purchasedProducts: [{ ref: 'products', type: 'ObjectId' }],
    totalPrice: {
        type: Number,
        required: true
    }
});

const UnshardedReferencedOrders = mongoose.model(
    'unshardedReferencedOrders',
    schema
);

module.exports = {
    model: UnshardedReferencedOrders,
    UnshardedReferencedOrders,
    schema
};
