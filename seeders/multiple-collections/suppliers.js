const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    schema: {
        type: Number,
        required: true
    }
});

const Supplier = mongoose.model('suppliers', schema);
module.exports = { model: Supplier, schema };
