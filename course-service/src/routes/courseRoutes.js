const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateToken: verifyToken, requireStudent } = require('../middleware/authMiddleware');

// Public routes (require authentication but no specific role)
router.get('/courses', verifyToken, courseController.getAllCourses);
router.get('/courses/:id', verifyToken, courseController.getCourseById);

// Student-only routes
router.post('/courses/:courseId/enroll', verifyToken, requireStudent, courseController.enrollInCourse);
router.get('/my-enrollments', verifyToken, requireStudent, courseController.getMyEnrollments);

module.exports = router;
