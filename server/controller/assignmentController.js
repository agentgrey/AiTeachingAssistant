const Assignment = require('../model/Assignment');
const { generateAssignmentContent } = require("../utils/openaiHelper"); 
const path = require('path');
const fs = require('fs');

const generateAssignment = async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const generatedContent = await generateAssignmentContent({
        prompt
    });
    res.status(200).json({ result: generatedContent });
  } catch (error) {
    res.status(500).json({ message: 'Error generating assignment', error: error.message });
  }
};

const saveAssignment = async (req, res) => {
  const { assignmentTitle, selectedCourse, selectedType, learningObjectives, generatedContent, dueDate, totalPoints } = req.body;
  const userId = req.userId;

  try {
    const newAssignment = new Assignment({
      title: assignmentTitle,
      course: selectedCourse,
      type: selectedType,
      learningObjectives,
      generatedContent,
      createdBy: userId,
      dueDate,
      totalPoints
    });

    const savedAssignment = await newAssignment.save();

    res.status(200).json({
      message: 'Assignment successfully created!',
      assignment: savedAssignment,
    });
  } catch (err) {
    console.error('Error saving assignment:', err);
    res.status(500).json({
      message: 'Error saving assignment',
      error: err.message,
    });
  }
};

const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { assignmentTitle, selectedCourse, selectedType, learningObjectives, generatedContent, dueDate, totalPoints } = req.body;
  
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      {
        title: assignmentTitle,
        course: selectedCourse,
        type: selectedType,
        learningObjectives,
        generatedContent,
        dueDate,
        totalPoints,
      },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({
      message: 'Assignment updated successfully!',
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Error updating assignment', error: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const userId = req.userId;
    const assignments = await Assignment.find({createdBy: userId});
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignment', error: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await Assignment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};

const addStudentSubmission = async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const { id } = req.params;
  const fileNames = files.map(file => file.filename);

  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    assignment.submissions.push({
      file: fileNames,
    });

    await assignment.save();

    res.status(200).json({ message: 'Submission added successfully', assignment });
  } catch (error) {
    console.error('Error adding submission:', error);
    res.status(500).json({ message: 'Error adding submission', error: error.message });
  }
};

const editSubmission = async (req, res) => {
  const { assignmentId, submissionId } = req.params;
  const updates = req.body;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    Object.keys(updates).forEach((key) => {
      submission[key] = updates[key];
    });

    await assignment.save();

    res.status(200).json({
      message: 'Submission updated successfully',
      submission,
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ message: 'Error updating submission', error: error.message });
  }
};
const getSubmission = async (req, res) => {
  const { assignmentId, submissionId } = req.params;  

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const filesWithPreview = submission.file.map((file) => {
      let previewUrl = `/uploads/${file}`; 
      
      return {
        filename: file,
        previewUrl: previewUrl
      };
    });

    const responseData = {
      studentName: submission.studentName,
      files: filesWithPreview, 
      status: submission.status || 'pending',  
      submissionDate: submission.createdAt,  
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  generateAssignment,
  saveAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
  addStudentSubmission,
  updateAssignment,
  editSubmission,
  getSubmission
};
