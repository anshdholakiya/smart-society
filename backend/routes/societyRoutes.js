const express = require('express');
const router = express.Router();
const { getSocietyDetails, updateSocietyDetails } = require('../controllers/societyController');
const { protect } = require('../middleware/authMiddleware');

const { uploadGallery } = require('../middleware/uploadMiddleware');

router.get('/', getSocietyDetails);
router.put('/', protect, uploadGallery.array('gallery'), updateSocietyDetails); // Admin check should be inside controller or middleware

module.exports = router;
