import { api } from "./client";

/**
 * API endpoints cho quản lý học viên
 */

export const studentsApi = {
  // Tạo thông tin học viên
  createStudent: (data) => api.post("/NguoiLxes", data),

  // Lấy danh sách học viên theo mã khóa học
  getStudentsByCourse: (maKH) =>
    api.get(`/NguoiLxes/danh-sach-hoc-vien/${maKH}`),
};
