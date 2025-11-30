// Mock user database
const MOCK_USERS = [
  {
    id: 1,
    email: 'student@test.com',
    password: 'student123',
    name: 'John Student',
    role: 'student'
  },
  {
    id: 2,
    email: 'faculty@test.com',
    password: 'faculty123',
    name: 'Dr. Jane Faculty',
    role: 'faculty'
  }
];

/**
 * Mock login function - simulates API call with 1 second delay
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Find user by email
  const user = MOCK_USERS.find(u => u.email === email);

  // Validate credentials
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Generate mock JWT token
  const token = btoa(JSON.stringify({
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));

  // Prepare user data (without password)
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  // Store in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));

  return { token, user: userData };
};

/**
 * Mock logout function - clears authentication data
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
