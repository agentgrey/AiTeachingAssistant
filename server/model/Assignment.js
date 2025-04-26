const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  type: { type: String, required: true },
  learningObjectives: { type: String, required: true },
  generatedContent: {
    instructions: { type: String },
    rubric: { type: String },
    questions: [String],
    answerKey: [String],
    checklist: { type: String },
    participationCriteria: { type: String },
    peerEvaluation: { type: String },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {timestamps: true});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
