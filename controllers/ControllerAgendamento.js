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

    // > Lista todos os agendamentos, e exibe status de finalização apenas para clientes atendidos
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
        let { dataInicio, dataFim } = req.query;

        // Se dataInicio ou dataFim não forem fornecidas, use a data atual para ambos (com ajuste de fuso horário)
        if (!dataInicio || !dataFim) {
            const today = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0];
            dataInicio = today;
            dataFim = today;
        }

        // Formatação das datas para exibição
        let [anoInicio, mesInicio, diaInicio] = dataInicio.split('-');
        let dataInicioFormatada = `${diaInicio}/${mesInicio}/${anoInicio}`;
        let [anoFim, mesFim, diaFim] = dataFim.split('-');
        let dataFimFormatada = `${diaFim}/${mesFim}/${anoFim}`;

        // Condição de filtro para o Sequelize
        const dataWhereCondition = {
            dataAgendamento: {
                [Sequelize.Op.between]: [dataInicio, dataFim]
            }
        };

        // > Consulta os promotores
        Agendamento.findAll({
            raw: true,
            attributes: [
                'promotor',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'contagem']
            ],
            where: dataWhereCondition,
            group: ['promotor'],
            order: [['contagem', 'DESC']]
        }).then(promotores => {
            // > Consulta os agendamentos
            Agendamento.findAll({
                raw: true,
                where: dataWhereCondition,
                order: [['horarioAgendamento', 'ASC']]
            }).then(agendamentos => {
                // > Consulta os atendimentos
                Atendimento.findAll({ raw: true }).then(atendimentos => {
                    const agendamentosComCor = agendamentos.map(a => {
                        const atendimento = atendimentos.find(at => at.id === a.id);
                        const atendido = !!atendimento;
                        const finalizado = atendimento && atendimento.clienteAtendido === "true";
                        return {
                            ...a,
                            classeTexto: atendido ? 'texto-atendido' : '',
                            classeCor: coresPorPromotor[a.promotor] || 'cor-padrao',
                            statusFinalizacao: atendido ? (finalizado ? 'Finalizado' : 'Não finalizado') : ''
                        };
                    });

                    res.render('agendamentos', {
                        agendamentos: agendamentosComCor,
                        promotores,
                        dataInicio,
                        dataFim,
                        dataInicioFormatada,
                        dataFimFormatada,
                        dataAtual: dataFim
                    });
                });
            });
        }).catch(error => {
            console.error("Erro ao buscar agendamentos:", error);
            res.status(500).send("Erro interno do servidor.");
        });
    },

    // > Lista todos os agendamentos por cada promotor
    agendamentos_por_promotor: (req, res) => {
        // > Captura o nome do promotor da URL 
        const promotorFiltro = req.params.promotor;

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
        let { dataInicio, dataFim } = req.query;

        // > Se dataInicio ou dataFim não forem fornecidas, usa a data atual (com ajuste de fuso horário)
        if (!dataInicio || !dataFim) {
            const today = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0];
            dataInicio = today;
            dataFim = today;
        }

        // > Formatação das datas para exibição
        let [anoInicio, mesInicio, diaInicio] = dataInicio.split('-');
        let dataInicioFormatada = `${diaInicio}/${mesInicio}/${anoInicio}`;
        let [anoFim, mesFim, diaFim] = dataFim.split('-');
        let dataFimFormatada = `${diaFim}/${mesFim}/${anoFim}`;

        // > Condição de filtro para a tabela de Agendamentos
        const agendamentoCondition = {
            dataAgendamento: {
                [Sequelize.Op.between]: [dataInicio, dataFim]
            },
            promotor: promotorFiltro
        };

        // > Condição de filtro para a tabela de Atendimentos
        const atendimentoCondition = {
            promotor: promotorFiltro,
            clienteAtendido: "true", // > Já filtra para clientes atendidos (finalizados)
            dataAtendimento: {
                [Sequelize.Op.between]: [dataInicio, dataFim]
            }
        };

        // > Consulta os agendamentos para o promotor específico e intervalo de datas
        Agendamento.findAll({
            raw: true,
            where: agendamentoCondition,
            order: [['dataAgendamento', 'DESC']]
        }).then(agendamentos => {
            // > Busca os atendimentos somente para a data e promotor filtrados
            Atendimento.findAll({
                raw: true,
                where: {
                    promotor: promotorFiltro,
                    dataAtendimento: {
                        [Sequelize.Op.between]: [dataInicio, dataFim]
                    }
                }
            }).then(atendimentos => {
                const agendamentosComCor = agendamentos.map(a => {
                    const atendimento = atendimentos.find(at => at.id === a.id);
                    const atendido = !!atendimento;
                    const finalizado = atendimento && atendimento.clienteAtendido === "true";
                    return {
                        ...a,
                        classeTexto: atendido ? 'texto-atendido' : '',
                        classeCor: coresPorPromotor[a.promotor] || 'cor-padrao',
                        statusFinalizacao: atendido ? (finalizado ? 'Finalizado' : 'Não finalizado') : ''
                    };
                });

                // > Contabiliza o número de atendimentos finalizados
                const totalAtendimentos = atendimentos.filter(a => a.clienteAtendido === "true").length;
                const totalAgendamentos = agendamentos.length;
                const countAtendimentos = (totalAtendimentos / totalAgendamentos) * 100;

                // > Renderiza a view com os agendamentos filtrados
                res.render('agendamentos_por_promotor', {
                    agendamentos: agendamentosComCor,
                    // > Passa o nome do promotor para a view
                    promotorAtual: promotorFiltro,
                    dataInicio,
                    dataFim,
                    dataInicioFormatada,
                    dataFimFormatada,
                    // > Passa a contagem de atendimentos para a view
                    totalAtendimentos: totalAtendimentos,
                    totalAgendamentos: totalAgendamentos,
                    countAtendimentos: countAtendimentos
                });
            }).catch(error => {
                console.error("Erro ao buscar atendimentos para agendamentos do promotor:", error);
                res.status(500).send(`Erro interno do servidor ao consultar atendimentos: ${error}`);
            });
        }).catch(error => {
            console.error("Erro ao buscar agendamentos do promotor:", error);
            res.status(500).send(`Erro interno do servidor ao consultar agendamentos: ${error}`);
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