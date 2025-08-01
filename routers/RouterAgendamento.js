const express = require('express')
const router = express.Router()
const ControllerAgendamento = require('../controllers/ControllerAgendamento');

// > View para cadastro de informações do agendamento
router.get('/', ControllerAgendamento.cadastro);

// > Salvar agendamento
router.post('/dados_agendamento', ControllerAgendamento.salvar_agendamento);

// > Listar agendamentos
router.get('/agendamentos', ControllerAgendamento.agendamentos);

// > Listar agendamentos por cada promotor
router.get('/agendamentos/:promotor', ControllerAgendamento.agendamentos_por_promotor);

// > View para edição de agendamento
router.get('/agendamento/editar/:id', ControllerAgendamento.editar_agendamento);

// > Salvar edição do agendamento
router.post('/editar_agendamento', ControllerAgendamento.salvar_edicao);

// > Excluir agendamento
router.post('/del_item', ControllerAgendamento.excluir_agendamento);

module.exports = router;