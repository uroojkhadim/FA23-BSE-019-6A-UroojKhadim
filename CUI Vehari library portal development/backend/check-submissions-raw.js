const mongoose = require('mongoose');
const Submission = require('./src/models/Submission');
require('dotenv').config();

async function listSubmissionsRaw() {
  await mongoose.connect(process.env.MONGO_URI);
  const submissions = await Submission.find();
  
  console.log('--- Raw Submissions ---');
  submissions.forEach(s => {
    console.log(JSON.stringify(s, null, 2));
  });
  console.log('----------------------');
  await mongoose.disconnect();
}

listSubmissionsRaw().catch(console.error);
