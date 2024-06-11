const express = require('express');

const router = express.Router();
const rolRolOpcionesController = require('../controllers/rolRolOpcionesController');




router.post('/rol-rolOpciones', rolRolOpcionesController.assignOptionToRol);

// ROL


router.get('/rol-rolOpciones/:rolId', rolRolOpcionesController.getOptionsByRol);

router.get('/rol-rolOpcionesAll/:rolId', rolRolOpcionesController.getActiveOptionsByRol);


//Opciones

router.get('/opcion-roles/:opcionId', rolRolOpcionesController.getRolesByOption);

router.get('/opcion-rolesAll/:RolOpciones_idOpcion', rolRolOpcionesController.getActiveAssignmentsByOpcion);

//ESTADO

router.put('/deactivateAssignment/:id', rolRolOpcionesController.deactivateAssignment);








module.exports = router;