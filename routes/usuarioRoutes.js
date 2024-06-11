const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');




router.post('/adduser', userController.createUser);
router.put('/editUser/:id', userController.editUser);
router.get('/userdetails/:id', userController.getUserDetails);
router.get('/activeusers', userController.getAllActiveUsers);
router.put('/deleteuser/:id', userController.deleteUser);

router.get('/userDetailsByIdentificacion/:identificacion', userController.getUserDetailsByIdentificacion);

router.get('/userDetailsByName/:nombre', userController.getUserDetailsByName);
module.exports = router;