const express = require('express');
const router = express.Router();
const ControllerAtendimento = require('../controllers/ControllerAtendimento');

// > View para preenchimento de ficha
router.get('/atendimento/:idAgendamento', ControllerAtendimento.preencherFicha);

// > Salvar informações da ficha
router.post('/ficha_atendimento', ControllerAtendimento.salvarFicha);

// > Exibir ficha preenchida
router.get('/ficha/:id', ControllerAtendimento.exibirFicha);

// > Exibir lista de atendimentos por data atual e filtrada
router.get('/atendimentos', ControllerAtendimento.listarAtendimentos);

// > Excluir atendimento
router.post('/del_ficha', ControllerAtendimento.excluir_atendimento);

// > View para editar informações do atendimento
router.get('/atendimento/editar/:idAtendimento', ControllerAtendimento.editar_atendimento);

// > View para finalizar atendimento
router.get('/finalizar_atendimento/:idAtendimento', ControllerAtendimento.info_atendimento);

// > Salva as informações de finalização do atendimento
router.post('/finalizar_atendimento', ControllerAtendimento.finalizar_atendimento);

module.exports = router;