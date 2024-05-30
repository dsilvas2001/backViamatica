const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        apellido: {
            type: String,
            required: true
        },
        identificacion: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        usuario: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        estado: {
            type: String,
            default: 'Activo'
        },
        fechaCreacion: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('usuarios', UserSchema);
