import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';

function Dashboard() {
  const user = getUser();

  // Fallback if user data is missing
  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Dashboard</h1>
        <p>Unable to load user data.</p>
      </div>
    );
  }

  // Define navigation cards based on role
  const studentCards = [
    {
      title: 'View Courses',
      description: 'Browse and enroll in available courses',
      link: '/courses',
      icon: '📚',
      color: '#007bff'
    },
    {
      title: 'My Enrollments',
      description: 'View your enrolled courses',
      link: '/my-enrollments',
      icon: '📝',
      color: '#28a745'
    },
    {
      title: 'View Grades',
      description: 'Check your grades and performance',
      link: '/grades',
      icon: '📊',
      color: '#17a2b8'
    }
  ];

  const facultyCards = [
    {
      title: 'View Courses',
      description: 'Manage your courses',
      link: '/courses',
      icon: '📚',
      color: '#007bff'
    },
    {
      title: 'Upload Grades',
      description: 'Upload and manage student grades',
      link: '/upload-grades',
      icon: '📤',
      color: '#ffc107'
    }
  ];

  const cards = user.role === 'student' ? studentCards : facultyCards;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Welcome, {user.name}!</h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          margin: '0'
        }}>
          Role: <span style={{
            fontWeight: 'bold',
            color: user.role === 'student' ? '#007bff' : '#28a745',
            textTransform: 'capitalize'
          }}>
            {user.role}
          </span>
        </p>
      </div>

      {/* Navigation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              padding: '2rem',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              backgroundColor: '#fff',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '100%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              e.currentTarget.style.borderColor = card.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {card.icon}
              </div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: card.color,
                fontSize: '1.5rem',
                textAlign: 'center'
              }}>
                {card.title}
              </h3>
              <p style={{
                margin: '0',
                color: '#666',
                textAlign: 'center',
                fontSize: '0.95rem'
              }}>
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
