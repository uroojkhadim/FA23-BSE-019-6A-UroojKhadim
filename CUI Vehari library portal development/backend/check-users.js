const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function listUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find().select('name email role is_active');
  console.log('--- Current Users ---');
  users.forEach(u => console.log(`${u.role}: ${u.email} (Active: ${u.is_active})`));
  console.log('---------------------');
  await mongoose.disconnect();
}

listUsers().catch(console.error);
