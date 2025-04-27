const express = require('express');
const router = express.Router();
const upload = require('../utils/upload'); 

const {
  generateAssignment,
  saveAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
  addStudentSubmission,
  updateAssignment,
  editSubmission,
  getSubmission
} = require("../controller/assignmentController");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:id/submit', upload.array('files[]'), addStudentSubmission);
router.patch('/:assignmentId/submissions/:submissionId', editSubmission);
router.get('/:assignmentId/submissions/:submissionId', getSubmission);
router.post("/generate",authMiddleware, generateAssignment);
router.post("/save",authMiddleware, saveAssignment);
router.patch('/:id', updateAssignment);
router.get("/:id",authMiddleware, getAssignmentById);
router.delete("/:id",authMiddleware, deleteAssignment);
router.get("/",authMiddleware, getAssignments);

module.exports = router;
