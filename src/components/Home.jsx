import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

function Home() {
  // If user is logged in, send them to dashboard
  // Otherwise, send them to login
  return isAuthenticated() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Home;
