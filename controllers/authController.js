const usuariosModel = require("../models/usuariosModel");
const { generateBaseEmail } = require("../shared/generateUniqueEmail");
const sessionsController = require('../controllers/sessionsController');
const rolUsuariosController = require('../controllers/rolUsuariosController');

// exports.login = async (req, res) => {
//     const { UserName, Password } = req.body;

//     try {
//         const usuario = await usuariosModel.findOne({ UserName });

//         if (!usuario) {
//             return res.status(404).json({ msg: 'Usuario no encontrado' });
//         }

//         if (!usuario.Status) {
//             return res.status(403).json({ msg: 'Usuario está inactivo' });
//         }

//         const isPasswordCorrect = (Password === usuario.Password); // Aquí deberías comparar contraseñas cifradas

//         if (!isPasswordCorrect) {
//             // Actualizar intentos fallidos
//             const now = new Date();
//             let updateData = {
//                 failedLoginAttempts: usuario.failedLoginAttempts + 1,
//                 lastFailedLoginAttempt: now
//             };

//             // Si el usuario ha fallado 3 veces, cambiar estado a inactivo
//             if (updateData.failedLoginAttempts >= 3) {
//                 updateData.Status = false;
//             }

//             await usuariosModel.findByIdAndUpdate(usuario._id, updateData);

//             return res.status(401).json({ msg: 'Contraseña incorrecta' });
//         }

//         // Restablecer el contador de intentos fallidos si el login es exitoso
//         await usuariosModel.findByIdAndUpdate(usuario._id, { failedLoginAttempts: 0, lastFailedLoginAttempt: null });

//         res.json({ msg: 'Login exitoso', user: usuario });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error al iniciar sesión');
//     }
// };


// Email


exports.authUser = async (req, res) => {
    try {
        // Obtener las credenciales del cuerpo de la solicitud
        const { UserName, Mail, IntentosFallidos } = req.body;

        const usuario = await usuariosModel.findOne({ $or: [{ UserName }, { Mail }] });


        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const userol = await rolUsuariosController.getIDUserDetailsWithOptions(usuario._id);


        // Crear sesión
        const session = await sessionsController.createSession(usuario._id, IntentosFallidos);

        // Devolver respuesta con la sesión creada
        res.status(201).json({ userol });
    } catch (err) {
        console.log('Error al iniciar sesión:', err);
        res.status(500).send({
            message: err.message.toString()
        });
    }
};


exports.generateUniqueEmail = async (req, res) => {
    const { nombres, apellidos } = req.body;

    if (!nombres || !apellidos) {
        return res.status(400).json({ msg: 'Nombres y apellidos son requeridos' });
    }

    const baseEmail = generateBaseEmail(nombres, apellidos);

    try {
        let email = baseEmail;
        let counter = 1;

        const emailExists = async (email) => {
            const user = await usuariosModel.findOne({ Mail: email });
            return !!user;
        };

        while (await emailExists(email)) {
            const emailParts = baseEmail.split('@');
            email = `${emailParts[0]}${counter}@${emailParts[1]}`;
            counter++;
        }

        res.json({ uniqueEmail: email });
    } catch (err) {
        console.error('Error generating unique email:', err);
        res.status(500).send('Error generating unique email');
    }
};
