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

const Suppliers = mongoose.model('suppliers', schema);
module.exports = { Suppliers, schema };
