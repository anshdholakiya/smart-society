const express = require('express');
const router = express.Router();
const { 
  getMyBills, 
  createBill, 
  getResidents, 
  getAllBills, 
  markBillPaid 
} = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-bills', protect, getMyBills);

router.get('/residents', protect, getResidents);
router.post('/create', protect, createBill);
router.get('/all', protect, getAllBills); 
router.put('/:id/pay', protect, markBillPaid); 

module.exports = router;