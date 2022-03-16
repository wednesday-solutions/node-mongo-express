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
    supplier: Supplier,
    product: Product,
    schema: {
        type: Number,
        required: true
    }
});

const SupplierProducts = mongoose.model('supplier_products', schema);
module.exports = { SupplierProducts, schema };
