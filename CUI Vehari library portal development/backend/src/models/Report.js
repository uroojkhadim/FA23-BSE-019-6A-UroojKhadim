const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  submission_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  librarian_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  report_type: { type: String, enum: ['plagiarism', 'ai'], required: true },
  file_key: { type: String, required: true },
  file_name: { type: String, required: true },
  similarity_score: { type: Number },
  ai_percentage: { type: Number },
  notes: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Report', ReportSchema);
