/**
 * Type definitions (JSDoc types for better IDE support)
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} duration
 * @property {number} price
 * @property {string} instructorId
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} maxStudents
 * @property {string[]} licenseTypes
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Student
 * @property {string} id
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {string} dateOfBirth
 * @property {string} licenseType
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Instructor
 * @property {string} id
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} licenseNumber
 * @property {string[]} licenseTypes
 * @property {string} status
 */

/**
 * @typedef {Object} Enrollment
 * @property {string} id
 * @property {string} courseId
 * @property {string} studentId
 * @property {string} enrollmentDate
 * @property {string} status
 */






