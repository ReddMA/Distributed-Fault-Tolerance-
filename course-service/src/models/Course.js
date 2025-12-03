const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Course capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [500, 'Capacity cannot exceed 500']
  },
  enrolled_count: {
    type: Number,
    default: 0,
    min: [0, 'Enrolled count cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to get enrollment count
courseSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'course',
  count: true
});

// Method to check if course is full
courseSchema.methods.isFull = async function() {
  const Enrollment = mongoose.model('Enrollment');
  const enrollmentCount = await Enrollment.countDocuments({ course: this._id });
  return enrollmentCount >= this.capacity;
};

// Method to get available slots
courseSchema.methods.getAvailableSlots = async function() {
  const Enrollment = mongoose.model('Enrollment');
  const enrollmentCount = await Enrollment.countDocuments({ course: this._id });
  return this.capacity - enrollmentCount;
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
