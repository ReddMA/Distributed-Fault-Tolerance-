import { useState, useEffect } from 'react';
import { getCourses, enrollCourse } from '../services/courseService';
import { getUser } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const user = getUser();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load courses' });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      setMessage({ type: '', text: '' });

      const response = await enrollCourse(courseId, user.id);

      setMessage({ type: 'success', text: response.message });

      await fetchCourses();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Courses</h1>
        <LoadingSpinner text="Loading courses..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Available Courses</h1>

      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {courses.map((course) => {
          const availableSlots = course.capacity - course.enrolled_count;
          const isFull = availableSlots <= 0;
          const isEnrolling = enrolling === course.id;

          return (
            <div
              key={course.id}
              style={{
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: '#333',
                fontSize: '1.3rem'
              }}>
                {course.name}
              </h3>

              <p style={{
                margin: '0 0 1rem 0',
                color: '#666',
                fontSize: '0.95rem',
                flexGrow: 1
              }}>
                {course.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                  Capacity:
                </span>
                <span style={{ fontWeight: 'bold', color: '#333' }}>
                  {course.enrolled_count} / {course.capacity}
                </span>
              </div>

              <div style={{
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  backgroundColor: isFull ? '#f8d7da' : '#d4edda',
                  color: isFull ? '#721c24' : '#155724'
                }}>
                  {isFull ? 'FULL' : `${availableSlots} slots available`}
                </span>
              </div>

              {user.role === 'student' && (
                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={isFull || isEnrolling}
                  style={{
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: isFull || isEnrolling ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isFull || isEnrolling ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isFull && !isEnrolling) {
                      e.currentTarget.style.backgroundColor = '#0056b3';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isFull && !isEnrolling) {
                      e.currentTarget.style.backgroundColor = '#007bff';
                    }
                  }}
                >
                  {isEnrolling ? 'Enrolling...' : isFull ? 'Full' : 'Enroll'}
                </button>
              )}

              {user.role === 'faculty' && (
                <div style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  backgroundColor: '#e7f3ff',
                  borderRadius: '4px',
                  color: '#004085',
                  fontSize: '0.9rem'
                }}>
                  Faculty view only
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Courses;
