
const mongoose = require('mongoose');

const RolOpcionSchema = new mongoose.Schema({
    NombreOpcion: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('RolOpcion', RolOpcionSchema);

