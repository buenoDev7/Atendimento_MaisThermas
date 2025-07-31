const ExcelJS = require('exceljs');
const Sequelize = require('sequelize');
const Agendamento = require('../models/ModelAgendamento');
const Atendimento = require('../models/ModelAtendimento');

function formatarDataBR(dataISO) {
    // > Recebe string YYYY-MM-DD (do DATEONLY), retorna DD/MM/YYYY
    // > Garante que dataISO é uma string antes do 'split'
    if (!dataISO || typeof dataISO !== 'string') {
        // > Retorna vazio ou outro valor padrão se a data for inválida
        return '';
    }
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

module.exports = {
    // > Relatório de Agendamentos por intervalo de datas
    relatorio_agendamentos: async (req, res) => {
        try {
            // > Define data de início e fim
            let { dataInicio, dataFim } = req.query;

            // > Usa data atual se não fornecida
            if (!dataInicio || !dataFim) {
                const today = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0];
                dataInicio = today;
                dataFim = today;
            }

            // > Busca agendamentos no período
            const agendamentos = await Agendamento.findAll({
                raw: true,
                where: {
                    dataAgendamento: {
                        [Sequelize.Op.between]: [dataInicio, dataFim]
                    }
                },
                order: [['dataAgendamento', 'ASC']]
            });

            // > Cria planilha Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Agendamentos');

            // > Cabeçalhos da planilha
            worksheet.columns = [
                { header: 'Data', key: 'dataAgendamento', width: 12 },
                { header: 'Nomes', key: 'nomesAgendamento', width: 30 },
                { header: 'Promotor', key: 'promotor', width: 15 },
                { header: 'Horário', key: 'horarioAgendamento', width: 10 }
            ];

            // > Adiciona linhas à planilha
            agendamentos.forEach(item => {
                worksheet.addRow({
                    dataAgendamento: formatarDataBR(item.dataAgendamento),
                    nomesAgendamento: item.nomesAgendamento,
                    promotor: item.promotor,
                    horarioAgendamento: item.horarioAgendamento ? item.horarioAgendamento.slice(0, 5) : ''
                });
            });

            // > Define nome do arquivo
            let nomeDataArquivo;
            if (dataInicio === dataFim) {
                nomeDataArquivo = formatarDataBR(dataInicio).replace(/\//g, '-');
            } else {
                nomeDataArquivo = `${formatarDataBR(dataInicio).replace(/\//g, '-')}_a_${formatarDataBR(dataFim).replace(/\//g, '-')}`;
            }
            const nomeArquivo = `Agendamentos_${nomeDataArquivo}.xlsx`;

            // > Configura headers para download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${nomeArquivo}`);

            // > Envia o arquivo
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            // > Loga erro e envia resposta de erro
            console.error('❌ Erro ao gerar relatório:', error);
            res.status(500).send('Erro ao gerar relatório');
        }
    },


    // > Relatório de Atendimentos por data filtrada ou data atual, filtrando apenas clientes com qualificacao = "Q"
    relatorio_atendimentos: async (req, res) => {
        const { Op } = require('sequelize')
        try {
            // > Obtém as datas de início e fim do filtro da requisição
            // > Se não houver data de início, usa a data atual (UTC-3)
            const dataInicioFiltro = req.query.dataInicio || new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0];

            // > Se não houver data de fim, usa a data de início do filtro como data final
            const dataFimFiltro = req.query.dataFim || dataInicioFiltro;

            // > Busca os atendimentos dentro do intervalo de datas e filtra por qualificacao = "Q"
            const atendimentos = await Atendimento.findAll({
                raw: true,
                where: {
                    dataAtendimento: {
                        [Op.between]: [dataInicioFiltro, dataFimFiltro]
                    },
                    qualificacao: "Q" // > Filtra apenas atendimentos com qualificacao = "Q"
                },
                order: [['updatedAt', 'ASC']]
            });

            // Log para depuração: Contagem de registros encontrados
            console.log(`\n\nAtendimentos encontrados para o período de ${dataInicioFiltro} a ${dataFimFiltro}: ${atendimentos.length}`);

            // > Cria planilha Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Atendimentos');

            // > Cabeçalhos
            worksheet.columns = [
                { header: 'DATA', key: 'dataFormatada', width: 15 },
                { header: 'PRODUTO', key: 'produto', width: 15 },
                { header: 'TITULO', key: 'numeroContrato', width: 15 },
                { header: 'NOME', key: 'nomeCliente', width: 35 },
                { header: 'CPF', key: 'cpfCompra', width: 15 },
                { header: 'NASCIMENTO', key: 'dataNasc1', width: 15 },
                { header: 'IDADE', key: 'idadeCliente', width: 10 },
                { header: 'GENERO', key: 'generoCliente', width: 15 },
                { header: 'TELEFONE', key: 'tel1', width: 15 },
                { header: 'ESTADO CIVIL', key: 'estadoCivil', width: 20 },
                { header: 'PROFISSAO', key: 'profissao1', width: 35 },
                { header: 'ESTADO', key: 'estado', width: 15 },
                { header: 'CIDADE', key: 'cidade', width: 25 },
                { header: 'FILHOS', key: 'qtdFilhos', width: 10 },
                { header: 'NOME ACOMP', key: 'conjuge', width: 35 },
                { header: 'NASC ACOMP', key: 'dataNasc2', width: 15 },
                { header: 'IDADE ACOMP', key: 'idadeAcompanhante', width: 15 },
                { header: 'GENERO ACOMP', key: 'generoAcompanhante', width: 15 },
                { header: 'PROFISSAO ACOMP', key: 'profissao2', width: 30 },
                { header: 'BASE', key: 'base', width: 15 },
                { header: 'VISITA THERMAS', key: 'jaVisitou', width: 15 },
                { header: 'QTD VEZES', key: 'qtdVisitas', width: 15 },
                { header: 'POSSUI CARTAO', key: 'cartao', width: 15 },
                { header: 'QUALIFICACAO', key: 'qualificacao', width: 15 },
                { header: 'CANAL PROSPECCAO', key: 'canalProspeccao', width: 15 },
                { header: 'BRINDE', key: 'brindeCompra', width: 15 },
                { header: 'MOTIVO DESQUALIFICA', key: 'motivoDesqualificacao', width: 15 },
                { header: 'MOTIVO NAO COMPRA', key: 'NC', width: 15 },
                { header: 'CONSULTOR', key: 'consultor', width: 15 },
                { header: 'PROMOTOR', key: 'promotor', width: 15 },
                { header: 'CONSULTOR GUARANY', key: 'consultorGuarany', width: 15 },
                { header: 'CAPTADOR GUARANY', key: 'captadorGuarany', width: 15 },
                { header: 'T.O GUARANY', key: 'toGuarany', width: 15 },
                { header: 'OBSERVACAO', key: 'observacao', width: 35 },
            ];

            // > Adiciona linhas ao Excel com apenas textos em MAIÚSCULO
            atendimentos.forEach(atendimento => {
                worksheet.addRow({
                    dataFormatada: formatarDataBR(atendimento.dataAtendimento || ''),
                    produto: atendimento.produto?.toUpperCase() || '',
                    numeroContrato: atendimento.numeroContrato || '',
                    nomeCliente: atendimento.nomeCliente?.toUpperCase() || '',
                    cpfCompra: atendimento.cpfCompra || '',
                    dataNasc1: formatarDataBR(atendimento.dataNasc1 || ''),
                    idadeCliente: atendimento.idadeCliente,
                    generoCliente: atendimento.generoCliente?.toUpperCase() || '',
                    tel1: atendimento.tel1,
                    estadoCivil: atendimento.estadoCivil?.toUpperCase() || '',
                    profissao1: atendimento.profissao1?.toUpperCase() || '',
                    estado: atendimento.estado?.toUpperCase() || '',
                    cidade: atendimento.cidade?.toUpperCase() || '',
                    qtdFilhos: atendimento.qtdFilhos,
                    conjuge: atendimento.conjuge?.toUpperCase() || '',
                    dataNasc2: atendimento.dataNasc2 ? formatarDataBR(atendimento.dataNasc2) : '',
                    idadeAcompanhante: atendimento.idadeAcompanhante,
                    generoAcompanhante: atendimento.generoAcompanhante?.toUpperCase() || '',
                    profissao2: atendimento.profissao2?.toUpperCase() || '',
                    qualificacao: atendimento.qualificacao?.toUpperCase() || '',
                    base: atendimento.base?.toUpperCase() || '',
                    jaVisitou: atendimento.jaVisitou?.toUpperCase() || '',
                    qtdVisitas: atendimento.qtdVisitas ? atendimento.qtdVisitas.slice(0, 1) : '',
                    cartao: atendimento.cartao?.toUpperCase() || '',
                    canalProspeccao: atendimento.canalProspeccao?.toUpperCase() || '',
                    brindeCompra: atendimento.brindeCompra,
                    motivoDesqualificacao: atendimento.motivoDesqualificacao?.toUpperCase(),
                    NC: atendimento.NC?.toUpperCase() || '',
                    consultor: atendimento.consultor?.toUpperCase() || '',
                    promotor: atendimento.promotor?.toUpperCase() || '',
                    consultorGuarany: atendimento.consultorGuarany?.toUpperCase(),
                    captadorGuarany: atendimento.captadorGuarany?.toUpperCase() || '',
                    toGuarany: atendimento.toGuarany?.toUpperCase() || '',
                    observacao: atendimento.observacao?.toUpperCase() || ''
                });
            });

            // Aplica fonte Arial 12 em todo cabeçalho
            worksheet.getRow(1).eachCell(cell => {
                cell.font = { name: 'Arial', size: 12 };
            });

            // Aplica fonte Arial 12 em todas as células de dados
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber !== 1) {
                    row.eachCell(cell => {
                        cell.font = { name: 'Arial', size: 12 };
                    });
                }
            });

            // > Define o nome do arquivo com base no intervalo de datas
            let nomeDataArquivo;
            const [diaInicio, mesInicio, anoInicio] = dataInicioFiltro.split('-').reverse(); // Formato YYYY-MM-DD para DD-MM-YYYY
            const [diaFim, mesFim, anoFim] = dataFimFiltro.split('-').reverse();

            if (dataInicioFiltro === dataFimFiltro) {
                nomeDataArquivo = `${diaInicio}-${mesInicio}-${anoInicio}`;
            } else {
                nomeDataArquivo = `${diaInicio}-${mesInicio}-${anoInicio}_a_${diaFim}-${mesFim}-${anoFim}`;
            }
            const nomeArquivo = `Atendimentos_Qualificados_${nomeDataArquivo}.xlsx`;

            // Headers para download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);

            // Envia o arquivo para o browser
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error('❌ Erro ao gerar relatório de atendimentos:', error);
            res.status(500).json({ success: false, message: 'Erro interno do servidor ao gerar o relatório de atendimentos.', error: error.message });
        }
    }
}