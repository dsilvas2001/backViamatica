const personaModel = require('../models/personaModel');
const usuariosModel = require('../models/usuariosModel');

const rolModel = require('../models/rolModel');

const rolUsuariosModel = require('../models/rolUsuariosModel');
const rolOpcionModel = require('../models/rolOpcionModel');
const rolRolOpcionesModel = require('../models/rolRolOpcionesModel');

// ReturnRoles
exports.getAllActiveUsersWithRoles = async (req, res) => {
    try {
        const usuariosActivos = await usuariosModel.find({ Status: 'active' });

        if (!usuariosActivos.length) {
            return res.status(404).json({ msg: 'No hay usuarios activos' });
        }

        const activeUsersWithRoles = [];

        for (const usuario of usuariosActivos) {
            const rolUsuario = await rolUsuariosModel.findOne({ usuarios_idUsuario: usuario._id, estado: true });

            if (rolUsuario) {
                const rol = await rolModel.findById(rolUsuario.Rol_idRol);

                const persona = await personaModel.findById(usuario.idPersona);

                const userWithRole = {
                    idRolUsuario: rolUsuario._id,
                    idUsuario: usuario._id,
                    UserName: usuario.UserName,
                    Mail: usuario.Mail,
                    SesionActive: usuario.SesionActive,
                    Status: usuario.Status,
                    identificacion: persona.identificacion,
                    nombres: persona.nombres,
                    apellidos: persona.apellidos,
                    rol: rol ? rol.RolName : 'Sin rol asignado'
                };

                activeUsersWithRoles.push(userWithRole);
            }
        }

        res.json(activeUsersWithRoles);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};


// Search identificacion
exports.getUserDetailsWithOptions = async (req, res) => {
    const { identificacion } = req.params;

    try {
        const persona = await personaModel.findOne({ identificacion });
        if (!persona) {
            return res.status(404).json({ msg: 'No se encontró una persona con esa identificación' });
        }

        const usuario = await usuariosModel.findOne({ idPersona: persona._id, Status: 'active' });
        if (!usuario) {
            return res.status(404).json({ msg: 'No se encontró un usuario activo asociado a esa persona' });
        }

        const rolUsuario = await rolUsuariosModel.findOne({ usuarios_idUsuario: usuario._id, estado: true });
        if (!rolUsuario) {
            return res.status(404).json({ msg: 'No se encontró un rol activo asignado a ese usuario' });
        }

        const rol = await rolModel.findById(rolUsuario.Rol_idRol);
        if (!rol) {
            return res.status(404).json({ msg: 'El rol asignado al usuario no existe o no está activo' });
        }

        const rolOpcionesIds = await rolRolOpcionesModel.find({ Rol_idRol: rol._id, estado: true }).select('RolOpciones_idOpcion');

        const opciones = await rolOpcionModel.find({ _id: { $in: rolOpcionesIds.map(ro => ro.RolOpciones_idOpcion) }, estado: true });

        const userDetailsWithOptions = {
            idRolUsuario: rolUsuario._id,
            idUsuario: usuario._id,
            UserName: usuario.UserName,
            Mail: usuario.Mail,
            SesionActive: usuario.SesionActive,
            Status: usuario.Status,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            rol: rol.RolName,
            opciones: opciones.map(opcion => ({
                idOpcion: opcion._id,
                OpcionName: opcion.NombreOpcion
            }))
        };

        res.json(userDetailsWithOptions);
    } catch (err) {
        console.error('Error al obtener los detalles del usuario con opciones:', err);
        res.status(500).send('Error al obtener los detalles del usuario con opciones');
    }
};

// Search ID

exports.getIDUserDetailsWithOptions = async (userId) => {
    try {
        // Buscar al usuario usando el ID de usuario
        const usuario = await usuariosModel.findOne({ _id: userId, Status: 'active' });
        if (!usuario) {
            return res.status(404).json({ msg: 'No se encontró un usuario activo asociado a esa persona' });
        }

        // Buscar a la persona usando el idPersona del usuario
        const persona = await personaModel.findById(usuario.idPersona);
        if (!persona) {

            throw new Error('No se encontró una persona con esa identificación')
        }

        const rolUsuario = await rolUsuariosModel.findOne({ usuarios_idUsuario: usuario._id, estado: true });
        console.log('Rol usuario', rolUsuario);
        if (rolUsuario === null) {

            throw new Error('No se encontró un rol activo asignado al usuario')
        }

        const rol = await rolModel.findById(rolUsuario.Rol_idRol);
        console.log('Rol', rol);

        if (!rol) {

            throw new Error('El rol asignado al usuario no existe o no está activo')
        }

        // Actualizar SesionActive a true si es false
        if (!usuario.SesionActive) {
            usuario.SesionActive = true;
            await usuario.save();
            console.log(`SesionActive actualizado a true para el usuario con ID: ${userId}`);
        }

        const rolOpcionesIds = await rolRolOpcionesModel.find({ Rol_idRol: rol._id, estado: true }).select('RolOpciones_idOpcion');

        const opciones = await rolOpcionModel.find({ _id: { $in: rolOpcionesIds.map(ro => ro.RolOpciones_idOpcion) }, estado: true });

        const userDetailsWithOptions = {
            idRolUsuario: rolUsuario._id,
            idUsuario: usuario._id,
            UserName: usuario.UserName,
            Mail: usuario.Mail,
            SesionActive: usuario.SesionActive,
            Status: usuario.Status,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            rol: rol.RolName,
            opciones: opciones.map(opcion => ({
                idOpcion: opcion._id,
                OpcionName: opcion.NombreOpcion
            }))
        };

        return userDetailsWithOptions;
    } catch (err) {
        console.error('Error al obtener los detalles del usuario con opciones:', err);
        throw err;
    }
};




exports.getActiveUsersWithRoles = async (req, res) => {
    const { rolName } = req.params;

    try {
        // Encontrar el rol por nombre
        const rol = await rolModel.findOne({ RolName: rolName });

        if (!rol) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }

        // Encontrar las relaciones rol-usuario para el rol encontrado
        const rolUsuarios = await rolUsuariosModel.find({ Rol_idRol: rol._id, estado: true });

        if (!rolUsuarios.length) {
            return res.status(404).json({ msg: 'No hay usuarios con el rol especificado' });
        }

        const activeUsersWithRoles = [];

        for (const rolUsuario of rolUsuarios) {
            const usuario = await usuariosModel.findOne({ _id: rolUsuario.usuarios_idUsuario, Status: 'active' });

            if (usuario) {
                const persona = await personaModel.findById(usuario.idPersona);

                const userWithRole = {
                    idRolUsuario: rolUsuario._id,
                    idUsuario: usuario._id,
                    UserName: usuario.UserName,
                    Mail: usuario.Mail,
                    SesionActive: usuario.SesionActive,
                    Status: usuario.Status,
                    identificacion: persona.identificacion,
                    nombres: persona.nombres,
                    apellidos: persona.apellidos,
                    rol: rol.RolName
                };

                activeUsersWithRoles.push(userWithRole);
            }
        }

        res.json(activeUsersWithRoles);
    } catch (err) {
        console.error('Error al obtener usuarios con el rol especificado:', err);
        res.status(500).send('Error al obtener usuarios con el rol especificado');
    }
};


//DELETE (UPDATE ESTADO)
exports.updateRolUsuarioStateToFalse = async (req, res) => {
    const { id } = req.params;

    try {
        const rolUsuario = await rolUsuariosModel.findById(id);

        if (!rolUsuario) {
            return res.status(404).json({ msg: 'No se encontró la relación de rol-usuario' });
        }

        rolUsuario.estado = false;
        await rolUsuario.save();

        res.json({ msg: 'Estado actualizado a false', rolUsuario });
    } catch (err) {
        console.error('Error al actualizar el estado de la relación de rol-usuario:', err);
        res.status(500).send('Error al actualizar el estado de la relación de rol-usuario');
    }
};