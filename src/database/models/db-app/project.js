const Sequelize = require('sequelize');
const db = require('../../../database');

const Project = db.define('project', {
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
    data: {
        type: Sequelize.STRING,
        notNull: true
    },
    name: {
        type: Sequelize.STRING,
        notNull: true
    }
})

module.exports = Project;