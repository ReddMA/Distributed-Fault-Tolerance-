const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Get all courses with enrollment counts
const getAllCourses = async (req, res) => {
  try {
    // Find all courses sorted by creation date (newest first)
    const courses = await Course.find().sort({ createdAt: -1 });

    // Get enrollment counts for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({
          course: course._id,
          status: 'active'
        });

        return {
          id: course._id,
          name: course.name,
          description: course.description,
          capacity: course.capacity,
          enrolled_count: enrollmentCount,
          available_slots: course.capacity - enrollmentCount
        };
      })
    );

    res.json(coursesWithCounts);
  } catch (error) {
    console.error('Error fetching courses:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message
      });
    }

    // Handle Mongoose cast errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch courses',
      message: error.message
    });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get enrollment count
    const enrollmentCount = await Enrollment.countDocuments({
      course: course._id,
      status: 'active'
    });

    res.json({
      id: course._id,
      name: course.name,
      description: course.description,
      capacity: course.capacity,
      enrolled_count: enrollmentCount,
      available_slots: course.capacity - enrollmentCount
    });
  } catch (error) {
    console.error('Error fetching course:', error);

    // Handle Mongoose cast errors (shouldn't occur due to regex validation)
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid course ID format',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch course',
      message: error.message
    });
  }
};

// Enroll student in course
const enrollInCourse = async (req, res) => {
  try {
    const { id: course_id } = req.params;
    const student_id = req.user.id; // From JWT token (numeric ID)

    // Validate MongoDB ObjectId
    if (!course_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
    }

    // Check if course exists
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if course is full
    const enrollmentCount = await Enrollment.countDocuments({
      course: course_id,
      status: 'active'
    });

    if (enrollmentCount >= course.capacity) {
      return res.status(400).json({ error: 'Course is full' });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: student_id,
      course: course_id,
      status: 'active'
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      studentId: student_id,
      course: course_id,
      enrolledAt: new Date()
    });

    await enrollment.save();

    // Update course enrolled_count
    await Course.findByIdAndUpdate(course_id, {
      $inc: { enrolled_count: 1 }
    });

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment: {
        id: enrollment._id,
        student_id: enrollment.studentId,
        course_id: enrollment.course,
        enrolled_at: enrollment.enrolledAt
      }
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);

    // Handle duplicate key error (unique index violation)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message
      });
    }

    // Handle Mongoose cast errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to enroll in course',
      message: error.message
    });
  }
};

// Get student enrollments
const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id; // From JWT token (numeric ID)

    const enrollments = await Enrollment.find({
      studentId: studentId,
      status: 'active'
    })
    .populate('course', 'name description')
    .sort({ enrolledAt: -1 });

    const formattedEnrollments = enrollments.map(enrollment => ({
      id: enrollment._id,
      enrolled_at: enrollment.enrolledAt,
      course_id: enrollment.course._id,
      course_name: enrollment.course.name,
      course_description: enrollment.course.description
    }));

    res.json(formattedEnrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch enrollments',
      message: error.message
    });
  }
};

// Get enrollments for a specific student (by student ID parameter)
// Note: This endpoint allows anyone with valid token to view any student's enrollments
const getStudentEnrollments = async (req, res) => {
  try {
    const { id: student_id } = req.params;

    // Validate student_id is a valid positive integer
    const studentIdNum = parseInt(student_id, 10);
    if (isNaN(studentIdNum) || studentIdNum <= 0 || !Number.isInteger(parseFloat(student_id))) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    // Query enrollments using correct schema field names
    const enrollments = await Enrollment.find({
      studentId: studentIdNum,  // Use parsed numeric ID
      status: 'active'
    })
    .populate('course', 'name description')  // Using 'course' (schema field name)
    .sort({ enrolledAt: -1 });  // Using 'enrolledAt' (schema field name)

    // Filter out enrollments with deleted courses and transform to spec format
    const formattedEnrollments = enrollments
      .filter(enrollment => enrollment.course)  // Handle case where course was deleted
      .map(enrollment => ({
        id: enrollment._id,
        course_id: enrollment.course._id,
        course_name: enrollment.course.name,
        enrolled_at: enrollment.enrolledAt
      }));

    res.json(formattedEnrollments);
  } catch (error) {
    console.error('Error fetching student enrollments:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch student enrollments',
      message: error.message
    });
  }
};

// Upload a grade (Faculty only)
const uploadGrade = async (req, res) => {
  const { studentId, courseId, grade } = req.body;
  try {
    const updated = await Enrollment.findOneAndUpdate(
      { studentId: studentId, course: courseId },
      { grade: grade, status: 'completed' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Enrollment not found" });
    res.json({ message: "Grade uploaded successfully", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get grades (Student only)
const getMyGrades = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ 
      studentId: req.user.id, 
      grade: { $ne: null } 
    }).populate('course', 'name');
    
    // Format to match what frontend expects
    const grades = enrollments.map(e => ({
      id: e._id,
      course_name: e.course.name,
      grade: e.grade,
      uploaded_at: e.updatedAt
    }));
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourses: getAllCourses,  // Alias for spec compliance
  getCourseById,
  enrollInCourse,
  getMyEnrollments,
  getStudentEnrollments,
  uploadGrade,
  getMyGrades
};
