const express = require('express');
const router = express.Router();
const {
  generateAssignment,
  saveAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
} = require("../controller/assignmentController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/generate",authMiddleware, generateAssignment);
router.post("/save",authMiddleware, saveAssignment);
router.get("/",authMiddleware, getAssignments);
router.get("/:id",authMiddleware, getAssignmentById);
router.delete("/:id",authMiddleware, deleteAssignment);

module.exports = router;
