/**
 * Database Seed Script
 *
 * This script populates the MongoDB database with sample course data
 * for development and testing purposes.
 *
 * Usage: node seed.js
 *
 * Warning: This script will DELETE all existing courses before inserting new ones.
 */

const mongoose = require('mongoose');
const Course = require('./src/models/Course');
const Enrollment = require('./src/models/Enrollment');
const connectDB = require('./src/config/database');

/**
 * Sample Courses Data
 *
 * These courses will be inserted into the database.
 * Enrollment counts are created separately as actual enrollment documents.
 */
const sampleCourses = [
  {
    name: 'Web Development',
    description: 'Learn HTML, CSS, JavaScript',
    capacity: 30
  },
  {
    name: 'Data Structures',
    description: 'Algorithms and Data Structures',
    capacity: 25
  },
  {
    name: 'Database Systems',
    description: 'SQL and NoSQL databases',
    capacity: 20
  },
  {
    name: 'Mobile Development',
    description: 'iOS and Android apps',
    capacity: 25
  }
];

/**
 * Enrollment Counts
 *
 * Defines how many students should be enrolled in each course.
 * These numbers will be used to create fake enrollment records.
 */
const enrollmentCounts = [25, 20, 15, 22];

/**
 * Seed Database Function
 *
 * This async function:
 * 1. Connects to MongoDB
 * 2. Clears existing courses and enrollments
 * 3. Inserts sample courses
 * 4. Creates sample enrollments
 * 5. Closes connection
 */
const seedDatabase = async () => {
  try {
    // Step 1: Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    // Step 2: Clear existing data
    console.log('🗑️  Clearing existing courses and enrollments...');
    const deletedCourses = await Course.deleteMany({});
    const deletedEnrollments = await Enrollment.deleteMany({});
    console.log(`✓ Deleted ${deletedCourses.deletedCount} courses and ${deletedEnrollments.deletedCount} enrollments`);

    // Step 3: Insert sample courses
    console.log('📝 Inserting sample courses...');
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log(`✓ Successfully inserted ${insertedCourses.length} courses`);

    // Step 4: Create sample enrollments
    console.log('👥 Creating sample enrollments...');
    let totalEnrollments = 0;

    for (let i = 0; i < insertedCourses.length; i++) {
      const course = insertedCourses[i];
      const enrollmentCount = enrollmentCounts[i];

      // Create enrollment documents for this course
      const enrollments = [];
      for (let j = 0; j < enrollmentCount; j++) {
        // Create unique student IDs: course 0 gets students 1-25, course 1 gets 101-120, etc.
        const studentId = (i * 100) + j + 1;

        // Random enrollment date within the last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const enrolledAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        enrollments.push({
          studentId: studentId,
          course: course._id,
          status: 'active',
          enrolledAt: enrolledAt
        });
      }

      // Insert all enrollments for this course
      if (enrollments.length > 0) {
        await Enrollment.insertMany(enrollments);
        totalEnrollments += enrollments.length;
        console.log(`   ✓ ${course.name}: ${enrollmentCount} enrollments created`);
      }
    }

    console.log(`✓ Successfully created ${totalEnrollments} total enrollments\n`);

    // Step 5: Display summary with actual counts
    console.log('📊 Final Course Summary:');
    for (let i = 0; i < insertedCourses.length; i++) {
      const course = insertedCourses[i];
      const enrolledCount = enrollmentCounts[i];
      const availableSlots = course.capacity - enrolledCount;

      console.log(`   ${i + 1}. ${course.name}`);
      console.log(`      Capacity: ${course.capacity} | Enrolled: ${enrolledCount} | Available: ${availableSlots}`);
    }

    // Step 6: Close database connection
    console.log('\n✅ Database seeding completed successfully!');
    console.log('MongoDB disconnected');
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
console.log('🌱 Starting database seed...\n');
seedDatabase();
