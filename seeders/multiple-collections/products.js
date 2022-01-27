const mongoose = require("mongoose")
const schema = new mongoose.Schema({
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
    }
});

const Product = mongoose.model('Product', schema);

module.exports = Product;