const Sequelize = require('sequelize');
const db = require('../../../database');

const Item = db.define('item', {
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
    desc: {
        type: Sequelize.STRING,
        notNull: true
    }
});

module.exports = Item;