const User = require('../models/User');
const Submission = require('../models/Submission');
const Report = require('../models/Report');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    let query = {};
    
    // Check for role filter from query params
    if (req.query.role && req.query.role !== 'all') {
      query.role = req.query.role;
    }
    
    // If user is subadmin, only show students from their department
    if (req.user.role === 'subadmin' && req.user.department) {
      query.department = req.user.department;
    }
    
    const users = await User.find(query).sort({ createdAt: -1 }).select('-password_hash');
    res.status(200).json({ users });
  } catch (err) {
    console.error('getUsers Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;
    if (!['supervisor', 'librarian', 'admin', 'subadmin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount >= 2) return res.status(403).json({ error: 'Maximum of 2 admins allowed' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      name, email, password_hash, role, department, phone,
      is_active: true,
      status: 'approved'
    });
    res.status(201).json({ message: 'User created', id: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // First, find the user
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // If subadmin, check if user belongs to their department
    if (req.user.role === 'subadmin' && req.user.department && user.department !== req.user.department) {
      return res.status(403).json({ error: 'You can only approve students from your department' });
    }

    const update = {
      status,
      is_active: status === 'approved'
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, update, { new: true });

    res.status(200).json({ success: true, message: `User ${status} successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { is_active: false });
    res.status(200).json({ message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const students = await User.countDocuments({ role: 'student', is_active: true });
    const supervisors = await User.countDocuments({ role: 'supervisor', is_active: true });
    const librarians = await User.countDocuments({ role: 'librarian', is_active: true });
    const total_submissions = await Submission.countDocuments();
    const completed_checks = await Submission.countDocuments({ status: 'completed' });

    res.status(200).json({ students, supervisors, librarians, total_submissions, completed_checks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.seedAdmin = async (req, res) => {
  try {
    const existing = await User.countDocuments({ role: 'admin' });
    if (existing >= 2) return res.status(409).json({ error: 'Admin limit reached' });

    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await User.create({ 
      name, email, password_hash, role: 'admin', department: 'Administration',
      is_active: true,
      status: 'approved'
    });
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');

exports.deleteFile = async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Submission not found' });

    await s3.send(new DeleteObjectCommand({ Bucket: process.env.B2_BUCKET_NAME, Key: sub.file_key }));
    
    const reports = await Report.find({ submission_id: req.params.id });
    for (const r of reports) {
      await s3.send(new DeleteObjectCommand({ Bucket: process.env.B2_BUCKET_NAME, Key: r.file_key }));
    }

    await Report.deleteMany({ submission_id: req.params.id });
    await Submission.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'File and reports deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
