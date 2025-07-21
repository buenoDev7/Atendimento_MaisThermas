const express = require('express');
const router = express.Router();
const ControllerRelatorios = require('../controllers/ControllerRelatorios');

router.get('/relatorio_agendamentos/', ControllerRelatorios.relatorio_agendamentos);

router.get('/relatorio_atendimentos', ControllerRelatorios.relatorio_atendimentos);

module.exports = router;