const mongoose = require('mongoose');
const { schema: Store } = require('./store');
const { schema: Product } = require('./products');
const schema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    storeId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    store: Store,
    product: Product,
    schema: {
        type: Number,
        required: true
    }
});

const StoreProduct = mongoose.model('store_products', schema);
module.exports = { model: StoreProduct, schema };
