const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bill = sequelize.define('Bill', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('maintenance', 'event', 'penalty', 'other'),
        defaultValue: 'maintenance',
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    month: {
        type: DataTypes.STRING, // e.g., "February 2026", can be null for events
        allowNull: true,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true, // Events might not have due date or same as event date
    },
    penalty: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'overdue'),
        defaultValue: 'pending',
    },
});

module.exports = Bill;
