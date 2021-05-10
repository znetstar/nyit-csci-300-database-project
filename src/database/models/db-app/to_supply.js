const Sequelize = require('sequelize');
const db = require('../../../database');

const To_Supply = db.define('to_supply', {
    contract_id: {
        type: Sequelize.INTEGER,
        notNull: true
    },
    item_id: {
        type: Sequelize.INTEGER,
        notNull: true
    },
    contract_amt: {
        type: Sequelize.INTEGER,
        notNull: true
    },
    contract_price: {
        type: Sequelize.INTEGER,
        notNull: true
    },
})

module.exports = To_Supply;