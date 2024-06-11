const personaModel = require("../models/personaModel");
const sesionModel = require("../models/sesionModel");
const usuariosModel = require("../models/usuariosModel");


// Item
exports.itemFailt = async (req, res) => {
    const { UserName, IntentosFallidos } = req.body;
    try {

        const usuario = await usuariosModel.findOne({ UserName, Status: 'active' });

        if (!usuario) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (IntentosFallidos > 3) {
            const updatedUsuario = await usuariosModel.findOneAndUpdate(
                { UserName },
                { Status: 'locked' },
                { new: true }
            );
            console.log('Usuario actualizado:', updatedUsuario);
            return res.status(200).json(updatedUsuario);
        }
    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).send(err);
    }
};


exports.login = async (req, res) => {
    const { usuarios_idUsuario } = req.body;

    try {
        const newSession = new sesionModel({
            usuarios_idUsuario,
            FechaIngreso: new Date()
        });

        console.log('Creando nueva sesión:', newSession);

        const session = await newSession.save();
        console.log('Sesión guardada:', session);

        const usuario = await usuariosModel.findByIdAndUpdate(
            usuarios_idUsuario,
            { SesionActive: true },
            { new: true }
        );

        if (!usuario) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        console.log('Usuario actualizado:', usuario);
        const response = {
            session,
            usuario
        };

        res.status(201).json(response);
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).send(err);
    }
};


exports.createSession = async (usuarios_idUsuario, IntentosFallidos) => {
    try {
        const newSession = new sesionModel({
            usuarios_idUsuario,
            FechaIngreso: new Date(),
            IntentosFallidos
        });

        console.log('Creando nueva sesión:', newSession);

        const session = await newSession.save();
        console.log('Sesión guardada:', session);

        await usuariosModel.findByIdAndUpdate(
            usuarios_idUsuario,
            { SesionActive: true }
        );

        return session;
    } catch (err) {
        console.log('Error al crear sesión:', err);
        throw err;
    }
};


exports.logout = async (req, res) => {
    const { usuarios_idUsuario } = req.body;

    try {

        const session = await sesionModel.findOneAndUpdate(
            { usuarios_idUsuario, FechaCierre: null },
            { FechaCierre: new Date() },
            { new: true, sort: { FechaIngreso: -1 } }
        );

        if (!session) {
            return res.status(404).json({ msg: 'Sesión abierta no encontrada' });
        }
        const usuario = await usuariosModel.findByIdAndUpdate(
            usuarios_idUsuario,
            { SesionActive: false },
            { new: true }
        );
        const response = {
            session,
            usuario
        };

        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cerrar sesión');
    }
};


//
exports.getUserSessions = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await usuariosModel.findById(id);
        console.log(usuario);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado', usuario });
        }

        const sesiones = await sesionModel.find({ usuarios_idUsuario: id });
        console.log(sesiones);
        if (!sesiones) {
            return res.status(404).json({ msg: 'No se encontraron sesiones para este usuario' });
        }

        res.json(sesiones);
    } catch (err) {
        console.error('Error al obtener las sesiones del usuario:', err);
        res.status(500).send('Error al obtener las sesiones del usuario');
    }
};


exports.getUserSessionsByIdentificacion = async (req, res) => {
    const { identificacion } = req.params;

    try {
        const persona = await personaModel.findOne({ identificacion });
        if (!persona) {
            return res.status(404).json({ msg: 'Persona no encontrada' });
        }

        const usuario = await usuariosModel.findOne({ idPersona: persona._id });
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const sesiones = await sesionModel.find({ usuarios_idUsuario: usuario._id });

        if (!sesiones.length) {
            return res.status(404).json({ msg: 'No se encontraron sesiones para este usuario' });
        }

        res.json(sesiones);
    } catch (err) {
        console.error('Error al obtener las sesiones del usuario:', err);
        res.status(500).send('Error al obtener las sesiones del usuario');
    }
};




