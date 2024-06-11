

const express = require('express');

const router = express.Router();
const rolUsuariosController = require('../controllers/rolUsuariosController');

router.get('/rolUser', rolUsuariosController.getAllActiveUsersWithRoles);

router.get('/userDetailsWithOptions/:identificacion', rolUsuariosController.getUserDetailsWithOptions);

router.get('/usersByRol/:rolName', rolUsuariosController.getActiveUsersWithRoles);


router.put('/rolUsuarioUpdate/:id', rolUsuariosController.updateRolUsuarioStateToFalse);


module.exports = router;