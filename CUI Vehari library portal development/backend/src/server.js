require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Connect to DB
connectDB().then(async () => {
  try {
    // Seed Admin
    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const adminExists = await User.findOne({ email: adminEmail });
      if (!adminExists) {
        const password_hash = await bcrypt.hash(adminPassword, 10);
        await User.create({
          name: process.env.SEED_ADMIN_NAME || 'Default Admin',
          email: adminEmail,
          password_hash,
          role: 'admin',
          department: process.env.SEED_ADMIN_DEPARTMENT || 'Administration',
          reg_number: process.env.SEED_ADMIN_REG_NUMBER || 'ADMIN-001',
          is_active: true,
          status: 'approved'
        });
        console.log('Default Admin Seeded from environment');
      }
    }

    // Seed Supervisor
    const supervisorEmail = 'supervisor@cui.edu.pk';
    const supervisorPassword = 'Supervisor@123';
    const supervisorExists = await User.findOne({ email: supervisorEmail });
    if (!supervisorExists) {
      const password_hash = await bcrypt.hash(supervisorPassword, 10);
      await User.create({
        name: 'Dr. Sarah Khan',
        email: supervisorEmail,
        password_hash,
        role: 'supervisor',
        department: 'Computer Science',
        is_active: true,
        status: 'approved'
      });
      console.log('Default Supervisor Seeded');
    }

    // Seed Librarian
    const librarianEmail = 'librarian@cui.edu.pk';
    const librarianPassword = 'Librarian@123';
    const librarianExists = await User.findOne({ email: librarianEmail });
    if (!librarianExists) {
      const password_hash = await bcrypt.hash(librarianPassword, 10);
      await User.create({
        name: 'Mr. Ahmed Raza',
        email: librarianEmail,
        password_hash,
        role: 'librarian',
        department: 'Library',
        is_active: true,
        status: 'approved'
      });
      console.log('Default Librarian Seeded');
    }
  } catch (err) {
    console.error('Error seeding users', err);
  }
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'CUI Vehari Plagiarism Portal API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', submissionRoutes);
app.use('/api/reports', reportRoutes);

app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File exceeds 50MB size limit' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err && err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }
  return next(err);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
