import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false,
  },
  registrationNumber: {
    type: String,
    required: [true, 'Please provide registration number'],
    unique: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
  whatsappNumber: {
    type: String,
    trim: true,
  },
  whatsappVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['student'],
    default: 'student',
  },
  universityName: {
    type: String,
    default: 'Comsats University',
  },
  profilePicture: {
    type: String,
  },
}, {
  timestamps: true,
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

export default Student;
