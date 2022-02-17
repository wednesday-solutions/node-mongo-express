const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stores: [
        {
            ref: 'Store',
            type: 'ObjectId'
        }
    ],
    products: [
        {
            ref: 'Product',
            type: 'ObjectId'
        }
    ],
    schema: {
        type: Number,
        required: true
    }
});

const Store = mongoose.model('Store', schema);

module.exports = Store;
