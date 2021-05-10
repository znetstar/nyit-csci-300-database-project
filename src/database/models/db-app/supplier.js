const Sequelize = require('sequelize');
const db = require('../../../database');

const Supplier = db.define('supplier', {
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
    name: {
        type: Sequelize.STRING,
        notNull: true
    },
    supplier_add: {
        type: Sequelize.STRING,
        notNull: true
    }
})

module.exports = Supplier;