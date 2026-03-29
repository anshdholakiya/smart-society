const express = require('express');
const router = express.Router();
const {
  fileComplaint,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint 
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { uploadComplaint } = require('../middleware/uploadMiddleware');

router.post('/', protect, uploadComplaint.single('image'), fileComplaint);
router.get('/', protect, getComplaints);
router.put('/:id/status', protect, updateComplaintStatus);

router.delete('/:id', protect, deleteComplaint);

module.exports = router;