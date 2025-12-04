const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
//const { authenticateToken: verifyToken, requireStudent } = require('../middleware/authMiddleware');
const { authenticateToken: verifyToken, requireStudent, requireFaculty } = require('../middleware/authMiddleware');

// Public routes (require authentication but no specific role)
router.get('/courses', verifyToken, courseController.getAllCourses);
router.get('/courses/:id', verifyToken, courseController.getCourseById);

// Student-only routes
router.post('/courses/:id/enroll', verifyToken, requireStudent, courseController.enrollInCourse);
router.get('/my-enrollments', verifyToken, requireStudent, courseController.getMyEnrollments);

// Get enrollments for a specific student (requires authentication only)
router.get('/enrollments/student/:id', verifyToken, courseController.getStudentEnrollments);

// Add these lines
router.post('/grades/upload', verifyToken, requireFaculty, courseController.uploadGrade);
router.get('/my-grades', verifyToken, requireStudent, courseController.getMyGrades);

module.exports = router;
