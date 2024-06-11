const express = require("express");
const conectarDB = require('./config/db');
const cors = require('cors');


const app = express();
// conectamos

conectarDB();
app.use(cors())


app.use(express.json());

// Usuarios
app.use('/viamatica/usuarios', require('./routes/usuarioRoutes'));

// Sesiones
app.use('/viamatica/sessions', require('./routes/sessionsRoutes'));


//Rol
app.use('/viamatica/rol', require('./routes/rolRoutes'));

//Opciones
app.use('/viamatica/rol-opciones', require('./routes/rolOpcionRoutes'));

//Rol - Opciones
app.use('/viamatica/rol-rolOpciones', require('./routes/rolRolOpcionesRoutes'));

//Auth
app.use('/viamatica/auth', require('./routes/authRoutes'));

// RolUsuario
app.use('/viamatica/rolUser', require('./routes/rolUsuariosRoutes'));

app.listen(3000, () => console.log("Server is running"));

