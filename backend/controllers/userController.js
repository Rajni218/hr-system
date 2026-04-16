const User = require('../models/User');

// @route GET /api/users - Get all employees (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' }).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/users/:id - Get single user (Admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
