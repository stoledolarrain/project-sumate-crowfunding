const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/usuarios', adminController.listarAdmins); 
router.post('/usuarios', adminController.crearAdmin); 
router.put('/usuarios/:id', adminController.editarAdmin);
router.delete('/usuarios/:id', adminController.eliminarAdmin); 

module.exports = router;