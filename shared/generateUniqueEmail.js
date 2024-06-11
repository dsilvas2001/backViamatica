
const usuariosModel = require('../models/usuariosModel');

exports.generateBaseEmail = (nombres, apellidos) => {
    const nombresParts = nombres.trim().split(' ');
    const apellidosParts = apellidos.trim().split(' ');

    const inicialNombres = nombresParts.map(part => part[0].toLowerCase()).join('');
    const emailApellidos = apellidosParts.map(part => part.toLowerCase()).join('');

    return `${inicialNombres}${emailApellidos}@gmail.com`;
};
