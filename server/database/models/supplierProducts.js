const mongoose = require('mongoose');
const { schema: Supplier } = require('./suppliers');
const { schema: Product } = require('./products');
const schema = new mongoose.Schema({
    productId: {
        type: mongoose.ObjectId,
        required: true
    },
    supplierId: {
        type: mongoose.ObjectId,
        required: true
    },
    supplier: Supplier,
    product: Product
});

const SupplierProducts = mongoose.model('supplierProducts', schema);
module.exports = { model: SupplierProducts, SupplierProducts, schema };
