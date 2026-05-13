const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String }, // For direct access if needed
  file_key: { type: String, required: true }, // Internal storage key
  file_name: { type: String, required: true },
  file_size: { type: Number },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  librarianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: [
      'pending', 
      'pending_supervisor', 
      'pending_librarian', 
      'rejected', 
      'completed'
    ], 
    default: 'pending_supervisor' 
  },
  reject_reason: { type: String },
  approved_at: { type: Date },
  final_decision_at: { type: Date },
  doc_report_url: { type: String },
  doc_report_key: { type: String },
  ai_report_url: { type: String },
  ai_report_key: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
