const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  getTodayAttendance,
} = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, markAttendance);
router.get('/my', protect, getMyAttendance);
router.get('/today', protect, getTodayAttendance);
router.get('/all', protect, adminOnly, getAllAttendance);

module.exports = router;
