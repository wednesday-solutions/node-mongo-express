const mongoose = require('mongoose');
const { schema: Supplier } = require('./suppliers');
const { schema: Product } = require('./products');
const schema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    supplierId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    store: Supplier,
    product: Product,
    schema: {
        type: Number,
        required: true
    }
});

const SupplierProduct = mongoose.model('supplierproducts', schema);
module.exports = { model: SupplierProduct, schema };
