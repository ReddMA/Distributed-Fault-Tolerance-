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
const connectDB = require('./src/config/database');

/**
 * Sample Courses Data
 *
 * These courses will be inserted into the database.
 * enrolled_count is set for demonstration purposes.
 */
const sampleCourses = [
  {
    name: 'Web Development',
    description: 'Learn HTML, CSS, JavaScript',
    capacity: 30,
    enrolled_count: 25
  },
  {
    name: 'Data Structures',
    description: 'Algorithms and Data Structures',
    capacity: 25,
    enrolled_count: 20
  },
  {
    name: 'Database Systems',
    description: 'SQL and NoSQL databases',
    capacity: 20,
    enrolled_count: 15
  },
  {
    name: 'Mobile Development',
    description: 'iOS and Android apps',
    capacity: 25,
    enrolled_count: 22
  }
];

/**
 * Seed Database Function
 *
 * This async function:
 * 1. Connects to MongoDB
 * 2. Clears existing courses
 * 3. Inserts sample courses
 * 4. Closes connection
 */
const seedDatabase = async () => {
  try {
    // Step 1: Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    // Step 2: Clear existing courses
    console.log('🗑️  Clearing existing courses...');
    const deleteResult = await Course.deleteMany({});
    console.log(`✓ Deleted ${deleteResult.deletedCount} existing courses`);

    // Step 3: Insert sample courses
    console.log('📝 Inserting sample courses...');
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log(`✓ Successfully inserted ${insertedCourses.length} courses:`);

    // Display inserted courses
    insertedCourses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.name} (Capacity: ${course.capacity}, Enrolled: ${course.enrolled_count})`);
    });

    // Step 4: Close database connection
    console.log('\n✅ Database seeding completed successfully!');
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
