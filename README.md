# Enrollment System - Frontend

A React-based enrollment management system for students and faculty members.

## Features

###  Student Features
- View available courses and enroll
- View personal enrollments
- View grades for enrolled courses
- Role-based dashboard

### Faculty Features
- View all courses
- Upload grades for students
- Role-based dashboard

### General Features
- Authentication (login/logout)
- Protected routes
- Role-based access control
- Responsive design
- Loading states and error handling

## Tech Stack

- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.1
- **Routing:** React Router DOM 6.26.0
- **HTTP Client:** Axios 1.7.2
- **Styling:** Inline CSS (no external library)

## Getting Started

### Prerequisites

- Node.js (v20.14.0 or higher recommended)
- npm (v10.8.1 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Distributed-Fault-Tolerance-
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```
(Port may vary if 5173 is in use)

## Test Credentials

### Student Account
- **Email:** student@test.com
- **Password:** student123
- **Name:** John Student
- **ID:** 1

### Faculty Account
- **Email:** faculty@test.com
- **Password:** faculty123
- **Name:** Dr. Jane Faculty
- **ID:** 2

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar with auth
│   ├── ProtectedRoute.jsx  # Route protection wrapper
│   ├── LoadingSpinner.jsx  # Loading indicator
│   └── ErrorMessage.jsx    # Error display component
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Dashboard.jsx   # Role-based dashboard
│   ├── Courses.jsx     # Course listing & enrollment
│   ├── MyEnrollments.jsx   # Student enrollments
│   ├── Grades.jsx      # Student grades view
│   └── UploadGrades.jsx    # Faculty grade upload
├── services/           # API service layer
│   ├── authService.js  # Authentication services
│   ├── courseService.js # Course & enrollment services
│   ├── gradeService.js # Grade services
│   └── mockData.js     # Mock data for development
├── utils/              # Utility functions
│   └── auth.js         # Auth helper functions
├── config.js           # Configuration & theme
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Available Pages

### Public Routes
- `/login` - User authentication

### Protected Routes (Students)
- `/dashboard` - Student dashboard
- `/courses` - Browse and enroll in courses
- `/my-enrollments` - View enrolled courses
- `/grades` - View grades

### Protected Routes (Faculty)
- `/dashboard` - Faculty dashboard
- `/courses` - View all courses
- `/upload-grades` - Upload student grades

## Mock Data

The application currently uses mock data for development. The following data is available:

### Courses (4 courses)
1. Web Development (30 capacity, 25 enrolled)
2. Data Structures (25 capacity, 20 enrolled)
3. Database Systems (20 capacity, 15 enrolled)
4. Mobile Development (25 capacity, 22 enrolled)

### Students (3 students)
1. John Doe (student@test.com)
2. Jane Smith (jane@test.com)
3. Bob Johnson (bob@test.com)

### Sample Enrollments
- Student ID 1 is enrolled in:
  - Web Development (enrolled: 2024-01-15)
  - Database Systems (enrolled: 2024-01-20)

### Sample Grades
- Student ID 1 has grades:
  - Web Development: A (uploaded: 2024-05-10)
  - Database Systems: B+ (uploaded: 2024-05-12)

## API Endpoints (For Backend Team)

The frontend expects the following API endpoints to be implemented:

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST /auth/login
Login user and return JWT token
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string",
    "role": "student" | "faculty"
  }
}
```

#### POST /auth/logout
Logout user (optional - currently handled client-side)

### Course Endpoints

#### GET /courses
Get all available courses
```json
Response:
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "capacity": "number",
    "enrolled_count": "number"
  }
]
```

#### POST /courses/:courseId/enroll
Enroll student in a course
```json
Request:
{
  "studentId": "number"
}

Response:
{
  "success": "boolean",
  "message": "string",
  "course": { /* course object */ }
}
```

### Enrollment Endpoints

#### GET /enrollments/student/:studentId
Get enrollments for a specific student
```json
Response:
[
  {
    "id": "number",
    "course_id": "number",
    "course_name": "string",
    "enrolled_at": "string (ISO date)"
  }
]
```

### Grade Endpoints

#### GET /grades/student/:studentId
Get grades for a specific student
```json
Response:
[
  {
    "id": "number",
    "course_name": "string",
    "grade": "string",
    "uploaded_at": "string (ISO date)"
  }
]
```

#### POST /grades/upload
Upload a grade (faculty only)
```json
Request:
{
  "courseId": "number",
  "studentId": "number",
  "grade": "string",
  "facultyId": "number"
}

Response:
{
  "success": "boolean",
  "message": "string",
  "data": {
    "courseId": "number",
    "courseName": "string",
    "studentId": "number",
    "studentName": "string",
    "grade": "string",
    "uploadedAt": "string (ISO date)"
  }
}
```

#### GET /students
Get all students (faculty only)
```json
Response:
[
  {
    "id": "number",
    "name": "string",
    "email": "string"
  }
]
```

## Authentication Flow

1. User logs in with email/password
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Frontend includes token in Authorization header for protected requests
5. On logout, token is cleared from localStorage

## Error Handling

The application handles errors at multiple levels:
- Network errors (API unavailable)
- Authentication errors (invalid credentials)
- Validation errors (missing required fields)
- Business logic errors (course full, etc.)

All errors are displayed to users with appropriate messaging.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Future Enhancements

- Real-time notifications
- Email confirmations
- Advanced filtering and search
- Analytics dashboard
- Export functionality (PDF, CSV)
- File upload for bulk grade imports
- Student profile management
- Course prerequisites
- Waiting list for full courses

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly with both student and faculty accounts
4. Submit a pull request

## License

MIT License

## Contact

For questions or support, please open an issue in the repository.
