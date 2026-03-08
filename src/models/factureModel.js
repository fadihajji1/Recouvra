const mongoose = require('mongoose');

const factureSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    montant: {
        type: Number,
        required: true
    },
    dateEcheance: {
        type: Date,
        required: true
    },
    statut: {
        type: String,
        enum: ['impayée', 'payée', 'en_retard'],
        default: 'impayée'
    }
});

module.exports = mongoose.model('Facture', factureSchema);