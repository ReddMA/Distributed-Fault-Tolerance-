/**
 * Retrieve authentication token from localStorage
 * @returns {string|null} Token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Retrieve user data from localStorage
 * @returns {Object|null} User object or null if not found
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists, false otherwise
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
