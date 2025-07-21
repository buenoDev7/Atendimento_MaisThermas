require('dotenv').config();
const Sequelize = require('sequelize');

const db_connection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        // timezone: '-03:00',
    }
);

module.exports = db_connection;
