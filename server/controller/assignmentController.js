const Assignment = require('../model/Assignment');
const { generateAssignmentContent } = require("../utils/openaiHelper"); 

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
  const { assignmentTitle, selectedCourse, selectedType, learningObjectives, generatedContent } = req.body;
  const userId = req.userId;

  try {
    const newAssignment = new Assignment({
      title: assignmentTitle,
      course: selectedCourse,
      type: selectedType,
      learningObjectives,
      generatedContent,
      createdBy: userId
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

module.exports = {
  generateAssignment,
  saveAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
};
