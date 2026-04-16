const Attendance = require('../models/Attendance');

// @route POST /api/attendance - Mark attendance (Employee)
exports.markAttendance = async (req, res) => {
  try {
    const { status, date } = req.body;

    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

    const today = date ? new Date(date) : new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (today > now) {
      return res.status(400).json({ success: false, message: 'Cannot mark attendance for future dates' });
    }

    const existing = await Attendance.findOne({
      employee: req.user._id,
      date: today,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for today' });
    }

    const attendance = await Attendance.create({
      employee: req.user._id,
      date: today,
      status,
    });

    res.status(201).json({ success: true, message: 'Attendance marked successfully', attendance });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for this date' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/attendance/my - Get own attendance (Employee)
exports.getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ employee: req.user._id })
      .sort({ date: -1 });
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/attendance/all - Get all attendance (Admin)
exports.getAllAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    const filter = {};

    if (employeeId) filter.employee = employeeId;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      filter.date = d;
    }

    const attendance = await Attendance.find(filter)
      .populate('employee', 'fullName email')
      .sort({ date: -1 });

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/attendance/today - Check today's attendance status
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: req.user._id,
      date: today,
    });

    res.json({ success: true, attendance, marked: !!attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
