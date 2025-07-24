const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const Agendamento = require('../models/ModelAgendamento');
const Atendimento = require('../models/ModelAtendimento');
module.exports = {
    // > View da ficha de atendimento
    preencherFicha: (req, res) => {
        const idAgendamento = req.params.idAgendamento
        Agendamento.findOne({
            raw: true,
            where: {
                id: idAgendamento
            }
        }).then(agendamento => {
            res.render('atendimento', {
                agendamento
            });
        });
    },

    // > Salva as informações preenchidas no Banco de Dados
    salvarFicha: (req, res) => {
        const {
            idFicha, base, brinde, dataHora, promotor, captadorGuarany,
            canalProspeccao, qtdIngressos, plataforma, valorIngressos, dataCompra,
            jaFoiSocio, numeroTitulo, qtdVisitas, nomeCliente, dataNasc1, profissao1,
            obsProfissao1, conjuge, dataNasc2, profissao2, obsProfissao2, estadoCivil,
            tempoEstadoCivil, qtdFilhos, cidade, estado, tel1, tel2, cpfCompra,
            nomeIdadeFilhos, cartao, bandeiraCartao, observacoes
        } = req.body;

        // > Formatação de datas para formato DD/MM/AAAA - HH:MM:SS
        function isoFormat(dataInput) {
            if (!dataInput || !dataInput.includes(' - ')) return null;
            const [data, hora] = dataInput.split(' - ');
            const [dia, mes, ano] = data.split('/');
            return `${ano}-${mes}-${dia} ${hora}:00`;
        }

        const dataHoraConvertida = isoFormat(dataHora);

        // > Caso já existam dados, atualiza os campos. Senão, insere as informações preenchidas
        Atendimento.upsert({
            id: idFicha,
            base: base,
            brinde: brinde,
            dataHora: dataHoraConvertida,
            promotor: promotor,
            captadorGuarany: captadorGuarany,
            canalProspeccao: canalProspeccao,
            qtdIngressos,
            plataforma: plataforma,
            valorIngressos: valorIngressos.replace(',', '.'),
            dataCompra,
            jaFoiSocio: jaFoiSocio,
            numeroTitulo: numeroTitulo,
            qtdVisitas: qtdVisitas,
            nomeCliente: nomeCliente,
            dataNasc1,
            profissao1: profissao1,
            obsProfissao1: obsProfissao1,
            conjuge: conjuge,
            dataNasc2: dataNasc2 || null,
            profissao2: profissao2,
            obsProfissao2: obsProfissao2,
            estadoCivil: estadoCivil,
            tempoEstadoCivil: tempoEstadoCivil,
            qtdFilhos,
            cidade: cidade,
            estado: estado,
            tel1,
            tel2,
            cpfCompra,
            nomeIdadeFilhos: nomeIdadeFilhos,
            cartao: cartao,
            bandeiraCartao: bandeiraCartao,
            observacoes: observacoes
        }).then(() => {
            // > Redireciona pra ficha de atendimento
            res.redirect(`/ficha/${idFicha}`);
        }).catch(err => {
            console.error(err);
            res.status(500).send(`Erro ao salvar ficha: ${err}`);
        });
    },

    // > Busca a ficha de atendimento pelo ID
    exibirFicha: (req, res) => {
        const id = req.params.id;
        Atendimento.findByPk(id).then(ficha => {
            if (!ficha) {
                return res.render('404')
            }
            res.render('ficha', {
                ficha: ficha
            });
        }).catch(error => {
            console.error(error);
            res.redirect('/500');
        });
    },

    // > Busca e filtra atendimentos por data e status de finalização
    listarAtendimentos: async (req, res) => {
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

        const dataFiltrada = req.query.dataFiltrada || new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dataFiltradaFormatada = new Date(dataFiltrada).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

        const dataInicio = new Date(dataFiltrada + 'T00:00:00.000Z');
        const dataFim = new Date(dataFiltrada + 'T23:59:59.999Z');

        try {
            // > Contagem de atendimentos finalizados por promotor
            const promotores = await Atendimento.findAll({
                raw: true,
                attributes: ['promotor', [Sequelize.fn('COUNT', Sequelize.col('id')), 'contagem']],
                where: {
                    dataHora: {
                        [Op.between]: [dataInicio, dataFim]
                    },
                    clienteAtendido: "true" // > Adiciona filtro para atendimentos finalizados
                },
                group: ['promotor'],
                order: [['contagem', 'DESC']]
            });

            // > Busca os atendimentos finalizados do dia filtrado
            const atendimentos = await Atendimento.findAll({
                raw: true,
                where: {
                    dataHora: {
                        [Op.between]: [dataInicio, dataFim]
                    },
                    clienteAtendido: "true" // > Adiciona filtro para atendimentos finalizados
                },
                order: [['dataHora', 'ASC']]
            });

            const atendimentosComCor = atendimentos.map(a => ({
                ...a,
                classeCor: coresPorPromotor[a.promotor] || 'cor-padrao'
            }));

            res.render('lista_atendimentos', {
                atendimentos: atendimentosComCor,
                promotores,
                dataFiltrada,
                dataFiltradaFormatada
            });
        } catch (error) {
            console.error("Erro ao buscar atendimentos:", error);
            res.status(500).send("Erro interno do servidor ao buscar atendimentos.");
        }
    },

    // > View para edição de ficha já preenchida
    editar_atendimento: (req, res) => {
        const idAtendimento = req.params.idAtendimento;

        Atendimento.findByPk(idAtendimento).then(atendimento => {
            res.render('editar_atendimento', {
                atendimento
            })
        });
    },

    // > Exclusão de atendimento
    excluir_atendimento: async (req, res) => {
        const idAtendimento = req.body.idAtendimento;

        try {
            // > Busca o atendimento antes de excluir
            const atendimento = await Atendimento.findOne({
                where: { id: idAtendimento }
            });

            if (!atendimento) {
                return res.send('Atendimento não encontrado.');
            }

            // > Extrai a parte AAAA-MM-DD da dataHora
            const dataHora = atendimento.dataHora;
            const dataFiltrada = dataHora.toISOString().split('T')[0];

            // > Exclui o atendimento
            await Atendimento.destroy({
                where: { id: idAtendimento }
            });

            console.log(`\n✅ Atendimento '${idAtendimento}' excluído com sucesso!`);
            res.redirect(`/atendimentos?dataFiltrada=${dataFiltrada}`);
        } catch (error) {
            res.send(`Erro ao excluir atendimento: ${error}`);
        }
    },

    // > View para finalização de atendimento. Busca pelo ID
    info_atendimento: (req, res) => {
        const idAtendimento = req.params.idAtendimento;

        Atendimento.findByPk(idAtendimento).then(atendimento => {
            res.render('finalizar_atendimento', {
                atendimento
            });
        });
    },

    // > Salva no Banco de dados as informações da finalização de atendimento
    finalizar_atendimento: (req, res) => {
        // > Captura as informações do Body (HTML)
        const idAtendimento = req.body.idAtendimento;
        const info_finalizacao_atendimento = {
            idAtendimento,
            dataAtendimento: req.body.dataAtendimento,
            idadeCliente: req.body.idadeCliente,
            idadeAcompanhante: req.body.idadeAcompanhante || 0,
            produto: req.body.produto,
            numeroContrato: req.body.numeroContrato,
            generoCliente: req.body.generoCliente,
            generoAcompanhante: req.body.generoAcompanhante,
            qualificacao: req.body.qualificacao,
            jaVisitou: req.body.jaVisitou,
            motivoDesqualificacao: req.body.motivoDesqualificacao,
            NC: req.body.NC,
            consultor: req.body.consultor,
            consultorGuarany: req.body.consultorGuarany,
            toGuarany: req.body.toGuarany,
            observacao: req.body.observacao,
            clienteAtendido: req.body.clienteAtendido
        };

        // > Cria ou atualiza os campos correspondentes no BD
        Atendimento.update(info_finalizacao_atendimento, {
            where: {
                id: idAtendimento
            }
        }).then(() => {
            res.redirect('/atendimentos');
        }).catch((error) => {
            res.send(`Erro ao finalizar atendimento! \n${error}`);
        });
    }
}

