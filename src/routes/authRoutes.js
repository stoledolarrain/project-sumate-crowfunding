const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.get('/activar/:codigo', authController.activar);
router.post('/login', authController.login);

module.exports = router;