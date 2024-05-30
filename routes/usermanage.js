const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');




router.post('/adduser', userController.createUser);
router.get('/listuser', userController.getUsers);
router.get('/findIdUser/:id', userController.getUserById);
router.put('/editUser/:id', userController.updateUser);
//Eliminar Usuario
router.put('/updateEstado/:id', userController.updateUserEstado);
//
router.get('/findUserByEmailAndUsername', userController.getUserByEmailAndUsername);


module.exports = router;