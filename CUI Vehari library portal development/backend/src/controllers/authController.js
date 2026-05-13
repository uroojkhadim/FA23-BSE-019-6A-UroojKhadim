const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, department, reg_number, phone, supervisor_id } = req.body;
    if (!name || !email || !password || !department || !reg_number || !phone || !supervisor_id) {
      return res.status(400).json({ error: 'All fields are required, including supervisor' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password_hash, role: 'student', department, reg_number, phone, supervisor_id
    });

    res.status(201).json({ message: 'Registration successful. Your account is pending admin approval.', id: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.is_active) {
      const message = user.status === 'pending' 
        ? 'Your account is pending admin approval.' 
        : 'Your account has been deactivated or rejected.';
      return res.status(403).json({ error: message });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user._id);
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, reg_number: user.reg_number }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor', is_active: true }).select('name department email');
    res.status(200).json({ supervisors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
