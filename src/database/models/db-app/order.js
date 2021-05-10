const Sequelize = require('sequelize');
const db = require('../../../database');

const Order = db.define('order', {
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
    date_reqd: {
        type: Sequelize.DATE,
        notNull: true
    },
    date_comp: {
        type: Sequelize.DATE,
        notNull: true
    },
    contract_id: {
        type: Sequelize.INTEGER,
        notNull: true
    },
    project_id: {
        type: Sequelize.INTEGER,
        notNull: true
    }
})

module.exports = Order;