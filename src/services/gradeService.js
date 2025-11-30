import { mockGrades, mockStudents, mockCourses } from './mockData';

/**
 * Mock getGrades function - simulates fetching student grades
 * @param {number} studentId - ID of the student
 * @returns {Promise<Array>} Array of grade objects
 */
export const getGrades = async (studentId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Get grades for this student
  const grades = mockGrades[studentId] || [];

  // Return a copy to prevent mutations
  return JSON.parse(JSON.stringify(grades));
};

/**
 * Mock getStudents function - simulates fetching all students
 * @returns {Promise<Array>} Array of student objects
 */
export const getStudents = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return a copy to prevent mutations
  return JSON.parse(JSON.stringify(mockStudents));
};

/**
 * Mock uploadGrade function - simulates uploading a grade
 * @param {number} courseId - ID of the course
 * @param {number} studentId - ID of the student
 * @param {string} grade - Grade to assign (e.g., 'A', 'B+')
 * @param {number} facultyId - ID of the faculty member uploading
 * @returns {Promise<Object>} Success response
 */
export const uploadGrade = async (courseId, studentId, grade, facultyId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate inputs
  if (!courseId || !studentId || !grade) {
    throw new Error('Course, student, and grade are required');
  }

  // Find course and student names for the response
  const course = mockCourses.find(c => c.id === courseId);
  const student = mockStudents.find(s => s.id === studentId);

  if (!course) {
    throw new Error('Course not found');
  }

  if (!student) {
    throw new Error('Student not found');
  }

  // In a real app, this would save to the database
  // For now, just return success
  return {
    success: true,
    message: `Grade ${grade} uploaded for ${student.name} in ${course.name}`,
    data: {
      courseId,
      courseName: course.name,
      studentId,
      studentName: student.name,
      grade,
      uploadedAt: new Date().toISOString()
    }
  };
};
