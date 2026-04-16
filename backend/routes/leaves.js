const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  updateLeave,
  cancelLeave,
  getAllLeaves,
  reviewLeave,
} = require('../controllers/leaveController');
const { protect, adminOnly } = require('../middleware/auth');

// Employee routes
router.post('/', protect, applyLeave);
router.get('/my', protect, getMyLeaves);
router.put('/:id', protect, updateLeave);
router.delete('/:id', protect, cancelLeave);

// Admin routes
router.get('/all', protect, adminOnly, getAllLeaves);
router.put('/:id/review', protect, adminOnly, reviewLeave);

module.exports = router;
