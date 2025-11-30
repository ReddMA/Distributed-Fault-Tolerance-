import { mockCourses, mockEnrollments } from './mockData';

/**
 * Mock getCourses function - simulates API call with 1 second delay
 * @returns {Promise<Array>} Array of course objects
 */
export const getCourses = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return a copy of mock courses to prevent direct mutations
  return JSON.parse(JSON.stringify(mockCourses));
};

/**
 * Mock enrollCourse function - simulates enrollment API call
 * @param {number} courseId - ID of the course to enroll in
 * @param {number} studentId - ID of the student enrolling
 * @returns {Promise<Object>} Success response with message
 */
export const enrollCourse = async (courseId, studentId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Find the course
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) {
    throw new Error('Course not found');
  }

  // Check if course is full
  if (course.enrolled_count >= course.capacity) {
    throw new Error('Course is full');
  }

  // Simulate successful enrollment
  // In a real app, this would update the database
  course.enrolled_count += 1;

  return {
    success: true,
    message: `Successfully enrolled in ${course.name}`,
    course: course
  };
};

/**
 * Mock getMyEnrollments function - simulates fetching student enrollments
 * @param {number} studentId - ID of the student
 * @returns {Promise<Array>} Array of enrollment objects
 */
export const getMyEnrollments = async (studentId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Get enrollments for this student
  const enrollments = mockEnrollments[studentId] || [];

  // Return a copy to prevent mutations
  return JSON.parse(JSON.stringify(enrollments));
};
