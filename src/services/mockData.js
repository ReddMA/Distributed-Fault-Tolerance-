export const mockCourses = [
  {
    id: 1,
    name: 'Web Development',
    description: 'Learn HTML, CSS, JS',
    capacity: 30,
    enrolled_count: 25
  },
  {
    id: 2,
    name: 'Data Structures',
    description: 'Algorithms and DS',
    capacity: 25,
    enrolled_count: 20
  },
  {
    id: 3,
    name: 'Database Systems',
    description: 'SQL and NoSQL databases',
    capacity: 20,
    enrolled_count: 15
  },
  {
    id: 4,
    name: 'Mobile Development',
    description: 'iOS and Android apps',
    capacity: 25,
    enrolled_count: 22
  }
];

export const mockEnrollments = {
  1: [
    {
      id: 1,
      course_id: 1,
      course_name: 'Web Development',
      enrolled_at: '2024-01-15'
    },
    {
      id: 2,
      course_id: 3,
      course_name: 'Database Systems',
      enrolled_at: '2024-01-20'
    }
  ]
};

export const mockGrades = {
  1: [
    {
      id: 1,
      course_name: 'Web Development',
      grade: 'A',
      uploaded_at: '2024-05-10'
    },
    {
      id: 2,
      course_name: 'Database Systems',
      grade: 'B+',
      uploaded_at: '2024-05-12'
    }
  ]
};

export const mockStudents = [
  {
    id: 1,
    name: 'John Doe',
    email: 'student@test.com'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@test.com'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@test.com'
  }
];
