const Sequelize = require('sequelize');
const db = require('../../../database');

const Contract = db.define('contracts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    num: {
        type: Sequelize.INTEGER,
        unique: true,
        notNull: true
    },
    supplier_id: {
        type: Sequelize.INTEGER,
        notNull: true
    },
    date: {
        type: Sequelize.DATE,
        notNull: true
    }
})

module.exports = Contract;