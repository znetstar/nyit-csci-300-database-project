const {
    Sequelize
} = require('sequelize');

module.exports = global.sql = new Sequelize(process.env.POSTGRES_URI, {
    dialect: "postgres"
});


require('./models')
