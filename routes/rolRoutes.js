

const express = require('express');

const router = express.Router();
const rolController = require('../controllers/rolController');

router.post('/roles', rolController.createRol);
router.get('/roles', rolController.getRoles);
router.get('/roles/:id', rolController.getRolById);
router.get('/rolsActive', rolController.getActiveRol);



router.put('/roles/:id', rolController.updateRol);
router.put('/deactivateRol/:id', rolController.deactivateRol);

router.put('/reactivateRol/:id', rolController.reactivateRol);




module.exports = router;