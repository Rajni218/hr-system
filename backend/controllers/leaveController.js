const Leave = require('../models/Leave');
const User = require('../models/User');

// @route POST /api/leaves - Apply for leave (Employee)
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Leave type, start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const user = await User.findById(req.user._id);
    if (user.leaveBalance < totalDays) {
      return res.status(400).json({ success: false, message: `Insufficient leave balance. You have ${user.leaveBalance} days left.` });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      appliedDate: new Date(),
    });

    await leave.populate('employee', 'fullName email');

    res.status(201).json({ success: true, message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/leaves/my - Get own leave requests (Employee)
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id })
      .sort({ appliedDate: -1 });
    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/leaves/:id - Edit pending leave (Employee)
exports.updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    if (leave.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only pending leaves can be edited' });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) return res.status(400).json({ success: false, message: 'End date must be after start date' });
      leave.totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      leave.startDate = start;
      leave.endDate = end;
    }

    if (leaveType) leave.leaveType = leaveType;
    if (reason !== undefined) leave.reason = reason;

    await leave.save();
    res.json({ success: true, message: 'Leave updated successfully', leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/leaves/:id - Cancel pending leave (Employee)
exports.cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    if (leave.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only pending leaves can be cancelled' });
    }

    await leave.deleteOne();
    res.json({ success: true, message: 'Leave cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/leaves/all - Get all leaves (Admin)
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employee', 'fullName email')
      .populate('reviewedBy', 'fullName')
      .sort({ appliedDate: -1 });
    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/leaves/:id/review - Approve/Reject leave (Admin)
exports.reviewLeave = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Leave already reviewed' });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    await leave.save();

    // Deduct leave balance if approved
    if (status === 'Approved') {
      await User.findByIdAndUpdate(leave.employee, {
        $inc: { leaveBalance: -leave.totalDays }
      });
    }

    await leave.populate('employee', 'fullName email');
    res.json({ success: true, message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
