const Sequelize = require('sequelize');
const db_connection = require('../database/db_connection');
const Agendamento = db_connection.define('agendamento', {
    // > Tabela de informações do Agendamento
    nomesAgendamento: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo "nomesAgendamento" não pode ser vazio!'
            }
        }
    },

    horarioAgendamento: {
        type: Sequelize.TIME,
        allowNull: true
    },

    dataAgendamento: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo "dataAgendamento" não pode ser vazio!'
            }
        }
    },

    promotor: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo "promotor" não pode ser vazio!'
            }
        }
    }
},
    { freezeTableName: true }
);

Agendamento.sync({ force: false }).then(() => { })
    .catch((error) => {
        console.log(`\n❌ Erro ao sincronizar tabela!\n❌ ${error}`);
    });

module.exports = Agendamento;