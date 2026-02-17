const express = require('express');
const router = express.Router();
const {
    getAllFacilities,
    createFacility,
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    updateFacility,
    deleteFacility
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Facility Routes
router.get('/facilities', protect, getAllFacilities);
router.post('/facilities', protect, createFacility); // Needs Admin check
router.put('/facilities/:id', protect, updateFacility); // Needs Admin check
router.delete('/facilities/:id', protect, deleteFacility); // Needs Admin check

// Booking Routes
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/all', protect, getAllBookings); // Needs Admin check
router.put('/:id/status', protect, updateBookingStatus); // Needs Admin check

module.exports = router;
