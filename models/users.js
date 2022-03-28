const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    authId: {
        type: String
    }
});

const Users = mongoose.model('Users', schema);
module.exports = { model: Users, Users, schema };
