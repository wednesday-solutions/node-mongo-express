const mongoose = require('mongoose');
const { schema: Store } = require('./stores');
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
    product: Product
});

const StoreProducts = mongoose.model('store_products', schema);
module.exports = { model: StoreProducts, StoreProducts, schema };
