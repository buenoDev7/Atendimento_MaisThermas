const ExcelJS = require('exceljs');
const Sequelize = require('sequelize');
const Agendamento = require('../models/ModelAgendamento');
const Atendimento = require('../models/ModelAtendimento');

function formatarDataBR(dataISO) {
    // > Recebe string YYYY-MM-DD (do DATEONLY), retorna DD/MM/YYYY
    // > Garante que dataISO é uma string antes do 'split'
    if (!dataISO || typeof dataISO !== 'string') {
        return ''; // Retorna vazio ou outro valor padrão se a data for inválida
    }
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

module.exports = {
    relatorio_agendamentos: async (req, res) => {
        try {
            // > Data filtrada ou atual
            let dataFiltrada = req.query.dataFiltrada;
            let dataConsulta = dataFiltrada || new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0];


            console.log(dataConsulta)
            // > Busca os agendamentos do dia
            const agendamentos = await Agendamento.findAll({
                raw: true,
                where: { dataAgendamento: dataConsulta },
                order: [['horarioAgendamento', 'ASC']]
            });

            // > Cria planilha Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Agendamentos');

            // > Cabeçalhos
            worksheet.columns = [
                { header: 'Data', key: 'dataAgendamento', width: 12 },
                { header: 'Nomes', key: 'nomesAgendamento', width: 30 },
                { header: 'Promotor', key: 'promotor', width: 12 },
            ];

            // > Adiciona linhas com data formatada em DD/MM/YYYY
            agendamentos.forEach(item => {
                worksheet.addRow({
                    dataAgendamento: formatarDataBR(item.dataAgendamento),
                    nomesAgendamento: item.nomesAgendamento,
                    promotor: item.promotor
                });
            });

            // > Nome do arquivo com data formatada (underscores para ficar clean)
            const nomeDataArquivo = formatarDataBR(dataConsulta).replace(/\//g, '-'); // ex: 19-07-2025
            const nomeArquivo = `Agendamentos_${nomeDataArquivo}.xlsx`;

            // > Headers para download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${nomeArquivo}`);

            // > Envia o arquivo para o browser
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error('❌ Erro ao gerar relatório:', error);
            res.status(500).send('Erro ao gerar relatório');
        }
    },

    relatorio_atendimentos: async (req, res) => {
        try {
            let dataFiltrada = req.query.dataFiltrada;
            // Se não houver data filtrada, usa a data atual (YYYY-MM-DD)
            let dataConsulta = dataFiltrada || new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0];

            // > Busca os atendimentos diretamente pela string da data, já que é DATEONLY
            const atendimentos = await Atendimento.findAll({
                raw: true, // Garante que os dados vêm como objetos JavaScript planos
                where: {
                    dataAtendimento: dataConsulta // Compara diretamente a string 'YYYY-MM-DD'
                },
                order: [['updatedAt', 'ASC']]
            });

            // Log para depuração: Verifique o que vem do banco
            console.log('Atendimentos encontrados para', dataConsulta, ':', atendimentos.length);
            // console.log(atendimentos); // Descomente para ver os dados brutos

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
                { header: 'QUALIFICACAO', key: 'qualificacao', width: 15 },
                { header: 'BASE', key: 'base', width: 15 },
                { header: 'VISITA THERMAS', key: 'jaVisitou', width: 15 },
                { header: 'QTD VEZES', key: 'qtdVisitas', width: 15 },
                { header: 'POSSUI CARTAO', key: 'cartao', width: 15 },
                { header: 'CANAL PROSPECCAO', key: 'canalProspeccao', width: 15 },
                { header: 'BRINDE', key: 'brinde', width: 15 },
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
                    // dataAtendimento já é uma string 'YYYY-MM-DD' por causa de raw: true e DATEONLY
                    dataFormatada: formatarDataBR(atendimento.dataAtendimento || ''),
                    produto: atendimento.produto?.toUpperCase() || '',
                    numeroContrato: atendimento.numeroContrato || '',
                    nomeCliente: atendimento.nomeCliente?.toUpperCase() || '',
                    cpfCompra: atendimento.cpfCompra || '',
                    dataNasc1: formatarDataBR(atendimento.dataNasc1 || ''), // dataNasc1 também é DATEONLY
                    idadeCliente: atendimento.idadeCliente,
                    generoCliente: atendimento.generoCliente?.toUpperCase() || '',
                    tel1: atendimento.tel1,
                    estadoCivil: atendimento.estadoCivil?.toUpperCase() || '',
                    profissao1: atendimento.profissao1?.toUpperCase() || '',
                    estado: atendimento.estado?.toUpperCase() || '',
                    cidade: atendimento.cidade?.toUpperCase() || '',
                    qtdFilhos: atendimento.qtdFilhos,
                    conjuge: atendimento.conjuge?.toUpperCase() || '',
                    // dataNasc2 pode ser null, então verifica antes de formatar
                    dataNasc2: atendimento.dataNasc2 ? formatarDataBR(atendimento.dataNasc2) : '',
                    idadeAcompanhante: atendimento.idadeAcompanhante,
                    generoAcompanhante: atendimento.generoAcompanhante?.toUpperCase() || '',
                    profissao2: atendimento.profissao2?.toUpperCase() || '',
                    qualificacao: atendimento.qualificacao?.toUpperCase() || '',
                    base: atendimento.base?.toUpperCase() || '',
                    jaVisitou: atendimento.jaVisitou?.toUpperCase() || '',
                    qtdVisitas: atendimento.qtdVisitas ? atendimento.qtdVisitas.slice(0, 1) : '', // Verificação para qtdVisitas
                    cartao: atendimento.cartao?.toUpperCase() || '',
                    canalProspeccao: atendimento.canalProspeccao?.toUpperCase() || '',
                    brinde: atendimento.brinde?.toUpperCase() || '',
                    motivoDesqualificacao: atendimento.motivoDesqualificacao?.toUpperCase() || '',
                    NC: atendimento.NC?.toUpperCase() || '',
                    consultor: atendimento.consultor?.toUpperCase() || '',
                    promotor: atendimento.promotor?.toUpperCase() || '',
                    consultorGuarany: atendimento.consultorGuarany?.toUpperCase() || '',
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

            // Nome do arquivo com data formatada
            const [ano, mes, dia] = dataConsulta.split('-');
            const nomeDataArquivo = `${dia}-${mes}-${ano}`;
            const nomeArquivo = `Atendimentos_${nomeDataArquivo}.xlsx`;

            // Headers para download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${nomeArquivo}`);

            // Envia o arquivo para o browser
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error('❌ Erro ao gerar relatório de atendimentos:', error);
            // Retorne uma resposta mais clara em caso de erro
            res.status(500).json({ success: false, message: 'Erro interno do servidor ao gerar o relatório de atendimentos.', error: error.message });
        }
    }

}