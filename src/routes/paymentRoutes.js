const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/crear', paymentController.crearIntencionPago);

router.get('/estado/:id', paymentController.consultarEstado);

router.post('/webhook', paymentController.recibirWebhook);

module.exports = router;