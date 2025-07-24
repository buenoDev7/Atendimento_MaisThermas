process.env.TZ = 'America/Sao_Paulo';

// > .path
const path = require('path');

// > .env
require('dotenv').config();

// > Express.js
const express = require('express');

// > Inicializa o app Express
const app = express();

// > Conexão com Banco de Dados
const db_connection = require('./database/db_connection');

db_connection.authenticate().then(() => {
  console.log('\n✅ Banco de dados conectado com sucesso!');
  return db_connection.sync({ alter: true });
})
  .then(() => {
    console.log('✅ Models sincronizados com sucesso no banco de dados!');
  })
  .catch((error) => {
    console.log(`\n❌ Erro ao conectar ou sincronizar com banco de dados!\n❌ ${error}`);
  });


// > EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// > bodyParser
const BodyParser = require('body-parser');
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

// > Routers
const RouterAgendamento = require('./routers/RouterAgendamento');
const RouterAtendimento = require('./routers/RouterAtendimento');
const RouterRelatorios = require('./routers/RouterRelatorios');
app.use('/', RouterAgendamento);
app.use('/', RouterAtendimento);
app.use('/', RouterRelatorios);

// > PORT
const PORT = process.env.PORT || 3030;

// > Inicia o Servidor
app.listen(PORT, () => {
  console.log(`\n✅Servidor rodando na porta "${PORT}"`);
});