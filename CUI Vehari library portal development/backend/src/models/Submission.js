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
      'pending_supervisor', 
      'approved_by_supervisor', 
      'rejected_by_supervisor', 
      'approved_final', 
      'rejected_final'
    ], 
    default: 'pending_supervisor' 
  },
  reject_reason: { type: String },
  approved_at: { type: Date },
  final_decision_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
