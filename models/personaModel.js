const mongoose = require('mongoose');

const PersonaSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    identificacion: {
        type: String,
        required: true,
        maxlength: 10,
        unique: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Persona', PersonaSchema);
