# Course Service - MongoDB Backend

A RESTful API service for managing course enrollments using Node.js, Express, and MongoDB.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [MongoDB Setup](#mongodb-setup)
- [Environment Variables](#environment-variables)
- [Running the Service](#running-the-service)
- [Database Seeding](#database-seeding)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing with Postman](#testing-with-postman)
- [Testing with cURL](#testing-with-curl)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (Student/Faculty)
- ✅ Course management with enrollment tracking
- ✅ Real-time enrollment counts
- ✅ MongoDB with Mongoose ODM
- ✅ Comprehensive error handling
- ✅ Request logging
- ✅ CORS enabled

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 9.0.0** - MongoDB ODM
- **jsonwebtoken 9.0.2** - JWT authentication
- **cors 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 17.2.3** - Environment variable management

## Prerequisites

Before running this service, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)
- **Postman** (optional, for testing) - [Download](https://www.postman.com/downloads/)

## Installation

1. **Clone the repository:**
   ```bash
   cd course-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   Or create `.env` manually (see [Environment Variables](#environment-variables))

## MongoDB Setup

### Option 1: Local MongoDB Installation

1. **Download and install MongoDB:**
   - Windows: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Mac: `brew tap mongodb/brew && brew install mongodb-community`
   - Linux: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB service:**
   - Windows: MongoDB should start automatically as a service
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   ```
   You should see the MongoDB shell prompt.

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string and update `MONGODB_URI` in `.env`

## Environment Variables

Create a `.env` file in the `course-service` directory:

```env
# Server Configuration
PORT=3001

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/enrollment_db

# JWT Configuration
JWT_SECRET=your_secret_key_here_change_in_production

# Optional: Node Environment
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a strong random string in production.

## Running the Service

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The service will start on `http://localhost:3001`

### Verify Service is Running
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Course Service is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Database Seeding

Populate the database with sample courses:

```bash
npm run seed
```

This will:
- Delete existing courses
- Insert 4 sample courses:
  - Web Development (capacity: 30, enrolled: 25)
  - Data Structures (capacity: 25, enrolled: 20)
  - Database Systems (capacity: 20, enrolled: 15)
  - Mobile Development (capacity: 25, enrolled: 22)

## API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/courses` | ✅ | Any | Get all courses |
| GET | `/courses/:id` | ✅ | Any | Get course by ID |
| POST | `/courses/:id/enroll` | ✅ | Student | Enroll in course |
| GET | `/my-enrollments` | ✅ | Student | Get my enrollments |
| GET | `/enrollments/student/:id` | ✅ | Any | Get student enrollments |

### Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

## Authentication

All API endpoints require JWT authentication via Bearer token.

### Token Format
```
Authorization: Bearer <your_jwt_token>
```

### JWT Payload Structure
```json
{
  "id": 1,
  "role": "student",
  "iat": 1640000000,
  "exp": 1640086400
}
```

**Note:** This service doesn't include login/registration endpoints. JWT tokens must be generated by a separate authentication service.

### Creating Test Tokens (for development)

You can create test tokens using Node.js:

```javascript
const jwt = require('jsonwebtoken');

// Student token
const studentToken = jwt.sign(
  { id: 1, role: 'student' },
  'your_secret_key_here',
  { expiresIn: '24h' }
);
console.log('Student Token:', studentToken);

// Faculty token
const facultyToken = jwt.sign(
  { id: 100, role: 'faculty' },
  'your_secret_key_here',
  { expiresIn: '24h' }
);
console.log('Faculty Token:', facultyToken);
```

## Testing with Postman

### 1. Setup Environment Variables in Postman

Create variables:
- `base_url`: `http://localhost:3001/api`
- `token`: `<your_jwt_token>`

### 2. Test GET /courses

**Request:**
```
GET {{base_url}}/courses
Headers:
  Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Web Development",
    "description": "Learn HTML, CSS, JavaScript",
    "capacity": 30,
    "enrolled_count": 25,
    "available_slots": 5
  }
]
```

### 3. Test POST /courses/:id/enroll

**Request:**
```
POST {{base_url}}/courses/507f1f77bcf86cd799439011/enroll
Headers:
  Authorization: Bearer {{token}}
```

**Expected Response (201):**
```json
{
  "message": "Enrolled successfully",
  "enrollment": {
    "id": "507f191e810c19729de860ea",
    "student_id": 1,
    "course_id": "507f1f77bcf86cd799439011",
    "enrolled_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Test GET /enrollments/student/:id

**Request:**
```
GET {{base_url}}/enrollments/student/1
Headers:
  Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
[
  {
    "id": "507f191e810c19729de860ea",
    "course_id": "507f1f77bcf86cd799439011",
    "course_name": "Web Development",
    "enrolled_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## Testing with cURL

### 1. Get All Courses
```bash
curl -X GET http://localhost:3001/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Get Course by ID
```bash
curl -X GET http://localhost:3001/api/courses/COURSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Enroll in Course
```bash
curl -X POST http://localhost:3001/api/courses/COURSE_ID/enroll \
  -H "Authorization: Bearer YOUR_STUDENT_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Get My Enrollments
```bash
curl -X GET http://localhost:3001/api/my-enrollments \
  -H "Authorization: Bearer YOUR_STUDENT_JWT_TOKEN"
```

### 5. Get Student Enrollments by ID
```bash
curl -X GET http://localhost:3001/api/enrollments/student/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

### Common Errors

#### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```
**Solution:** Include Authorization header with Bearer token

#### 403 Forbidden
```json
{
  "error": "Access denied. Student role required."
}
```
**Solution:** Use token with appropriate role

#### 400 Bad Request - Invalid Course ID
```json
{
  "error": "Invalid course ID format"
}
```
**Solution:** Use valid 24-character hex MongoDB ObjectId

#### 400 Bad Request - Course Full
```json
{
  "error": "Course is full"
}
```
**Solution:** Choose a different course with available slots

#### 400 Bad Request - Already Enrolled
```json
{
  "error": "Already enrolled in this course"
}
```
**Solution:** You're already enrolled in this course

#### 404 Not Found
```json
{
  "error": "Course not found"
}
```
**Solution:** Verify the course ID exists in the database

#### 500 Internal Server Error
```json
{
  "error": "Failed to fetch courses",
  "message": "Detailed error message"
}
```
**Solution:** Check server logs and database connection

## Project Structure

```
course-service/
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic (login)
│   │   └── courseController.js   # Course & enrollment business logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & role-based access/authorization
│   ├── models/
│   │   ├── Course.js             # Course Mongoose schema
│   │   └── Enrollment.js         # Enrollment Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth API routes
│   │   └── courseRoutes.js       # Course API routes
│   └── server.js                 # Express app & server startup
├── seed.js                        # Database seeding script
├── .env                           # Environment variables 
├── package.json                   # Dependencies & scripts
└── README.md                      # Documentation
```

## Development Tips

### View MongoDB Data

Using MongoDB Shell:
```bash
mongosh
use enrollment_db
db.courses.find().pretty()
db.enrollments.find().pretty()
```

### Clear Database
```bash
mongosh enrollment_db --eval "db.dropDatabase()"
```

Then re-run seed script:
```bash
npm run seed
```

### Check Server Logs

The server logs all requests in format:
```
[2024-01-15T10:30:00.000Z] GET /api/courses
[2024-01-15T10:30:05.000Z] POST /api/courses/507f1f77bcf86cd799439011/enroll
```

## Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running (`mongosh` to verify)

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:** Change PORT in `.env` or kill process using port 3001

### JWT Verification Failed
```
Error: Invalid or expired token
```
**Solution:** Generate new JWT token or verify JWT_SECRET matches

## License

This project is part of a distributed fault-tolerant enrollment system.

---

**For questions or issues, please contact the development team.**
