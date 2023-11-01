const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exercicio = sequelize.define('Exercicio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Exercicio;