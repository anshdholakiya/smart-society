const { Booking, Facility, User, Bill } = require('../models');
const { Op } = require('sequelize');

// @desc    Get All Facilities
exports.getAllFacilities = async (req, res) => {
    try {
        const facilities = await Facility.findAll();
        res.json(facilities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching facilities' });
    }
};

// @desc    Create a Facility (Admin)
exports.createFacility = async (req, res) => {
    try {
        const { name, description, capacity, pricePerDay } = req.body;
        const facility = await Facility.create({ name, description, capacity, pricePerDay });
        res.status(201).json(facility);
    } catch (error) {
        res.status(500).json({ message: 'Error creating facility' });
    }
};

// @desc    Update a Facility (Admin)
exports.updateFacility = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, capacity, pricePerDay } = req.body;
        const facility = await Facility.findByPk(id);

        if (!facility) return res.status(404).json({ message: 'Facility not found' });

        await facility.update({ name, description, capacity, pricePerDay });
        res.json(facility);
    } catch (error) {
        res.status(500).json({ message: 'Error updating facility' });
    }
};

// @desc    Delete a Facility (Admin)
exports.deleteFacility = async (req, res) => {
    try {
        const { id } = req.params;
        const facility = await Facility.findByPk(id);

        if (!facility) return res.status(404).json({ message: 'Facility not found' });

        await facility.destroy();
        res.json({ message: 'Facility deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting facility' });
    }
};

// @desc    Create Booking Request (Resident)
exports.createBooking = async (req, res) => {
    try {
        const { facilityId, date, purpose, days } = req.body;
        const numDays = days || 1;

        const facility = await Facility.findByPk(facilityId);
        if (!facility) return res.status(404).json({ message: 'Facility not found' });

        // Calculate Total Price
        const totalPrice = parseFloat(facility.pricePerDay) * numDays;

        // Check availability (Start Date to End Date)
        const newStart = new Date(date);
        const newEnd = new Date(date);
        newEnd.setDate(newEnd.getDate() + numDays);

        const existingBookings = await Booking.findAll({
            where: {
                facilityId,
                status: { [Op.not]: 'rejected' },
                date: { [Op.gte]: new Date() }
            }
        });

        const hasConflict = existingBookings.some(b => {
            const existStart = new Date(b.date);
            const existEnd = new Date(b.date);
            existEnd.setDate(existEnd.getDate() + (b.days || 1));

            return newStart < existEnd && newEnd > existStart;
        });

        if (hasConflict) {
            return res.status(400).json({ message: 'Facility is already booked for these dates.' });
        }

        const booking = await Booking.create({
            userId: req.user.id,
            facilityId,
            date,
            purpose,
            days: numDays,
            totalPrice,
            status: 'pending'
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating booking' });
    }
};

// @desc    Get My Bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [Facility],
            order: [['date', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};

// @desc    Get All Bookings (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, attributes: ['name', 'wing', 'flatNumber'] },
                { model: Facility, attributes: ['name'] }
            ],
            order: [['date', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all bookings' });
    }
};

// @desc    Update Booking Status (Admin)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved', 'rejected'

        const booking = await Booking.findByPk(id, { include: [Facility] });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = status;
        await booking.save();

        // If Approved, Generate Bill
        if (status === 'approved') {
            await Bill.create({
                userId: booking.userId,
                amount: booking.totalPrice,
                type: 'event',
                description: `${booking.purpose} - ${booking.Facility.name} (${booking.days} days)`,
                status: 'pending'
            });
        }

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating booking status' });
    }
};
