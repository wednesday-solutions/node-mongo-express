const mongoose = require('mongoose');
const { schema: userSchema } = require('database/models/users');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admin: [userSchema]
});

const Suppliers = mongoose.model('suppliers', schema);
module.exports = { model: Suppliers, Suppliers, schema };
