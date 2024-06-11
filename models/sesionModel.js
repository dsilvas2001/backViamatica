const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    FechaIngreso: {
        type: Date,
        required: true,
        default: Date.now
    },
    FechaCierre: {
        type: Date,
        default: null
    },
    IntentosFallidos: {
        type: Number,
        default: 0
    },
    usuarios_idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    }
});

module.exports = mongoose.model('session', SessionSchema);
