/**
 * Application constants
 */

// Trạng thái khóa học
export const COURSE_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Trạng thái học viên
export const STUDENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  GRADUATED: "graduated",
  DROPPED: "dropped",
};

// Giới tính
export const GENDERS = [
  { value: "M", label: "Nam" },
  { value: "F", label: "Nữ" },
];

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  COURSES: "/khoa-hoc/them",
  STUDENTS: "/hoc-vien/them",
  EDIT_STUDENT: "/hoc-vien/chinh-sua/:maDK",
  DASHBOARD: "/dashboard",
};
