import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Administrator from '../models/Administrator.js';

// Generate JWT Token
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Register Student
export const registerStudent = async (req, res) => {
  try {
    const { fullName, email, password, registrationNumber, contactNumber, whatsappNumber } = req.body;

    // Check if student already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists with this email' });
    }

    // Create student
    const student = await Student.create({
      fullName,
      email,
      password,
      registrationNumber,
      contactNumber,
      whatsappNumber,
    });

    if (student) {
      res.status(201).json({
        _id: student._id,
        email: student.email,
        fullName: student.fullName,
        role: 'student',
        registrationNumber: student.registrationNumber,
        token: generateToken(student._id, student.email, 'student'),
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during student registration' });
  }
};

// Register Teacher
export const registerTeacher = async (req, res) => {
  try {
    const { fullName, email, password, cnicNumber, department, phoneNumber, whatsappNumber } = req.body;

    // Check if teacher already exists
    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({ message: 'Teacher already exists with this email' });
    }

    // Create teacher
    const teacher = await Teacher.create({
      fullName,
      email,
      password,
      cnicNumber,
      department,
      phoneNumber,
      whatsappNumber,
    });

    if (teacher) {
      res.status(201).json({
        _id: teacher._id,
        email: teacher.email,
        fullName: teacher.fullName,
        role: 'teacher',
        department: teacher.department,
        token: generateToken(teacher._id, teacher.email, 'teacher'),
      });
    } else {
      res.status(400).json({ message: 'Invalid teacher data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during teacher registration' });
  }
};

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, cnicNumber, phoneNumber, adminRole } = req.body;

    // Check if admin already exists
    const adminExists = await Administrator.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Administrator already exists with this email' });
    }

    // Create admin
    const admin = await Administrator.create({
      fullName,
      email,
      password,
      cnicNumber,
      phoneNumber,
      adminRole,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: 'admin',
        adminRole: admin.adminRole,
        token: generateToken(admin._id, admin.email, 'admin'),
      });
    } else {
      res.status(400).json({ message: 'Invalid administrator data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during administrator registration' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    let Model;

    switch (role) {
      case 'student':
        Model = Student;
        break;
      case 'teacher':
        Model = Teacher;
        break;
      case 'admin':
        Model = Administrator;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Find user by email and include password
    user = await Model.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      ...(user.registrationNumber && { registrationNumber: user.registrationNumber }),
      ...(user.department && { department: user.department }),
      ...(user.adminRole && { adminRole: user.adminRole }),
      token: generateToken(user._id, user.email, user.role),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    let user;
    
    switch (req.user.role) {
      case 'student':
        user = await Student.findById(req.user.id);
        break;
      case 'teacher':
        user = await Teacher.findById(req.user.id);
        break;
      case 'admin':
        user = await Administrator.findById(req.user.id);
        break;
    }

    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: req.user.role,
        ...(user.registrationNumber && { registrationNumber: user.registrationNumber }),
        ...(user.department && { department: user.department }),
        ...(user.adminRole && { adminRole: user.adminRole }),
        ...(user.contactNumber && { contactNumber: user.contactNumber }),
        ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
        ...(user.whatsappNumber && { whatsappNumber: user.whatsappNumber }),
        ...(user.whatsappVerified !== undefined && { whatsappVerified: user.whatsappVerified }),
        ...(user.profilePicture && { profilePicture: user.profilePicture }),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
