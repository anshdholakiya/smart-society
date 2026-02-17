const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facility = sequelize.define('Facility', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, // e.g., "Community Hall", "Tennis Court"
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    pricePerDay: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    }
});

module.exports = Facility;
