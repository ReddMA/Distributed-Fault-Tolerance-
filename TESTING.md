# Testing Checklist

This document provides a comprehensive testing checklist for the Enrollment System. Test all features with both student and faculty accounts to ensure proper functionality and role-based access control.

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

## Student Account Testing

### Login Flow
- [ ] Navigate to `/login` page
- [ ] Enter student credentials
- [ ] Verify loading spinner appears during authentication
- [ ] Verify successful redirect to `/dashboard`
- [ ] Verify student name appears in navbar
- [ ] Verify JWT token stored in localStorage
- [ ] Verify user data stored in localStorage

### Dashboard
- [ ] Verify page displays "Student Dashboard" title
- [ ] Verify 3 cards are displayed:
  - [ ] "My Courses" card with link to /courses
  - [ ] "My Enrollments" card with link to /my-enrollments
  - [ ] "My Grades" card with link to /grades
- [ ] Verify all cards have hover effects
- [ ] Click each card and verify navigation works

### Navigation Bar
- [ ] Verify "Enrollment System" branding visible
- [ ] Verify student navigation links present:
  - [ ] Dashboard
  - [ ] Courses
  - [ ] My Enrollments
  - [ ] Grades
- [ ] Verify active page is highlighted (white background, bold text)
- [ ] Verify student name displayed in navbar
- [ ] Verify Logout button present and styled in red
- [ ] Verify "Upload Grades" link NOT visible (faculty-only)

### Courses Page
- [ ] Navigate to `/courses` page
- [ ] Verify loading spinner appears initially
- [ ] Verify all 4 courses displayed in grid layout:
  - [ ] Web Development
  - [ ] Data Structures
  - [ ] Database Systems
  - [ ] Mobile Development
- [ ] For each course, verify:
  - [ ] Course name displayed
  - [ ] Course description displayed
  - [ ] Capacity shown (enrolled/total)
  - [ ] Available slots badge displayed
  - [ ] "Enroll" button visible (not "Faculty view only")
- [ ] Verify full courses show "FULL" status in red badge
- [ ] Verify available courses show slot count in green badge
- [ ] Click "Enroll" on available course
- [ ] Verify "Enrolling..." button state during submission
- [ ] Verify success message appears after enrollment
- [ ] Verify course list refreshes with updated enrollment count
- [ ] Try enrolling in full course (if any)
- [ ] Verify appropriate error message for full courses
- [ ] Verify button hover effects work

### My Enrollments Page
- [ ] Navigate to `/my-enrollments` page
- [ ] Verify loading spinner appears initially
- [ ] Verify enrolled courses displayed in table format
- [ ] Verify table has proper headers:
  - [ ] Course Name
  - [ ] Enrollment Date
- [ ] Verify at least 2 enrollments visible (Web Development, Database Systems)
- [ ] Verify dates formatted as "Month Day, Year" (e.g., "January 15, 2024")
- [ ] Verify table rows have hover effect (gray background)
- [ ] Verify total enrollment count displayed at bottom
- [ ] If no enrollments, verify empty state message: "You haven't enrolled in any courses yet"

### Grades Page
- [ ] Navigate to `/grades` page
- [ ] Verify loading spinner appears initially
- [ ] Verify grades displayed in table format
- [ ] Verify table has proper headers:
  - [ ] Course Name
  - [ ] Grade
  - [ ] Uploaded Date
- [ ] Verify at least 2 grades visible (Web Development: A, Database Systems: B+)
- [ ] Verify grade badges are color-coded:
  - [ ] A grades: Green background
  - [ ] B grades: Teal background
  - [ ] C grades: Yellow background
  - [ ] D grades: Orange background
  - [ ] F grades: Red background
- [ ] Verify dates formatted as "Month Day, Year"
- [ ] Verify table rows have hover effect
- [ ] If no grades, verify empty state message: "No grades available yet"

### Upload Grades Access Control
- [ ] Try to navigate to `/upload-grades` page
- [ ] Verify warning message displayed: "This page is only accessible to faculty members."
- [ ] Verify yellow alert box styling
- [ ] Verify no grade upload form visible
- [ ] Verify navigation still works (not completely blocked)

### Logout
- [ ] Click "Logout" button in navbar
- [ ] Verify redirect to `/login` page
- [ ] Verify localStorage cleared (check browser DevTools)
- [ ] Try to navigate to `/dashboard` directly
- [ ] Verify redirect back to `/login` (protected route works)

## Faculty Account Testing

### Login Flow
- [ ] Navigate to `/login` page
- [ ] Enter faculty credentials
- [ ] Verify loading spinner appears during authentication
- [ ] Verify successful redirect to `/dashboard`
- [ ] Verify faculty name appears in navbar
- [ ] Verify JWT token stored in localStorage
- [ ] Verify user data stored in localStorage

### Dashboard
- [ ] Verify page displays "Faculty Dashboard" title
- [ ] Verify 2 cards are displayed:
  - [ ] "All Courses" card with link to /courses
  - [ ] "Upload Grades" card with link to /upload-grades
- [ ] Verify all cards have hover effects
- [ ] Click each card and verify navigation works

### Navigation Bar
- [ ] Verify "Enrollment System" branding visible
- [ ] Verify faculty navigation links present:
  - [ ] Dashboard
  - [ ] Courses
  - [ ] Upload Grades
- [ ] Verify active page is highlighted (white background, bold text)
- [ ] Verify faculty name displayed in navbar
- [ ] Verify Logout button present and styled in red
- [ ] Verify "My Enrollments" link NOT visible (student-only)
- [ ] Verify "Grades" link NOT visible (student-only)

### Courses Page
- [ ] Navigate to `/courses` page
- [ ] Verify loading spinner appears initially
- [ ] Verify all 4 courses displayed in grid layout
- [ ] For each course, verify:
  - [ ] Course name displayed
  - [ ] Course description displayed
  - [ ] Capacity shown (enrolled/total)
  - [ ] Available slots badge displayed
  - [ ] "Faculty view only" message shown (NOT enroll button)
- [ ] Verify blue info box styling for faculty message
- [ ] Verify NO enroll buttons visible

### Upload Grades Page
- [ ] Navigate to `/upload-grades` page
- [ ] Verify loading spinner appears initially with "Loading data..." message
- [ ] Verify page title: "Upload Grades"
- [ ] Verify form displayed with white background and shadow
- [ ] Verify form contains:
  - [ ] "Select Course" dropdown with all courses
  - [ ] "Select Student" dropdown with all students
  - [ ] "Grade" text input field
  - [ ] "Upload Grade" submit button (green)

### Course Dropdown
- [ ] Verify placeholder text: "-- Choose a course --" in gray italic
- [ ] Click dropdown and verify all courses listed
- [ ] Verify course options in black non-italic text
- [ ] Select a course
- [ ] Verify dropdown text changes to black when course selected

### Student Dropdown
- [ ] Verify placeholder text: "-- Choose a student --" in gray italic
- [ ] Click dropdown and verify all students listed with email
- [ ] Verify format: "Name (email)" (e.g., "John Doe (student@test.com)")
- [ ] Verify student options in black non-italic text
- [ ] Select a student
- [ ] Verify dropdown text changes to black when student selected

### Grade Input
- [ ] Verify placeholder text: "e.g., A, B+, C-"
- [ ] Verify helper text below input: "Enter letter grade (e.g., A, A-, B+, B, C, etc.)"
- [ ] Enter a grade (e.g., "A")
- [ ] Verify text appears correctly

### Grade Upload Submission
- [ ] Try submitting form without selecting course
- [ ] Verify error message: "Please select a course"
- [ ] Try submitting form without selecting student
- [ ] Verify error message: "Please select a student"
- [ ] Try submitting form without entering grade
- [ ] Verify error message: "Please enter a grade"
- [ ] Fill all fields correctly
- [ ] Submit form
- [ ] Verify button shows "Uploading..." during submission
- [ ] Verify button disabled during submission
- [ ] Verify success message appears after upload
- [ ] Verify form resets (all fields cleared) after successful upload
- [ ] Upload another grade to verify functionality works multiple times

### Logout
- [ ] Click "Logout" button in navbar
- [ ] Verify redirect to `/login` page
- [ ] Verify localStorage cleared
- [ ] Try to navigate to `/dashboard` directly
- [ ] Verify redirect back to `/login` (protected route works)

## General Testing

### Protected Routes
- [ ] Clear localStorage manually (browser DevTools)
- [ ] Try to access `/dashboard` directly
- [ ] Verify redirect to `/login`
- [ ] Try to access `/courses` directly
- [ ] Verify redirect to `/login`
- [ ] Try to access `/my-enrollments` directly
- [ ] Verify redirect to `/login`
- [ ] Try to access `/grades` directly
- [ ] Verify redirect to `/login`
- [ ] Try to access `/upload-grades` directly
- [ ] Verify redirect to `/login`

### Navigation Active States
- [ ] Login as student
- [ ] Visit each page and verify active page highlighted in navbar:
  - [ ] Dashboard page shows Dashboard highlighted
  - [ ] Courses page shows Courses highlighted
  - [ ] My Enrollments page shows My Enrollments highlighted
  - [ ] Grades page shows Grades highlighted
- [ ] Login as faculty
- [ ] Visit each page and verify active page highlighted in navbar:
  - [ ] Dashboard page shows Dashboard highlighted
  - [ ] Courses page shows Courses highlighted
  - [ ] Upload Grades page shows Upload Grades highlighted

### Loading States
- [ ] Verify loading spinner appears on all data-fetching pages:
  - [ ] Courses page
  - [ ] My Enrollments page
  - [ ] Grades page
  - [ ] Upload Grades page
- [ ] Verify loading text is descriptive (e.g., "Loading courses...", "Loading data...")
- [ ] Verify spinner animation is smooth and centered
- [ ] Verify page title still visible during loading

### Error Handling
- [ ] Test login with incorrect credentials
- [ ] Verify error message: "Invalid email or password"
- [ ] Verify error styling (red background, red text)
- [ ] Test network errors (simulate by modifying service delay or throwing errors)
- [ ] Verify appropriate error messages displayed
- [ ] Verify errors don't crash the application

### Form Interactions
- [ ] Test all input fields for focus states (blue border glow)
- [ ] Test all select dropdowns for focus states
- [ ] Verify smooth transitions on hover effects
- [ ] Verify button hover effects work consistently:
  - [ ] Blue buttons darken on hover
  - [ ] Green buttons darken on hover
  - [ ] Red buttons darken on hover
- [ ] Verify disabled buttons show cursor: not-allowed
- [ ] Verify disabled buttons don't change color on hover

### Responsive Design
- [ ] Resize browser window to various widths
- [ ] Verify navbar wraps properly on small screens
- [ ] Verify course cards adjust grid layout on small screens
- [ ] Verify tables remain readable on small screens
- [ ] Verify forms remain usable on small screens
- [ ] Test on mobile device (if available)

### Browser Compatibility
- [ ] Test in Chrome/Chromium
- [ ] Test in Firefox
- [ ] Test in Safari (if on Mac)
- [ ] Test in Edge
- [ ] Verify all features work consistently across browsers

### Data Persistence
- [ ] Login as student
- [ ] Enroll in a course
- [ ] Refresh the page (F5)
- [ ] Verify still logged in (token persists)
- [ ] Verify enrollment count updated on Courses page
- [ ] Navigate to My Enrollments
- [ ] Verify new enrollment appears
- [ ] Close browser tab
- [ ] Reopen application
- [ ] Verify still logged in (localStorage persists across sessions)

### Mock Data Validation
- [ ] Verify all 4 courses are available
- [ ] Verify course capacities are realistic (20-30)
- [ ] Verify enrolled counts are less than capacity
- [ ] Verify at least 3 students in student dropdown
- [ ] Verify mock enrollments exist for student ID 1
- [ ] Verify mock grades exist for student ID 1
- [ ] Verify date formatting is consistent (ISO dates converted properly)

## Regression Testing (After Code Changes)

Whenever you make changes to the codebase, run through this abbreviated checklist:

### Critical Path (Student)
- [ ] Login as student
- [ ] View dashboard
- [ ] Browse courses
- [ ] Enroll in a course
- [ ] View enrollments
- [ ] View grades
- [ ] Logout

### Critical Path (Faculty)
- [ ] Login as faculty
- [ ] View dashboard
- [ ] Browse courses
- [ ] Upload a grade
- [ ] Logout

### Cross-Cutting Concerns
- [ ] Verify no console errors
- [ ] Verify no React warnings
- [ ] Verify loading states work
- [ ] Verify error messages display
- [ ] Verify navigation active states work
- [ ] Verify protected routes still redirect

## Known Limitations

Current limitations of the mock data implementation:

1. **No Real Backend**: All data is stored in memory and resets on page refresh
2. **Duplicate Enrollments**: System doesn't prevent enrolling in same course twice
3. **No Enrollment Validation**: Can enroll even if already at capacity after refresh
4. **Mock Delays**: 1-second delays may seem artificial (real APIs vary)
5. **Limited Students**: Only 3 students available in faculty dropdown
6. **No Grade History**: Uploading grade for same student/course overwrites previous grade
7. **No Authentication Expiry**: Tokens never expire (real JWTs should have expiration)
8. **No Password Security**: Passwords stored in plain text in mockData (for demo only)

These limitations are expected for a frontend-only demo and will be resolved when integrated with a real backend API.

## Test Results Template

Use this template to document your test results:

```
Test Date: ___________
Tester Name: ___________
Browser: ___________
OS: ___________

Student Account Tests: PASS / FAIL
Faculty Account Tests: PASS / FAIL
General Tests: PASS / FAIL

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
```

## Automated Testing (Future Enhancement)

For future development, consider adding:

- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress
- Integration tests for service layer
- Accessibility tests with axe-core
- Visual regression tests with Percy or Chromatic

## Questions or Issues?

If you find any bugs or have questions about testing procedures, please open an issue in the repository.
