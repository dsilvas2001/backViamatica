const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');

// router.post('/login', authController.login);
router.post('/login', authController.authUser);
router.post('/generateUniqueEmail', authController.generateUniqueEmail);



module.exports = router;