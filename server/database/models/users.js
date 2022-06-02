const mongoose = require('mongoose');
const constants = require('utils/constants');

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
    },
    role: {
        type: String,
        enum: Object.values(constants.SCOPE_TYPE)
    }
});

const Users = mongoose.model('users', schema);
module.exports = { model: Users, Users, schema };
