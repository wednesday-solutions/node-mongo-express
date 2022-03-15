const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    schema: {
        type: Number,
        required: true
    }
});

const Store = mongoose.model('stores', schema);

module.exports = { model: Store, schema };
