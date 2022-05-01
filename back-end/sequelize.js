const Sequelize = require('sequelize');

console.log("> Initializing Sequelize...");
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    logging: false,
    define: {
        timestamps: false
    }
});

module.exports = sequelize;