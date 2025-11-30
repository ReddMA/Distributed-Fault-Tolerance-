import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';
import { getUser } from '../utils/auth';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: isActive(path) ? 'rgba(255,255,255,0.2)' : 'transparent',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    transition: 'all 0.2s'
  });

  return (
    <nav style={{
      padding: '1rem 2rem',
      backgroundColor: '#007bff',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ marginRight: 'auto', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Enrollment System
        </div>

        {user && (
          <>
            <Link to="/dashboard" style={linkStyle('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/courses" style={linkStyle('/courses')}>
              Courses
            </Link>
            {user.role === 'student' && (
              <>
                <Link to="/my-enrollments" style={linkStyle('/my-enrollments')}>
                  My Enrollments
                </Link>
                <Link to="/grades" style={linkStyle('/grades')}>
                  Grades
                </Link>
              </>
            )}
            {user.role === 'faculty' && (
              <Link to="/upload-grades" style={linkStyle('/upload-grades')}>
                Upload Grades
              </Link>
            )}

            <div style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              {user.name}
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#c82333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc3545';
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
