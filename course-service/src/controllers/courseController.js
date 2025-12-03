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
    res.status(500).json({
      error: 'Failed to fetch course',
      message: error.message
    });
  }
};

// Enroll student in course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id; // From JWT token (numeric ID)

    // Validate MongoDB ObjectId
    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if course is full
    const enrollmentCount = await Enrollment.countDocuments({
      course: courseId,
      status: 'active'
    });

    if (enrollmentCount >= course.capacity) {
      return res.status(400).json({ error: 'Course is full' });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: studentId,
      course: courseId,
      status: 'active'
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      studentId: studentId,
      course: courseId,
      enrolledAt: new Date()
    });

    await enrollment.save();

    res.status(201).json({
      message: 'Successfully enrolled in course',
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
    res.status(500).json({
      error: 'Failed to fetch enrollments',
      message: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourses: getAllCourses,  // Alias for spec compliance
  getCourseById,
  enrollInCourse,
  getMyEnrollments
};
