import { api } from "./client";

/**
 * API endpoints cho quản lý học viên
 */

export const studentsApi = {
  // Tạo thông tin học viên
  createStudent: (data) => api.post("/NguoiLxes", data),

  // Cập nhật thông tin học viên (cùng endpoint với create)
  updateStudent: (data) => api.post("/NguoiLxes", data),

  // Lấy danh sách học viên theo mã khóa học
  getStudentsByCourse: (maKH) =>
    api.get(`/NguoiLxes/danh-sach-hoc-vien/${maKH}`),

  // Lấy thông tin chi tiết học viên theo mã đăng ký
  getStudentDetail: (maDK) =>
    api.get(`/NguoiLxes/thong-tin-nguoi-lai-xe/${maDK}`),
};
