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
        type: DataTypes.JSON, // Stores array of strings e.g. ["Gym", "Pool"]
        defaultValue: [],
    },
    wings: {
        type: DataTypes.JSON, // Stores array of strings e.g. ["A", "B", "C"]
        defaultValue: [],
    },
    gallery: {
        type: DataTypes.JSON, // Stores array of image URLs
        defaultValue: [],
    }
});

module.exports = Society;
