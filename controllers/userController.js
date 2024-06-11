const personaModel = require('../models/personaModel');
const usuariosModel = require('../models/usuariosModel');

const rolModel = require('../models/rolModel');

const rolUsuariosModel = require('../models/rolUsuariosModel');
const { checkDuplicates } = require('../shared/verificationUser');


// Añadir

exports.createUser = async (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, identificacion, UserName, Password, Mail, RolName } = req.body;

    try {
        let duplicateCheck = await checkDuplicates({ identificacion, UserName, Mail, id });
        if (duplicateCheck) {
            return res.status(duplicateCheck.status).json({ msg: duplicateCheck.msg });
        }

        const newPersona = new personaModel({
            nombres,
            apellidos,
            identificacion
        });
        const persona = await newPersona.save();

        try {
            const newUsuario = new usuariosModel({
                UserName,
                Password,
                Mail,
                idPersona: persona._id
            });
            const usuario = await newUsuario.save();

            // Buscar el rol por nombre
            const rol = await rolModel.findOne({ RolName, estado: true });
            if (!rol) {
                // Si el rol no existe o no está activo, eliminar el usuario creado
                await usuariosModel.findByIdAndDelete(usuario._id);
                await personaModel.findByIdAndDelete(persona._id);
                return res.status(400).json({ msg: 'El rol no existe o no está activo' });
            }

            // Asignar el rol al usuario
            const newRolUsuario = new rolUsuariosModel({
                Rol_idRol: rol._id,
                usuarios_idUsuario: usuario._id
            });
            await newRolUsuario.save();

            res.json({ persona, usuario, rol: rol.RolName });
        } catch (userError) {
            await usuariosModel.findByIdAndDelete(usuario._id);
            await personaModel.findByIdAndDelete(persona._id);
            res.status(500).send('Error al crear el usuario');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};


// Editar
exports.editUser = async (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, identificacion, UserName, Password, Mail } = req.body;

    try {
        // Verificar si la persona existe
        let existingPersona = await personaModel.findById(id);
        if (!existingPersona) {
            return res.status(404).json({ msg: 'Persona no encontrada' });
        }
        const duplicateCheck = await checkDuplicates({ identificacion, UserName, Mail, id });
        if (duplicateCheck) {
            return res.status(duplicateCheck.status).json({ msg: duplicateCheck.msg });
        }
        existingPersona.nombres = nombres;
        existingPersona.apellidos = apellidos;
        existingPersona.identificacion = identificacion;
        await existingPersona.save();

        const usuario = await usuariosModel.findOneAndUpdate(
            { idPersona: id },
            {
                UserName,
                Password,
                Mail
            },
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json({ persona: existingPersona, usuario });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Usuario o correo electrónico ya existen' });
        }
        res.status(500).send(err);
    }
};
// Retornar Un Usuario
exports.getUserDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const persona = await personaModel.findById(id).exec();
        if (!persona) {
            return res.status(404).json({ msg: 'Persona no encontrada' });
        }

        const usuario = await usuariosModel.findOne({ idPersona: id }).exec();
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const userDetails = {
            idUsuario: usuario._id,
            UserName: usuario.UserName,
            Password: usuario.Password,
            Mail: usuario.Mail,
            SesionActive: usuario.SesionActive,
            Status: usuario.Status,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            identificacion: persona.identificacion
        };

        res.json(userDetails);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};
// Retornar Todos
exports.getAllActiveUsers = async (req, res) => {
    try {
        const usuarios = await usuariosModel.find({ Status: 'active' }).exec();

        if (!usuarios.length) {
            return res.status(404).json({ msg: 'No hay usuarios activos' });
        }

        const activeUsersDetails = await Promise.all(usuarios.map(async (usuario) => {
            const persona = await personaModel.findById(usuario.idPersona).exec();
            return {
                idUsuario: usuario._id,
                UserName: usuario.UserName,
                Password: usuario.Password,
                Mail: usuario.Mail,
                SesionActive: usuario.SesionActive,
                Status: usuario.Status,
                nombres: persona.nombres,
                apellidos: persona.apellidos,
                identificacion: persona.identificacion
            };
        }));

        res.json(activeUsersDetails);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

// Retornar Identificacion

exports.getUserDetailsByIdentificacion = async (req, res) => {
    const { identificacion } = req.params;

    try {
        const persona = await personaModel.findOne({ identificacion }).exec();
        if (!persona) {
            return res.status(404).json({ msg: 'Persona no encontrada' });
        }

        const usuario = await usuariosModel.findOne({ idPersona: persona._id }).exec();
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const userDetails = {
            idUsuario: usuario._id,
            UserName: usuario.UserName,
            Password: usuario.Password,
            Mail: usuario.Mail,
            SesionActive: usuario.SesionActive,
            Status: usuario.Status,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            identificacion: persona.identificacion
        };

        res.json(userDetails);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

exports.getUserDetailsByName = async (req, res) => {
    const { nombre } = req.params;

    try {
        const personas = await personaModel.find({ nombres: new RegExp(nombre, 'i') }).exec();
        if (!personas.length) {
            return res.status(404).json({ msg: 'No se encontraron personas con ese nombre' });
        }

        const userDetailsList = await Promise.all(personas.map(async (persona) => {
            const usuario = await usuariosModel.findOne({ idPersona: persona._id }).exec();
            if (usuario) {
                return {
                    idUsuario: usuario._id,
                    UserName: usuario.UserName,
                    Password: usuario.Password,
                    Mail: usuario.Mail,
                    SesionActive: usuario.SesionActive,
                    Status: usuario.Status,
                    nombres: persona.nombres,
                    apellidos: persona.apellidos,
                    identificacion: persona.identificacion
                };
            }
        }));

        const filteredUserDetailsList = userDetailsList.filter(detail => detail !== undefined);
        if (!filteredUserDetailsList.length) {
            return res.status(404).json({ msg: 'No se encontraron usuarios para las personas con ese nombre' });
        }

        res.json(filteredUserDetailsList);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};



// Eliminar cambiar el estado
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await usuariosModel.findByIdAndUpdate(id, { Status: 'inactive' }, { new: true });

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json({ msg: 'Usuario marcado como inactivo', usuario });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};



