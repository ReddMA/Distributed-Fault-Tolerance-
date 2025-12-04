import { useState, useEffect } from 'react';
import { getCourses } from '../services/courseService';
import { getStudents, uploadGrade } from '../services/gradeService';
import { getUser } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';

function UploadGrades() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const user = getUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData, studentsData] = await Promise.all([
        getCourses(),
        getStudents()
      ]);
      setCourses(coursesData);
      setStudents(studentsData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!selectedCourse) {
      setMessage({ type: 'error', text: 'Please select a course' });
      return;
    }

    if (!selectedStudent) {
      setMessage({ type: 'error', text: 'Please select a student' });
      return;
    }

    if (!grade.trim()) {
      setMessage({ type: 'error', text: 'Please enter a grade' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      const response = await uploadGrade(
        selectedCourse,
        parseInt(selectedStudent),
        grade.trim(),
        user.id
      );

      setMessage({ type: 'success', text: response.message });

      // Reset form
      setSelectedCourse('');
      setSelectedStudent('');
      setGrade('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Role check - only faculty can access
  if (user.role !== 'faculty') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Upload Grades</h1>
        <div style={{
          padding: '2rem',
          marginTop: '1rem',
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderRadius: '4px',
          border: '1px solid #ffeaa7',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', fontSize: '1.1rem' }}>
            This page is only accessible to faculty members.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Upload Grades</h1>
        <LoadingSpinner text="Loading data..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Upload Grades</h1>

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

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Select Course:
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: selectedCourse ? '#212529' : '#6c757d'
            }}
          >
            <option value="" style={{ color: '#6c757d', fontStyle: 'italic' }}>
              -- Choose a course --
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id} style={{ color: '#212529', fontStyle: 'normal' }}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Select Student:
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: selectedStudent ? '#212529' : '#6c757d'
            }}
          >
            <option value="" style={{ color: '#6c757d', fontStyle: 'italic' }}>
              -- Choose a student --
            </option>
            {students.map((student) => (
              <option key={student.id} value={student.id} style={{ color: '#212529', fontStyle: 'normal' }}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Grade:
          </label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g., A, B+, C-"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
            Enter letter grade (e.g., A, A-, B+, B, C, etc.)
          </small>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: submitting ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!submitting) {
              e.currentTarget.style.backgroundColor = '#218838';
            }
          }}
          onMouseLeave={(e) => {
            if (!submitting) {
              e.currentTarget.style.backgroundColor = '#28a745';
            }
          }}
        >
          {submitting ? 'Uploading...' : 'Upload Grade'}
        </button>
      </form>
    </div>
  );
}

export default UploadGrades;
