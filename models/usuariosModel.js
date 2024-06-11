const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    Mail: {
        type: String,
        required: true,
        unique: true
    },
    SesionActive: {
        type: Boolean,
        default: false
    },
    Status: {
        type: String,
        default: 'active'
    },
    idPersona: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'personas',
        required: true
    }

});

module.exports = mongoose.model('usuario', UsuarioSchema);
