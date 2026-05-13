const mongoose = require('mongoose');
const Submission = require('./src/models/Submission');
require('dotenv').config();

async function fixSubmission() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Update submission with _id "6a04b69723c010ee319f98ab"
  const result = await Submission.updateOne(
    { _id: '6a04b69723c010ee319f98ab' },
    { $set: { status: 'pending_librarian' } }
  );
  
  console.log('Update result:', result);
  console.log('Submission updated successfully!');
  
  await mongoose.disconnect();
}

fixSubmission().catch(console.error);
