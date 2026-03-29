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

router.get('/facilities', protect, getAllFacilities);
router.post('/facilities', protect, createFacility); 
router.put('/facilities/:id', protect, updateFacility); 
router.delete('/facilities/:id', protect, deleteFacility); 

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/all', protect, getAllBookings); 
router.put('/:id/status', protect, updateBookingStatus); 

module.exports = router;
