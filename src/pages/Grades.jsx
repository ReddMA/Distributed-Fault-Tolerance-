import { useState, useEffect } from 'react';
import { getGrades } from '../services/gradeService';
import { getUser } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';

function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getGrades(user.id);
      setGrades(data);
    } catch (err) {
      setError('Failed to load grades');
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

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#28a745'; // Green for A grades
    if (grade.startsWith('B')) return '#17a2b8'; // Teal for B grades
    if (grade.startsWith('C')) return '#ffc107'; // Yellow for C grades
    if (grade.startsWith('D')) return '#fd7e14'; // Orange for D grades
    return '#dc3545'; // Red for F grades
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Grades</h1>
        <LoadingSpinner text="Loading grades..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Grades</h1>
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

  if (grades.length === 0) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Grades</h1>
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
            No grades available yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Grades</h1>

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
                Grade
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: 'bold',
                color: '#495057'
              }}>
                Date Uploaded
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((gradeRecord, index) => (
              <tr
                key={gradeRecord.id}
                style={{
                  borderBottom: index < grades.length - 1 ? '1px solid #dee2e6' : 'none',
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
                  {gradeRecord.course_name}
                </td>
                <td style={{
                  padding: '1rem'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: getGradeColor(gradeRecord.grade),
                    color: 'white'
                  }}>
                    {gradeRecord.grade}
                  </span>
                </td>
                <td style={{
                  padding: '1rem',
                  color: '#6c757d',
                  fontSize: '0.95rem'
                }}>
                  {formatDate(gradeRecord.uploaded_at)}
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
        <strong>Total Grades:</strong> {grades.length}
      </div>
    </div>
  );
}

export default Grades;
