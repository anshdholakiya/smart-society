const sequelize = require('../config/database');
const User = require('./User');
const Bill = require('./Bill');
const Complaint = require('./Complaint');
const Notice = require('./Notice');
const Society = require('./Society');
const Facility = require('./Facility');
const Booking = require('./Booking');

// Relationships
User.hasMany(Bill, { foreignKey: 'userId' });
Bill.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Complaint, { foreignKey: 'userId' });
Complaint.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Facility.hasMany(Booking, { foreignKey: 'facilityId' });
Booking.belongsTo(Facility, { foreignKey: 'facilityId' });

const db = {
  sequelize,
  User,
  Bill,
  Complaint,
  Notice,
  Society,
  Facility,
  Booking
};

module.exports = db;