import { api } from "./client";

/**
 * API endpoints cho quản lý khóa học lái xe
 */

export const coursesApi = {
  // Lấy danh sách tất cả khóa học
  getAll: () => api.get("/KhoaHocs"),

  // Lấy thông tin một khóa học theo ID
  getById: (id) => api.get(`/KhoaHocs/${id}`),

  // Tạo khóa học mới
  create: (data) => api.post("/KhoaHocs", data),

  // Cập nhật khóa học
  update: (id, data) => api.put(`/KhoaHocs/${id}`, data),

  // Xóa khóa học
  delete: (id) => api.delete(`/KhoaHocs/${id}`),

  // Lấy danh sách học viên của khóa học
  getStudents: (id) => api.get(`/KhoaHocs/${id}/students`),

  // Đăng ký học viên vào khóa học
  enrollStudent: (courseId, studentId) =>
    api.post(`/KhoaHocs/${courseId}/students/${studentId}`),

  // Hủy đăng ký học viên
  unenrollStudent: (courseId, studentId) =>
    api.delete(`/KhoaHocs/${courseId}/students/${studentId}`),

  // Lấy danh sách khóa học theo thời gian
  getByDateRange: () =>
    api.post("/KhoaHocs/danh-sach-khoa-hoc-theo-thoi-gian", {}),
};
