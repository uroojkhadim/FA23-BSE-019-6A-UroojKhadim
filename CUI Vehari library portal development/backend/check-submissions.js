const mongoose = require('mongoose');
const Submission = require('./src/models/Submission');
const User = require('./src/models/User');
require('dotenv').config();

async function listSubmissions() {
  await mongoose.connect(process.env.MONGO_URI);
  const submissions = await Submission.find()
    .populate('uploadedBy', 'name email')
    .populate('supervisorId', 'name');
  
  console.log('--- Current Submissions ---');
  submissions.forEach(s => {
    console.log(`
      Title: ${s.title}
      Uploaded by: ${s.uploadedBy?.name} (${s.uploadedBy?.email})
      Supervisor: ${s.supervisorId?.name}
      Status: ${s.status}
      Created at: ${s.createdAt}
    `);
  });
  console.log('---------------------------');
  await mongoose.disconnect();
}

listSubmissions().catch(console.error);
