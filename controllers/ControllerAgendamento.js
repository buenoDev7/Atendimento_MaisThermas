// > Importa a tabela de agendamentos
const Sequelize = require('sequelize');
const Agendamento = require('../models/ModelAgendamento');
const Atendimento = require('../models/ModelAtendimento');

module.exports = {
    // > View que contém o form de cadastro de informações
    cadastro: (req, res) => {
        res.render('cadastro');
    },

    // > Captura as informações de agendamento do Body (HTML)
    salvar_agendamento: (req, res) => {
        const nomesAgendamento = req.body.nomesAgendamento;
        const dataAgendamento = req.body.dataAgendamento;
        const horarioAgendamento = req.body.horarioAgendamento;
        const promotor = req.body.promotor;

        // > Salva as informações de agendamento no Banco de Dados
        Agendamento.create({
            nomesAgendamento: nomesAgendamento,
            horarioAgendamento: horarioAgendamento,
            dataAgendamento: dataAgendamento,
            promotor: promotor
        }).then(agendamento => {
            console.log(`\n✅ Agendamento criado com sucesso!`);
            // > Envia o usuário para o convite
            res.render('convite', {
                agendamento: agendamento
            });
        }).catch((error) => {
            console.log(`\n❌ Erro ao criar agendamento!\n❌ ${error}`);
        });
    },

    // > Lista todos os agendamentos, identificando por cores o promotor responsável pelo agendamento
    agendamentos: (req, res) => {
        const coresPorPromotor = {
            'PAULO CESAR': 'cor-paulo',
            'Paulo Cesar': 'cor-paulo',
            'paulo cesar': 'cor-paulo',
            'TALITA LIMA': 'cor-talita',
            'Talita Lima': 'cor-talita',
            'talita lima': 'cor-talita',
            'VINICIUS MANZZATO': 'cor-vinicius',
            'Vinicius Manzzato': 'cor-vinicius',
            'vinicius manzzato': 'cor-vinicius',
            'YAN BUENO': 'cor-yan',
            'Yan Bueno': 'cor-yan',
            'yan bueno': 'cor-yan'
        };

        // > Formatação de datas para formato DD/MM/AAAA
        let dataFiltrada = req.query.dataFiltrada;
        let dataConsulta = dataFiltrada || new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0];
        let [ano, mes, dia] = dataConsulta.split('-');
        let dataFiltradaFormatada = `${dia}/${mes}/${ano}`;

        // > Consulta os promotores
        Agendamento.findAll({
            raw: true,
            attributes: [
                'promotor',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'contagem']
            ],
            where: {
                dataAgendamento: dataConsulta
            },
            group: ['promotor'],
            order: [['contagem', 'DESC']]
        }).then(promotores => {
            // >  Consulta os agendamentos
            Agendamento.findAll({
                raw: true,
                where: {
                    dataAgendamento: dataConsulta
                },
                order: [['horarioAgendamento', 'ASC']]
            }).then(agendamentos => {
                // > Consulta os atendimentos
                Atendimento.findAll({ raw: true }).then(atendimentos => {
                    const idsAtendidos = atendimentos.map(a => a.id);

                    const agendamentosComCor = agendamentos.map(a => {
                        const atendido = idsAtendidos.includes(a.id);
                        return {
                            ...a,
                            classeTexto: atendido ? 'texto-atendido' : '',
                            classeCor: coresPorPromotor[a.promotor] || 'cor-padrao'
                        };
                    });

                    res.render('agendamentos', {
                        agendamentos: agendamentosComCor,
                        promotores,
                        dataAtual: dataConsulta,
                        dataFiltradaFormatada,
                        dataFiltrada
                    });
                });
            });
        });
    },


    // > Exibe agendamentos com data filtrada
    filtrar_data: (req, res) => {
        const coresPorPromotor = {
            'PAULO CESAR': 'cor-paulo',
            'Paulo Cesar': 'cor-paulo',
            'paulo cesar': 'cor-paulo',
            'TALITA LIMA': 'cor-talita',
            'Talita Lima': 'cor-talita',
            'talita lima': 'cor-talita',
            'VINICIUS MANZZATO': 'cor-vinicius',
            'Vinicius Manzzato': 'cor-vinicius',
            'vinicius manzzato': 'cor-vinicius',
            'YAN BUENO': 'cor-yan',
            'Yan Bueno': 'cor-yan',
            'yan bueno': 'cor-yan'
        };

        // > Tratamento e formatação de datas para formato DD/MM/AAAA
        const dataFiltrada = req.query.dataFiltrada;
        const [ano, mes, dia] = dataFiltrada.split('-');
        const dataFiltradaFormatada = `${dia}/${mes}/${ano}`;

        // > Busca todos os agendamentos por promotor
        Agendamento.findAll({
            raw: true,
            attributes: [
                'promotor',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'contagem']
            ],
            where: {
                dataAgendamento: dataFiltrada
            },
            group: ['promotor'],
            order: [['contagem', 'DESC']]
        }).then(promotores => {
            // > Busca os agendamentos por promotor e por data filtrada
            Agendamento.findAll({
                raw: true,
                where: {
                    dataAgendamento: dataFiltrada
                },
                order: [['horarioAgendamento', 'ASC']]
            }).then(agendamentos => {
                const agendamentosComCor = agendamentos.map(a => ({
                    ...a,
                    classeCor: coresPorPromotor[a.promotor] || 'cor-padrao'
                }));

                res.render('agendamentos', {
                    agendamentos: agendamentosComCor,
                    promotores,
                    dataFiltrada,
                    dataFiltradaFormatada
                });
            });
        });
    },

    // > View para edição de informações do agendamento
    editar_agendamento: (req, res) => {
        const id = req.params.id
        Agendamento.findByPk(id).then(agendamento => {
            res.render('editar_agendamento', {
                agendamento
            });
        });
    },

    // > Registra a edição do agendamento no Banco de Dados
    salvar_edicao: (req, res) => {
        // > Captura os novos dados no Body (HTML)
        let novosDados = {
            nomesAgendamento: req.body.nomesAgendamento,
            dataAgendamento: req.body.dataAgendamento,
            horarioAgendamento: req.body.horarioAgendamento,
            promotor: req.body.promotor
        };

        // > Registra as mudanças no BD
        Agendamento.update(novosDados, {
            where: {
                id: req.body.idAgendamento
            }
        }).then(() => {
            // > Redireciona pro convite editado
            console.log('\n✅ Informações salvas com sucesso!');
            res.render('convite_editado', {
                novosDados
            });
        }).catch(error => {
            console.log(`❌ Erro ao atualizar agendamento!\n ❌ ${error}`);
        });
    },

    // > Exclusão de agendamento + atendimento (caso exista)
    excluir_agendamento: async (req, res) => {
        const dataAgendamento = req.body.dataAgendamento;
        const idAgendamento = req.body.idAgendamento;

        try {
            // > Deleta o atendimento com o mesmo id (se existir)
            await Atendimento.destroy({
                where: {
                    id: idAgendamento
                }
            });

            // > Depois de deletar o atendimento, deleta o agendamento
            await Agendamento.destroy({
                where: {
                    id: idAgendamento
                }
            });

            console.log('\n✅ Agendamento e atendimento excluídos com sucesso!');
            res.redirect(`/agendamentos?dataFiltrada=${dataAgendamento}`);
        } catch (error) {
            res.send(`Erro ao excluir agendamento e atendimento: ${error}`);
        }
    }
}