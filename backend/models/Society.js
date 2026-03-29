const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Society = sequelize.define('Society', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Smart Society',
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amenities: {
        type: DataTypes.JSON, 
        defaultValue: [],
    },
    wings: {
        type: DataTypes.JSON, 
        defaultValue: [],
    },
    gallery: {
        type: DataTypes.JSON, 
        defaultValue: [],
    }
});

module.exports = Society;
