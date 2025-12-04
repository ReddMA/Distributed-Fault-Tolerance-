import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getToken } from '../utils/auth';
// Keep mockStudents for the dropdown list
import { mockStudents } from './mockData'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- REAL API CALLS ---

export const getGrades = async () => {
  try {
    // Calls the new backend route
    const response = await api.get('/my-grades'); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadGrade = async (courseId, studentId, grade) => {
  try {
    // Calls the new backend route
    const response = await api.post('/grades/upload', {
      courseId,
      studentId,
      grade
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    throw new Error(message);
  }
};

// --- MOCK DATA CALL (SAFETY NET) ---

export const getStudents = async () => {
  // We keep this as mock data because your backend 
  // authController uses a hardcoded list, not a database we can query.
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockStudents;
};