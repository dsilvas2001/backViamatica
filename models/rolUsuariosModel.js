const mongoose = require('mongoose');

const rolUsuariosSchema = new mongoose.Schema
    (
        {
            Rol_idRol: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Rol',
                required: true

            },
            usuarios_idUsuario: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'usuarios',
                required: true
            }
            ,
            estado: {
                type: Boolean,
                default: true
            }
        }

    );

const rolUsuariosModel = mongoose.model('RolUsuarios', rolUsuariosSchema);

module.exports = rolUsuariosModel;
