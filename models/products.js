const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number
    },
    quantityAverage: {
        type: Number,
        required: true
    },
    schema: {
        type: Number,
        required: true
    }
});

const Products = mongoose.model('products', schema);

module.exports = { model: Products, Products, schema };
