const Sequelize = require('sequelize');
const db = require('../../../database');

const Made = db.define('made', {
    order_id: {
        type: Sequelize.INTEGER,
        noNull: true
    },
    to_supply_id: {
        type: Sequelize.INTEGER,
        noNull: true
    },
    order_quan: {
        type: Sequelize.INTEGER,
        noNull: true
    },
})

module.exports = Made;