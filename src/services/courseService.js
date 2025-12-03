import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getToken } from '../utils/auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle MongoDB _id to id conversion
api.interceptors.response.use(
  (response) => {
    // Convert _id to id for consistency with frontend
    if (response.data) {
      if (Array.isArray(response.data)) {
        response.data = response.data.map(item => convertIds(item));
      } else if (typeof response.data === 'object') {
        response.data = convertIds(response.data);
      }
    }
    return response;
  },
  (error) => {
    // Handle errors
    const message = error.response?.data?.error || error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

// Helper function to convert _id to id recursively
const convertIds = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const newObj = { ...obj };

  // Convert _id to id
  if (newObj._id) {
    newObj.id = newObj._id;
    delete newObj._id;
  }

  // Convert course_id._id if it exists (nested object)
  if (newObj.course_id && typeof newObj.course_id === 'object' && newObj.course_id._id) {
    newObj.course_id = newObj.course_id._id;
  }

  // Recursively convert nested objects
  Object.keys(newObj).forEach(key => {
    if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key])) {
      newObj[key] = convertIds(newObj[key]);
    }
  });

  return newObj;
};

/**
 * Get all courses with enrollment counts
 * @returns {Promise<Array>} Array of course objects
 */
export const getCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Enroll in a course
 * @param {string} courseId - MongoDB ObjectId of the course
 * @param {number} studentId - Numeric ID of the student (not used, comes from JWT)
 * @returns {Promise<Object>} Enrollment response
 */
export const enrollCourse = async (courseId, studentId) => {
  try {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return {
      success: true,
      message: response.data.message || 'Enrolled successfully',
      enrollment: response.data.enrollment
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get student's enrollments
 * @param {number} studentId - Numeric ID of the student
 * @returns {Promise<Array>} Array of enrollment objects
 */
export const getMyEnrollments = async (studentId) => {
  try {
    const response = await api.get(`/enrollments/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
