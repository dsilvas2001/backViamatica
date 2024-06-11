const express = require('express');

const router = express.Router();
const sessionsController = require('../controllers/sessionsController');


router.post('/login', sessionsController.createSession);
router.post('/logout', sessionsController.logout);
router.get('/sessionsId/:id', sessionsController.getUserSessions);


router.post('/itemfailt', sessionsController.itemFailt);


router.get('/sessionsByIdentificacion/:identificacion', sessionsController.getUserSessionsByIdentificacion);


module.exports = router;

