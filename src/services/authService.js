import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * Login function - calls real API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });

    const { token, user } = response.data;

    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};

/**
 * Logout function - clears authentication data
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
