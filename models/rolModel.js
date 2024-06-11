const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolSchema = new Schema({
    RolName: {
        type: String, required: true, unique: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

const Rol = mongoose.model('Rol', RolSchema);
module.exports = Rol;
