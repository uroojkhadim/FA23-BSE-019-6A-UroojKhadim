require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function testDB() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');
    
    const count = await User.countDocuments();
    console.log('Total users:', count);
    
    const users = await User.find().limit(5);
    console.log('Sample users:', users.map(u => ({ email: u.email, role: u.role, active: u.is_active })));
    
    process.exit(0);
  } catch (err) {
    console.error('DB Test Error:', err);
    process.exit(1);
  }
}

testDB();
