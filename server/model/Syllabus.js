const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    durationWeeks: {
        type: Number,
        required: true
    },
    topics: [
        {
            type: String
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Syllabus', syllabusSchema);
