const personaModel = require('../models/personaModel');
const usuariosModel = require('../models/usuariosModel');


exports.checkDuplicates = async ({ identificacion, UserName, Mail, id }) => {
    let duplicatePersona = await personaModel.findOne({ identificacion });
    if (duplicatePersona && duplicatePersona._id.toString() !== id) {
        return { status: 400, msg: 'Identificación ya existe' };
    }

    let duplicateUserName = await usuariosModel.findOne({ UserName });
    if (duplicateUserName && duplicateUserName.idPersona.toString() !== id) {
        return { status: 400, msg: 'Nombre de usuario ya existe' };
    }

    let duplicateMail = await usuariosModel.findOne({ Mail });
    if (duplicateMail && duplicateMail.idPersona.toString() !== id) {
        return { status: 400, msg: 'Correo electrónico ya existe' };
    }

    return null;
};

