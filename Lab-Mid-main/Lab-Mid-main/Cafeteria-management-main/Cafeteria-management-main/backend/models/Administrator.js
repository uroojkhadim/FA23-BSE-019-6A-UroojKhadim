import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const administratorSchema = new mongoose.Schema({
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
  cnicNumber: {
    type: String,
    required: [true, 'Please provide CNIC number'],
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  adminRole: {
    type: String,
    default: 'Cafeteria Manager',
  },
  universityName: {
    type: String,
    default: 'Comsats University',
  },
  profilePicture: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
}, {
  timestamps: true,
});

// Hash password before saving
administratorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
administratorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Administrator = mongoose.model('Administrator', administratorSchema);

export default Administrator;
