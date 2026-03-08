const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    address: String,
    siret: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Client', clientSchema);