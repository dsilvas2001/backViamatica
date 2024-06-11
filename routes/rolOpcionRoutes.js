const express = require('express');
const router = express.Router();
const rolOpcionController = require('../controllers/rolOpcionController');

router.post('/addopcion', rolOpcionController.createRolOpcion);
router.get('/listopcion', rolOpcionController.getRolOpciones);
router.get('/listopcion/:id', rolOpcionController.getRolOpcionById);
router.get('/listhabilitado', rolOpcionController.getRolOpcionByEstado);
router.put('/updateopcion/:id', rolOpcionController.updateRolOpcion);
router.put('/deleteopcion/:id', rolOpcionController.deleteRolOpcion);

module.exports = router;
