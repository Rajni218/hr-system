const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  role: String,
  dateOfJoining: Date,
  leaveBalance: Number,
});

const User = mongoose.model('User', userSchema);

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: 'admin@hrsystem.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  await User.create({
    fullName: 'Super Admin',
    email: 'admin@hrsystem.com',
    password: hashedPassword,
    role: 'admin',
    dateOfJoining: new Date(),
    leaveBalance: 20,
  });

  console.log('Admin seeded successfully');
  console.log('Email: admin@hrsystem.com');
  console.log('Password: Admin@123');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
