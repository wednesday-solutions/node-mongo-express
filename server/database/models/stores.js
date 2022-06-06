const mongoose = require('mongoose');
const { schema: userSchema } = require('database/models/users');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    admin: [userSchema]
});

const Stores = mongoose.model('stores', schema);

module.exports = { model: Stores, Stores, schema };
