const express = require('express');
const { createProject, getProjects, getProjectById, addMemberToProject } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, admin, createProject).get(protect, getProjects);
router.route('/:id').get(protect, getProjectById);
router.route('/:id/members').post(protect, admin, addMemberToProject);

module.exports = router;
