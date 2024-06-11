const mongoose = require('mongoose');

const RolRolOpcionesSchema = new mongoose.Schema({
    Rol_idRol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol',
        required: true
    },
    RolOpciones_idOpcion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RolOpcion',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('RolRolOpciones', RolRolOpcionesSchema);
