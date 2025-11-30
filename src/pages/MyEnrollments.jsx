import { useState, useEffect } from 'react';
import { getMyEnrollments } from '../services/courseService';
import { getUser } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';

function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyEnrollments(user.id);
      setEnrollments(data);
    } catch (err) {
      setError('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>My Enrollments</h1>
        <LoadingSpinner text="Loading enrollments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>My Enrollments</h1>
        <div style={{
          padding: '1rem',
          marginTop: '1rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>My Enrollments</h1>
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <p style={{
            fontSize: '1.1rem',
            color: '#6c757d',
            margin: '0'
          }}>
            You haven't enrolled in any courses yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>My Enrollments</h1>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #dee2e6'
            }}>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: 'bold',
                color: '#495057'
              }}>
                Course Name
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: 'bold',
                color: '#495057'
              }}>
                Enrollment Date
              </th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment, index) => (
              <tr
                key={enrollment.id}
                style={{
                  borderBottom: index < enrollments.length - 1 ? '1px solid #dee2e6' : 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td style={{
                  padding: '1rem',
                  color: '#212529',
                  fontSize: '1rem'
                }}>
                  {enrollment.course_name}
                </td>
                <td style={{
                  padding: '1rem',
                  color: '#6c757d',
                  fontSize: '0.95rem'
                }}>
                  {formatDate(enrollment.enrolled_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#e7f3ff',
        borderRadius: '4px',
        color: '#004085',
        fontSize: '0.9rem'
      }}>
        <strong>Total Enrollments:</strong> {enrollments.length}
      </div>
    </div>
  );
}

export default MyEnrollments;
