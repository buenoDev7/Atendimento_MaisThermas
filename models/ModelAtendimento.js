const connection = require('../database/db_connection');
const Sequelize = require('sequelize');
const Atendimento = connection.define('atendimento', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'agendamento',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },

    base: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    brinde: {
        type: Sequelize.STRING
    },

    dataHora: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    promotor: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    captadorGuarany: {
        type: Sequelize.STRING
    },

    canalProspeccao: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    qtdIngressos: {
        type: Sequelize.INTEGER
    },

    plataforma: {
        type: Sequelize.STRING
    },

    valorIngressos: {
        type: Sequelize.DECIMAL(10, 2)
    },

    dataCompra: {
        type: Sequelize.DATEONLY
    },

    jaFoiSocio: {
        type: Sequelize.STRING
    },

    numeroTitulo: {
        type: Sequelize.INTEGER
    },

    qtdVisitas: {
        type: Sequelize.STRING
    },

    nomeCliente: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    dataNasc1: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    profissao1: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    obsProfissao1: {
        type: Sequelize.STRING
    },

    conjuge: {
        type: Sequelize.STRING
    },

    dataNasc2: {
        type: Sequelize.DATEONLY
    },

    profissao2: {
        type: Sequelize.STRING
    },

    obsProfissao2: {
        type: Sequelize.STRING
    },

    estadoCivil: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    tempoEstadoCivil: {
        type: Sequelize.STRING
    },

    qtdFilhos: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    cidade: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    estado: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    tel1: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    tel2: {
        type: Sequelize.STRING
    },

    cpfCompra: {
        type: Sequelize.STRING
    },

    nomeIdadeFilhos: {
        type: Sequelize.STRING
    },

    cartao: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    bandeiraCartao: {
        type: Sequelize.STRING
    },

    observacoes: {
        type: Sequelize.STRING
    },

    clienteAtendido: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O campo não pode ser vazio'
            }
        }
    },

    // > Campos para finalização do atendimento. Permitem ser "NULL" pois não recebem valor inicialmente
    dataAtendimento: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },

    produto: {
        type: Sequelize.STRING,
        allowNull: true
    },

    numeroContrato: {
        type: Sequelize.INTEGER,
        allowNull: true
    },

    idadeCliente: {
        type: Sequelize.INTEGER,
        allowNull: true
    },

    generoCliente: {
        type: Sequelize.STRING,
        allowNull: true
    },

    idadeAcompanhante: {
        type: Sequelize.INTEGER,
        allowNull: true
    },

    generoAcompanhante: {
        type: Sequelize.STRING,
        allowNull: true
    },

    qualificacao: {
        type: Sequelize.STRING,
        allowNull: true
    },

    jaVisitou: {
        type: Sequelize.STRING,
        allowNull: true
    },

    motivoDesqualificacao: {
        type: Sequelize.STRING,
        allowNull: true
    },

    NC: {
        type: Sequelize.STRING,
        allowNull: true
    },

    consultor: {
        type: Sequelize.STRING,
        allowNull: true
    },

    toGuarany: {
        type: Sequelize.STRING,
        allowNull: true
    },
    
    observacao: {
        type: Sequelize.STRING
    }
},
    {
        freezeTableName: true
    }
);

Atendimento.sync({ force: false }).then(() => { })
    .catch((error) => {
        console.log(`\n❌ Erro ao sincronizar tabela!\n❌ ${error}`);
    });

module.exports = Atendimento;